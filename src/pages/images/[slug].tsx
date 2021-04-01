import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import NextError from 'next/error';
import NextImage from 'next/image';
import {API, Storage, Auth} from 'aws-amplify';
import {ArrowBackIcon} from '@chakra-ui/icons';
import {
  VStack,
  Box,
  IconButton,
  Button,
  Input,
  Image as ChakraImage,
  UnorderedList,
  ListItem,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useToast,
} from '@chakra-ui/react';
import {GetStaticProps, InferGetStaticPropsType, GetStaticPaths} from 'next';
import {useDisclosure} from '@chakra-ui/react';
import {
  destroyImage,
  getIdFromKey,
  isString,
  isListImagesData,
} from '../../lib/image';
import {ErrorAlert} from '../../components/ErrorAlert';
import {keywordsByImageId, listImages} from '../../graphql/queries';
import {GRAPHQL_AUTH_MODE} from '@aws-amplify/api-graphql';
import {isKeywordList, isKeywordsByImageId} from '../../lib/keyword';
import {UpdateKeywordsOnImageMutationVariables} from '../../API';

const updateKeywordsOnImage = /* GraphQL */ `
  mutation UpdateKeywordsOnImage($textList: [String], $imageId: ID) {
    updateKeywordsOnImage(textList: $textList, imageId: $imageId) {
      id
      text
    }
  }
`;

const MAX_KEYWORD_COUNT = 10;
const IMAGE_WIDTH = 300;

export const getStaticPaths: GetStaticPaths = async _context => {
  const listImagesData = await API.graphql({
    query: listImages,
    authMode: GRAPHQL_AUTH_MODE.API_KEY,
  });
  if (!isListImagesData(listImagesData)) {
    throw new Error('non-listImagesData returned.');
  }
  const paths = listImagesData.data.listImages.items.map(image => {
    return {params: {slug: image.key}};
  });
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const slug = context.params.slug;

  if (typeof slug !== 'string') {
    throw new Error('slug is not string');
  }
  return {
    props: {slug},
  };
};

const DeleteButton = ({
  buttonText,
  isDisabled,
  handleDeleteButtonClicked,
}: {
  buttonText: string;
  isDisabled: boolean;
  handleDeleteButtonClicked: (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
}) => {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const onDeleteButtonClick = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    await handleDeleteButtonClicked(event);
    onClose();
  };

  return (
    <span>
      <Button colorScheme="red" onClick={onOpen}>
        {buttonText}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure?</Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={onDeleteButtonClick}
              isDisabled={isDisabled}
              disabled={isDisabled}
            >
              Delete image
            </Button>
            <Button variant="ghost" onClick={onClose}>
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </span>
  );
};

