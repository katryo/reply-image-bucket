import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";

import useSWR from "swr";

import { useState } from "react";
import { Button, SimpleGrid } from "@chakra-ui/react";
import { Auth, Hub } from "aws-amplify";

const images = [{ src: "/images/puyar.jpeg", width: 1, height: 1 }];

interface User {
  username: string;
  pool: unknown;
  Session: string | null;
  client: unknown;
  signInUserSession: unknown;
  authenticationFlowType: string;
  storage: { cookies: unknown; store: unknown };
  keyPrefix: string;
  userDataKey: string;
  attributes: unknown;
  preferredMFA: string;
}

const isUser = (obj: any): obj is User => {
  return obj && (obj as User).username !== undefined;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

function Home() {
  const { data, error } = useSWR("/api/profile", fetcher);
  const [fileToBeUploaded, setFileToBeUploaded] = useState<File>();
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string>("");

  const userInfo = data && data.user;
  const user = isUser(userInfo) ? userInfo : undefined;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files !== null && files.length > 0) {
      const file = files[0];
      if (isValidFile(file)) {
        setFileToBeUploaded(file);
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (typeof reader.result === "string") {
            setUploadedImageSrc(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleUploadButtonClicked = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log({ fileToBeUploaded });
  };

  const isValidFile = (file: File) => {
    const validTypes = ACCEPTED_IMAGE_TYPES;
    if (validTypes.indexOf(file.type) === -1) {
      return false;
    }
    return true;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Reply Image Bucket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Reply Image Bucket</h1>
        {error && JSON.stringify(error)}

        <div>
          {user ? (
            <button onClick={() => Auth.signOut()}>
              Sign Out {userInfo.username}
            </button>
          ) : (
            <button onClick={() => Auth.federatedSignIn()}>
              Federated Sign In
            </button>
          )}
        </div>

        {userInfo && isUser(userInfo) && (
          <div>
            {uploadedImageSrc !== "" && (
              <img style={{ width: 600 }} src={uploadedImageSrc} />
            )}
            <input type="file" onChange={handleChange} />
            <Button
              onClick={handleUploadButtonClicked}
              disabled={fileToBeUploaded === undefined}
            >
              Upload
            </Button>
            <SimpleGrid columns={{ sm: 2, md: 3 }}>
              <Image src="/images/puyar.jpeg" width={200} height={200} />
            </SimpleGrid>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
