import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { API, Storage, withSSRContext } from "aws-amplify";
import {
  VStack,
  Box,
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
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useDisclosure } from "@chakra-ui/react";
import {
  destroyImage,
  getIdFromKey,
  isGetImageData,
  isImage,
  isString,
} from "../../lib/image";
import { ErrorAlert } from "../../components/ErrorAlert";
import { getImage, keywordsByImageId } from "../../graphql/queries";
import { isKeywordList, isKeywordsByImageId } from "../../lib/keyword";

const updateKeywordsOnImage = /* GraphQL */ `
  mutation UpdateKeywordsOnImage($textList: [String], $imageId: ID) {
    updateKeywordsOnImage(textList: $textList, imageId: $imageId) {
      id
      text
    }
  }
`;

const MAX_KEYWORD_COUNT = 10;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { API } = withSSRContext(context);
  const params = context.params;
  if (params !== undefined) {
    const key = params.slug;
    if (isString(key)) {
      const id = getIdFromKey(key);
      if (id !== "") {
        const getImageData = await API.graphql({
          query: getImage,
          variables: {
            id,
          },
          authMode: "AMAZON_COGNITO_USER_POOLS",
        });
        if (isGetImageData(getImageData)) {
          const keywordsByImageIdData = await API.graphql({
            query: keywordsByImageId,
            variables: {
              imageId: id,
            },
            authMode: "AMAZON_COGNITO_USER_POOLS",
          });
          if (isKeywordsByImageId(keywordsByImageIdData)) {
            const keywords = keywordsByImageIdData.data.keywordsByImageId.items.filter(
              (keyword) => {
                return keyword.imageId === id;
              }
            );
            return {
              props: {
                data: {
                  key,
                  image: getImageData.data.getImage,
                  keywords,
                },
              },
            };
          }
        }
      }
    }
  }
  return { props: {} };
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
  const { isOpen, onOpen, onClose } = useDisclosure();

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

const ImagePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isDestroyingImage, setIsDestroyingImage] = useState<boolean>(false);
  const [
    deleteImageErrorMessage,
    setDeleteImageErrorMessage,
  ] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [textList, setTextList] = useState<string[]>([""]);
  const [_version, setVersion] = useState<number>(0);
  const router = useRouter();

  const toast = useToast();

  useEffect(() => {
    (async () => {
      if ("data" in props) {
        if ("key" in props.data) {
          const imageKey = props.data.key;
          setKey(imageKey);
          const url = await Storage.get(imageKey).catch((e) => {
            console.log(e);
          });
          if (isString(url)) {
            setImageUrl(url);
          }
        }
        if ("image" in props.data) {
          const image = props.data.image;
          if (isImage(image)) {
            const imageId = image.id;
            setId(imageId);
            setVersion(props.data.image._version);
          }
        }
        if ("keywords" in props.data) {
          const keywords = props.data.keywords;
          if (isKeywordList(keywords)) {
            setTextList(
              keywords.map((keyword) => {
                return keyword.text;
              })
            );
          }
        }
      }
    })();
  }, [props]);

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
    if (key !== "" && id !== "") {
      setIsDestroyingImage(true);
      const error = await destroyImage({ id, key })
        .catch((e) => {
          console.log(e);
          setDeleteImageErrorMessage("Failed to delete the image");
        })
        .finally(() => {
          setIsDestroyingImage(false);
        });
      if (error) {
        console.log(error);
        toast({
          title: "Failed to delete the image",
          description: "Failed to delete the image and its keywords.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Image deleted",
          description: "Successfully deleted the image and its keywords.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        router.push("/");
      }
    }
  };

  const handleAddKeywordClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log({ textList });
    if (textList.length >= MAX_KEYWORD_COUNT) {
      return;
    }
    const newTextList = [...textList];
    newTextList.push("");
    setTextList(newTextList);
  };

  const handleUpdateTextClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      const result = await API.graphql({
        query: updateKeywordsOnImage,
        variables: {
          textList: textList,
          imageId: id,
        },
      });
      console.log({ result });
      toast({
        title: "Keywords updated",
        description: "Successfully updated the keywords",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e) {
      console.log({ e });
    }
  };

  if (imageUrl === "") {
    return <div>No image found</div>;
  }
  return (
    <VStack>
      <Box w={["20rem", "30rem", "40rem"]}>
        <ChakraImage src={imageUrl} />
        {deleteImageErrorMessage && (
          <ErrorAlert errorMessage={deleteImageErrorMessage} />
        )}
        <Box>
          <Box display="inline-flex">
            <a target="_blank" href={imageUrl} download>
              <Button>Download</Button>
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
                      width={["12rem", "22rem", "32rem"]}
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
            isFullWidth
          >
            Update text
          </Button>
        </Box>
      </Box>
    </VStack>
  );
};

export default ImagePage;