const ImagePage = ({slug}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isDestroyingImage, setIsDestroyingImage] = useState<boolean>(false);
  const [
    deleteImageErrorMessage,
    setDeleteImageErrorMessage,
  ] = useState<string>('');
  const [key, setKey] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [textList, setTextList] = useState<string[]>(['']);
  // const [imageWidth, setImageWidth] = useState<number>(IMAGE_WIDTH);
  // const [imageHeight, setImageHeight] = useState<number>(IMAGE_WIDTH);
  const [isUpdatingKeywords, setIsUpdatingKeywords] = useState<boolean>(false);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await Auth.currentAuthenticatedUser();
      console.log({user});
      const id = getIdFromKey(slug);
      setId(id);
      let keywordsByImageIdData;
      try {
        keywordsByImageIdData = await API.graphql({
          query: keywordsByImageId,
          variables: {
            imageId: id,
          },
        });
      } catch (e) {
        console.log(e);
        return;
      }
      if (isKeywordsByImageId(keywordsByImageIdData)) {
        const keywords = keywordsByImageIdData.data.keywordsByImageId.items.filter(
          keyword => {
            return keyword.imageId === id;
          }
        );
        if (isKeywordList(keywords)) {
          setTextList(
            keywords.map(keyword => {
              return keyword.text;
            })
          );
        }
      }
      setKey(slug);
      const url = await Storage.get(slug, {download: false}).catch(e => {
        console.log(e);
      });
      console.log({url});
      if (isString(url)) {
        setImageUrl(url);
      }
    })();
  }, [slug]);

  const {w: width, h: height} = router.query;
  if (typeof height !== 'string' || typeof width !== 'string') {
    return <NextError statusCode={404} />;
  }
  if (typeof slug !== 'string') {
    throw new Error('slug should not be an array.');
  }

  const generateHandleTextChange = (idx: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTextList = [...textList];
      newTextList[idx] = event.target.value;
      setTextList(newTextList);
    };
  };

  const generateHandleRemoveClicked = (idx: number) => {
    return (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const newTextList = [];
      for (let i = 0; i < textList.length; i++) {
        if (i === idx) {
          continue;
        }
        newTextList.push(textList[i]);
      }

      setTextList(newTextList);
    };
  };

  const handleDeleteButtonClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (key !== '' && id !== '') {
      setIsDestroyingImage(true);
      const error = await destroyImage({id, key})
        .catch(e => {
          console.log(e);
          setDeleteImageErrorMessage('Failed to delete the image');
        })
        .finally(() => {
          setIsDestroyingImage(false);
        });
      if (error) {
        console.log(error);
        toast({
          title: 'Failed to delete the image',
          description: 'Failed to delete the image and its keywords.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Image deleted',
          description: 'Successfully deleted the image and its keywords.',
          status: 'success',
          duration: 9000,
          isClosable: true,
        });
        router.push('/');
      }
    }
  };

  const handleAddKeywordClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log({textList});
    if (textList.length >= MAX_KEYWORD_COUNT) {
      return;
    }
    const newTextList = [...textList];
    newTextList.push('');
    setTextList(newTextList);
  };

  const handleUpdateTextClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      const variables: UpdateKeywordsOnImageMutationVariables = {
        textList: textList,
        imageId: id,
      };
      setIsUpdatingKeywords(true);
      await API.graphql({
        variables,
        query: updateKeywordsOnImage,
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      });
      toast({
        title: 'Keywords updated',
        description: 'Successfully updated the keywords',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      toast({
        title: 'Failed to update the keywords',
        description: 'Could not updated the keywords',
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
      console.log({e});
    }
    setIsUpdatingKeywords(false);
  };

  const onBackButtonClicked = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    router.push('/');
  };

  return (
    <VStack>
      <Box m={5}>
        <IconButton
          aria-label="Back"
          icon={<ArrowBackIcon />}
          onClick={onBackButtonClicked}
          size="lg"
        />
        <Box mt={5}>
          <NextImage
            src={imageUrl ? imageUrl : '/images/fallback.png'}
            width={Number(width)}
            height={Number(height)}
          />
        </Box>
        {deleteImageErrorMessage && (
          <ErrorAlert errorMessage={deleteImageErrorMessage} />
        )}
        <Box mt={5}>
          <Box display="inline-flex">
            <a target="_blank" href={imageUrl} download>
              <Button>Download image</Button>
            </a>
          </Box>
          <Box display="inline-flex" float="right">
            <DeleteButton
              buttonText="Delete image"
              isDisabled={isDestroyingImage}
              handleDeleteButtonClicked={handleDeleteButtonClicked}
            />
          </Box>
        </Box>

        <Box mt="1rem">
          <UnorderedList ml={0}>
            {textList.map((text, idx) => {
              return (
                <ListItem key={idx} display="flex" mt="1rem">
                  <Flex>
                    <Input
                      placeholder="Enter keywords"
                      size="md"
                      value={text}
                      onChange={generateHandleTextChange(idx)}
                    />
                    <Button
                      onClick={generateHandleRemoveClicked(idx)}
                      ml="1rem"
                    >
                      Remove
                    </Button>
                  </Flex>
                </ListItem>
              );
            })}
          </UnorderedList>
        </Box>
        <Box mt="1rem">
          <Button onClick={handleAddKeywordClicked} float="right">
            + Keyword
          </Button>
        </Box>
        <Box mt="1rem">
          <Button
            mt="1rem"
            colorScheme="blue"
            onClick={handleUpdateTextClicked}
            isDisabled={isUpdatingKeywords}
            isLoading={isUpdatingKeywords}
            disabled={isUpdatingKeywords}
            isFullWidth
          >
            Update keywords
          </Button>
        </Box>
        <IconButton
          aria-label="Back"
          icon={<ArrowBackIcon />}
          onClick={onBackButtonClicked}
          size="lg"
          mt={5}
        />
      </Box>
    </VStack>
  );
};

export default ImagePage;
