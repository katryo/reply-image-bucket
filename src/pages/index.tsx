import Head from "next/head";
import styles from "../../styles/Home.module.css";
import useSWR from "swr";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import NextLink from "next/link";
import React, { useState, useEffect } from "react";
import {
  Heading,
  Button,
  Image as ChakraImage,
  Link,
  SimpleGrid,
  Box,
  Flex,
} from "@chakra-ui/react";
import { Auth, withSSRContext } from "aws-amplify";
import { saveImage, fetchImageListByUserSub, ImageItem } from "../lib/image";
import { isUserInfo } from "../lib/user";
import { getExtension } from "../lib/file";
import { isError } from "../lib/result";
import { ErrorAlert } from "../components/ErrorAlert";
import { DropZone } from "../components/DropZone";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { Auth } = withSSRContext(context);
  const user = await Auth.currentAuthenticatedUser().catch((e: Error) => {
    console.log(e);
  });

  if (user) {
    return {
      props: { data: { sub: user.attributes.sub } },
    };
  }
  return { props: {} };
};

function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data, error } = useSWR("/api/profile", fetcher);
  const [fileToBeUploaded, setFileToBeUploaded] = useState<File>();
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string>("");
  const [imageItemList, setImageItemList] = useState<ImageItem[]>([]);
  const [fileErrorMessage, setFileErrorMessage] = useState<string>("");
  const [memeErrorMessage, setMemeErrorMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // const mainboxRef = createRef<HTMLElement>();

  useEffect(() => {
    (async () => {
      if ("data" in props) {
        if ("sub" in props.data) {
          await fetchThenSetImageList(props.data.sub);
        }
      }
    })();
  }, []);

  const userData = data && data.user;
  const userInfo = isUserInfo(userData) ? userData : undefined;

  const fetchThenSetImageList = async (ownerId: string) => {
    const imageItems = await fetchImageListByUserSub(ownerId);
    setImageItemList(imageItems);
  };

  const handleStorageUploadSucceeded = () => {
    setIsUploading(false);
    setIsConnecting(true);
  };

  const uploadImage = async () => {
    if (fileToBeUploaded === undefined) {
      setFileErrorMessage("File is not chosen.");
      return;
    }
    const ext = getExtension(fileToBeUploaded.name);
    if (ext === "") {
      setFileErrorMessage("Please add a file extension to the filename.");
      return;
    }
    if (userInfo === undefined) {
      setMemeErrorMessage("Please login to create a meme.");
      return;
    }
    setIsUploading(true);
    try {
      const result = await saveImage({
        file: fileToBeUploaded,
        fileExtension: ext,
        userSub: userInfo.attributes.sub,
        callbackStorageUploadSuccess: handleStorageUploadSucceeded,
      });
      if (isError(result)) {
        setMemeErrorMessage("Failed to create a meme.");
        console.log({ result });
      }
    } catch (error) {
      setMemeErrorMessage("Failed to create a meme.");
      console.log({ error });
    } finally {
      setIsUploading(false);
      setIsConnecting(false);
    }
    setUploadedImageSrc("");
    await fetchThenSetImageList(userInfo.attributes.sub);
  };

  const setImageSrcIfValidImage = (file: File) => {
    if (isValidFile(file)) {
      setFileToBeUploaded(file);
      const reader = new FileReader();
      reader.onload = (_e: ProgressEvent<FileReader>) => {
        if (typeof reader.result === "string") {
          setUploadedImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setFileErrorMessage("Invalid file");
    }
  };

  const handleFileDropped = (file: File) => {
    setFileErrorMessage("");
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
      setMemeErrorMessage("Failed to create a meme");
      console.log({ error });
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

  return (
    <div className={styles.container}>
      <Head>
        <title>Meme Bucket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Box ml={5} mr={5}>
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
                disabled={fileToBeUploaded === undefined}
                isLoading={isUploading || isConnecting}
                isDisabled={isUploading || isConnecting}
                borderRadius="0 0 2px 2px"
                isFullWidth
              >
                Upload
              </Button>
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={5}
                mt={5}
              >
                {imageItemList.map((imageItem) => {
                  return (
                    <Box key={imageItem.src}>
                      <NextLink href={`/images/${imageItem.key}`} passHref>
                        <Link>
                          <ChakraImage
                            src={imageItem.src}
                            key={imageItem.src}
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
