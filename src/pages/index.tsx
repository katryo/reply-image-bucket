import Head from "next/head";
import styles from "../../styles/Home.module.css";
import useSWR from "swr";
import NextLink from "next/link";
import React, { useState, useEffect } from "react";
import {
  Button,
  Image as ChakraImage,
  Link,
  SimpleGrid,
  Box,
} from "@chakra-ui/react";
import { Auth } from "aws-amplify";
import { saveImage, fetchImageList, ImageItem } from "../lib/image";
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

function Home() {
  const { data, error } = useSWR("/api/profile", fetcher);
  const [fileToBeUploaded, setFileToBeUploaded] = useState<File>();
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string>("");
  const [imageItemList, setImageItemList] = useState<ImageItem[]>([]);
  const [fileErrorMessage, setFileErrorMessage] = useState<string>("");
  const [memeErrorMessage, setMemeErrorMessage] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      await fetchThenSetImageList();
    })();
  }, []);

  const userData = data && data.user;
  const userInfo = isUserInfo(userData) ? userData : undefined;

  const fetchThenSetImageList = async () => {
    const imageItems = await fetchImageList();
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
    await fetchThenSetImageList();
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

  const handleListButtonClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    await fetchThenSetImageList();
  };

  const handleUploadButtonClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
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
        <h1 className={styles.title}>Meme Bucket</h1>
        {memeErrorMessage && <ErrorAlert errorMessage={memeErrorMessage} />}

        {error && JSON.stringify(error)}

        <div>
          {userInfo ? (
            <Button onClick={() => Auth.signOut()}>
              Sign Out {userInfo.username}
            </Button>
          ) : (
            <Button onClick={() => Auth.federatedSignIn()}>
              Federated Sign In
            </Button>
          )}
        </div>

        {userData && isUserInfo(userData) && (
          <div>
            <DropZone
              handleFileDropped={handleFileDropped}
              imageSrc={uploadedImageSrc}
            />
            {fileErrorMessage && <ErrorAlert errorMessage={fileErrorMessage} />}
            <Button
              onClick={handleUploadButtonClicked}
              disabled={fileToBeUploaded === undefined}
              isLoading={isUploading || isConnecting}
              isDisabled={isUploading || isConnecting}
            >
              Upload
            </Button>
            <Button onClick={handleListButtonClicked}>List</Button>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={20}>
              {imageItemList.map((imageItem) => {
                return (
                  <Box
                    key={imageItem.src}
                    height={200}
                    width={300}
                    maxWidth="100%"
                  >
                    <NextLink href={`/images/${imageItem.key}`} passHref>
                      <Link>
                        <ChakraImage
                          src={imageItem.src}
                          key={imageItem.src}
                          objectFit="contain"
                        />
                      </Link>
                    </NextLink>
                  </Box>
                );
              })}
            </SimpleGrid>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
