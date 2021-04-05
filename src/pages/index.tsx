import NextLink from 'next/link';
import React, {useState, useEffect, useContext} from 'react';
import {
  Button,
  Image as ChakraImage,
  Link,
  SimpleGrid,
  Box,
  Text,
  useToast,
} from '@chakra-ui/react';
import {Auth} from 'aws-amplify';
import Select, {ActionMeta} from 'react-select';
import {
  saveImage,
  fetchImageListByUserSub,
  ImageItem,
  listImagesByIdentityId,
} from '../lib/image';
import {fetchKeywordsByUserSub, Keyword} from '../lib/keyword';
import {getExtension} from '../lib/file';
import {isError} from '../lib/result';
import {ErrorAlert} from '../components/ErrorAlert';
import {DropZone} from '../components/DropZone';
import {Layout} from '../components/Layout';
import {useRouter} from 'next/router';
import {UserContext} from './_app';

const INVALID_IMAGE_VALUE = -1;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];
const MAX_TOTAL_IMAGE_SIZE_PER_USER = 1000 * 1000 * 1000;

interface keywordTextImageId {
  text: string;
  imageId: string;
  imageKey: string;
}

function Home() {
  const [fileToBeUploaded, setFileToBeUploaded] = useState<File>();
  // const [userInfo, setUserInfo] = useState<UserInfo>(undefined);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string>('');
  const [imageItemList, setImageItemList] = useState<ImageItem[]>([]);
  const [keywordTextImageIdList, setKeywordTextImageIdList] = useState<
    keywordTextImageId[]
  >([]);
  const [fileErrorMessage, setFileErrorMessage] = useState<string>('');
  const [memeErrorMessage, setMemeErrorMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [imageHeight, setImageHeight] = useState<number>(INVALID_IMAGE_VALUE);
  const [imageWidth, setImageWidth] = useState<number>(INVALID_IMAGE_VALUE);
  const [identityId, setIdentityId] = useState<string>('');

  const {userInfo} = useContext(UserContext);

  console.log({userInfo});

  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    (async () => {
      if (userInfo) {
        const userSub = userInfo.attributes.sub;
        Promise.all([
          fetchThenSetImageList(userSub),
          fetchKeywords(userSub),
          fetchCreds(),
        ]);
      }
    })();
  }, [userInfo]);

  const keywordOptions = keywordTextImageIdList.map(keywordTextImageId => {
    return {
      value: keywordTextImageId.imageKey,
      label: keywordTextImageId.text,
    };
  });

  const fetchCreds = async () => {
    const creds = await Auth.currentCredentials();
    setIdentityId(creds.identityId);
  };

  const fetchThenSetImageList = async (userSub: string) => {
    const imageItems = await fetchImageListByUserSub(userSub);
    setImageItemList(imageItems);
  };

  const fetchKeywords = async (userSub: string) => {
    const keywords = await fetchKeywordsByUserSub(userSub).catch(e => {
      console.log(e);
    });
    if (keywords) {
      const textImageIdList = keywords.map((keyword: Keyword) => {
        return {
          text: keyword.text,
          imageId: keyword.imageId,
          imageKey: keyword.imageKey,
        };
      });
      setKeywordTextImageIdList(textImageIdList);
    }
  };

  const handleStorageUploadSucceeded = () => {
    setIsUploading(false);
    setIsConnecting(true);
  };

  const uploadImage = async () => {
    if (fileToBeUploaded === undefined) {
      setFileErrorMessage('File is not chosen.');
      return;
    }
    const ext = getExtension(fileToBeUploaded.name);
    if (ext === '') {
      setFileErrorMessage('Please add a file extension to the filename.');
      return;
    }
    if (userInfo === undefined || identityId === '') {
      setMemeErrorMessage('Please login to create a meme.');
      return;
    }
    if (imageHeight === INVALID_IMAGE_VALUE) {
      setMemeErrorMessage('Image size is invalid');
      return;
    }

    const listImagesResult = await listImagesByIdentityId(identityId);
    if (isError(listImagesResult)) {
      setMemeErrorMessage('Failed to get user information.');
      return;
    }

    const size = listImagesResult
      .map(imageResult => imageResult.size)
      .reduce((total, delta) => total + delta, 0);

    if (size > MAX_TOTAL_IMAGE_SIZE_PER_USER) {
      setMemeErrorMessage('You have uploaded too many large images.');
      return;
    }

    setIsUploading(true);
    let imageKey = '';
    try {
      const result = await saveImage({
        file: fileToBeUploaded,
        fileExtension: ext,
        userSub: userInfo.attributes.sub,
        height: imageHeight,
        width: imageWidth,
        callbackStorageUploadSuccess: handleStorageUploadSucceeded,
      });
      if (isError(result)) {
        setMemeErrorMessage('Failed to create a meme.');
      } else if (result) {
        imageKey = result.key;
      }
    } catch (error) {
      setMemeErrorMessage('Failed to create a meme.');
      console.log({error});
    } finally {
      setIsUploading(false);
      setIsConnecting(false);
    }
    setUploadedImageSrc('');
    toast({
      title: 'Image uploaded',
      description: "Successfully uploaded the image! Let's add keywords!",
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
    if (imageKey !== '') {
      router.push({
        pathname: `/images/${imageKey}`,
        query: {w: imageWidth, h: imageHeight},
      });
    }
  };

  const setImageSrcIfValidImage = (file: File) => {
    if (isValidFile(file)) {
      setFileToBeUploaded(file);
      const reader = new FileReader();
      reader.onload = (_e: ProgressEvent<FileReader>) => {
        if (typeof reader.result === 'string') {
          setUploadedImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFileErrorMessage('Invalid file');
    }
  };

  const handleFileDropped = (file: File) => {
    setFileErrorMessage('');
    setImageSrcIfValidImage(file);
  };

  const handleUploadButtonClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (isUploading || isConnecting) {
      return;
    }
    try {
      await uploadImage();
    } catch (error) {
      setMemeErrorMessage('Failed to create a meme');
      console.log({error});
    }
  };

  const isValidFile = (file: File) => {
    if (ACCEPTED_IMAGE_TYPES.indexOf(file.type) === -1) {
      return false;
    }
    if (file.size > 10 * 1000 * 1000) {
      return false;
    }

    return true;
  };

  const handleSelectChange = (
    val: {value: string; label: string} | null,
    _actionMeta: ActionMeta<{
      value: string;
      label: string;
    }>
  ) => {
    if (val === null) {
      return;
    }

    router.push(`/keywords/${val.label}/`);
  };

  const handleImageLoad = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const {height, width} = event.currentTarget;
    setImageHeight(height);
    setImageWidth(width);
  };

  return (
    <Layout>
      <main>
        <Box ml={5} mr={5} mb={5}>
          {memeErrorMessage && <ErrorAlert errorMessage={memeErrorMessage} />}

          {userInfo && (
            <Box>
              <Box>
                <Text>Keyword count: {keywordTextImageIdList.length}</Text>
                {keywordOptions && (
                  <Select
                    options={keywordOptions}
                    onChange={handleSelectChange}
                  />
                )}
              </Box>
              <Box mt={5}>
                <DropZone
                  handleFileDropped={handleFileDropped}
                  imageSrc={uploadedImageSrc}
                  handleImageLoad={handleImageLoad}
                />
              </Box>
              {fileErrorMessage && (
                <ErrorAlert errorMessage={fileErrorMessage} />
              )}
              <Button
                colorScheme="blue"
                onClick={handleUploadButtonClicked}
                disabled={
                  fileToBeUploaded === undefined || isUploading || isConnecting
                }
                isLoading={isUploading || isConnecting}
                isDisabled={isUploading || isConnecting}
                borderRadius="0 0 2px 2px"
                isFullWidth
              >
                Upload
              </Button>
              <SimpleGrid columns={{base: 1, md: 2, lg: 3}} spacing={5} mt={5}>
                {imageItemList.map(imageItem => {
                  return (
                    <Box key={imageItem.src}>
                      <NextLink
                        href={`/images/${imageItem.key}?w=${imageItem.width}&h=${imageItem.height}`}
                        passHref
                      >
                        <Link>
                          <ChakraImage
                            src={imageItem.src}
                            key={imageItem.src}
                            width={['25em', '43em', '57em']}
                          />
                        </Link>
                      </NextLink>
                    </Box>
                  );
                })}
              </SimpleGrid>
            </Box>
          )}
        </Box>
      </main>
    </Layout>
  );
}

export default Home;
