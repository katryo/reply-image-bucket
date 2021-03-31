import Head from 'next/head';
import useSWR from 'swr';
import NextLink from 'next/link';
import React, {useState, useEffect} from 'react';
import {
  Heading,
  Button,
  Image as ChakraImage,
  Link,
  SimpleGrid,
  Box,
  Flex,
  Text,
} from '@chakra-ui/react';
import {Auth} from 'aws-amplify';
import Select, {ActionMeta} from 'react-select';
import {saveImage, fetchImageListByUserSub, ImageItem} from '../lib/image';
import {fetchKeywordsByUserSub, Keyword} from '../lib/keyword';
import {isUserInfo} from '../lib/user';
import {getExtension} from '../lib/file';
import {isError} from '../lib/result';
import {ErrorAlert} from '../components/ErrorAlert';
import {DropZone} from '../components/DropZone';
import {useRouter} from 'next/router';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

interface keywordTextImageId {
  text: string;
  imageId: string;
  imageKey: string;
}

function Home() {
  const {data, error} = useSWR('/api/profile', fetcher);
  const [fileToBeUploaded, setFileToBeUploaded] = useState<File>();
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string>('');
  const [imageItemList, setImageItemList] = useState<ImageItem[]>([]);
  const [keywordTextImageIdList, setKeywordTextImageIdList] = useState<
    keywordTextImageId[]
  >([]);
  const [fileErrorMessage, setFileErrorMessage] = useState<string>('');
  const [memeErrorMessage, setMemeErrorMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const router = useRouter();

  const userData = data && data.user;
  const userInfo = isUserInfo(userData) ? userData : undefined;

  useEffect(() => {
    (async () => {
      console.log({userInfo});
      if (userInfo) {
        const userSub = userInfo.attributes.sub;
        Promise.all([fetchThenSetImageList(userSub), fetchKeywords(userSub)]);
      }
    })();
  }, [userInfo]);

  const keywordOptions = keywordTextImageIdList.map(keywordTextImageId => {
    return {
      value: keywordTextImageId.imageKey,
      label: keywordTextImageId.text,
    };
  });

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
    if (userInfo === undefined) {
      setMemeErrorMessage('Please login to create a meme.');
      return;
    }
    setIsUploading(true);
    let imageKey = '';
    try {
      const result = await saveImage({
        file: fileToBeUploaded,
        fileExtension: ext,
        userSub: userInfo.attributes.sub,
        callbackStorageUploadSuccess: handleStorageUploadSucceeded,
      });
      if (isError(result)) {
        setMemeErrorMessage('Failed to create a meme.');
        console.log({result});
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
    if (imageKey !== '') {
      router.push(`/images/${imageKey}`);
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

  return (
    <div>
      <Head>
        <title>Meme Bucket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Box ml={5} mr={5} mb={5}>
          <Flex mt={5} mb={5}>
            <Heading as="h1" size="xl">
              Meme Bucket
            </Heading>
            <Flex ml={5}>
              {userInfo ? (
                <Button onClick={() => Auth.signOut()}>Sign Out</Button>
              ) : (
                <Button onClick={() => Auth.federatedSignIn()}>
                  Federated Sign In
                </Button>
              )}
            </Flex>
          </Flex>
          {memeErrorMessage && <ErrorAlert errorMessage={memeErrorMessage} />}

          {error && JSON.stringify(error)}

          {userData && isUserInfo(userData) && (
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
                      <NextLink href={`/images/${imageItem.key}`} passHref>
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
    </div>
  );
}

export default Home;
