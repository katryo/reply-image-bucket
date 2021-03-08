import Head from "next/head";
import styles from "../styles/Home.module.css";
// import ReactPhotoGallery from "react-photo-gallery";
import Link from "next/link";
// import Image from "next/image";

import useSWR from "swr";

import { useState } from "react";
import { useRouter } from "next/router";
import { SimpleGrid } from "@chakra-ui/react";
// import { AuthButtonGroup } from "../components/authButtonGroup";
import { Auth, Hub } from "aws-amplify";

import { CognitoUser, CognitoUserAttribute } from "amazon-cognito-identity-js";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { NextApiRequest, NextApiResponse } from "next";

const images = [{ src: "/images/puyar.jpeg", width: 1, height: 1 }];

const isCognitoUser = (obj: any): obj is CognitoUser => {
  return (obj as CognitoUser).getUsername() !== undefined;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Home() {
  // const [uploadedFile, setUploadefFile] = useState<File>();
  const [user, setUser] = useState<CognitoUser>();
  // const { data, error } = useSWR("/api/profile", fetcher);

  // useEffect(() => {
  //   Hub.listen("auth", ({ payload: { event, data } }) => {
  //     switch (event) {
  //       case "signIn":
  //       case "cognitoHostedUI":
  //         getUser().then((userData) => userData && setUser(userData));
  //         break;
  //       case "signOut":
  //         setUser(undefined);
  //         break;
  //       case "signIn_failure":
  //       case "cognitoHostedUI_failure":
  //         console.log("Sign in failure", data);
  //         break;
  //     }
  //   });

  //   getUser().then((userData) => userData && setUser(userData));
  // }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => {
        console.log({ userData });
        if (isCognitoUser(userData)) {
          return userData;
        }
      })
      .catch(() => console.log("Not signed in"));
  }

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files !== null && files.length > 0) {
  //     const file = files[0];
  //     setUploadefFile(file);
  //   }
  // };

  // const handleClick = (
  //   event: React.MouseEvent<HTMLButtonElement | MouseEvent>
  // ) => {
  //   console.log({ uploadedFile });
  // };

  const userInfo = user === undefined ? "undef" : JSON.stringify(user);

  return (
    <div className={styles.container}>
      <Head>
        <title>Reply Image Bucket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <AuthButtonGroup /> */}
      <main className={styles.main}>
        <h1 className={styles.title}>Reply Image Bucket</h1>
        {/* {error}
        {data} */}

        <div>
          <p>User: {userInfo}</p>
          {user ? (
            <button onClick={() => Auth.signOut()}>Sign Out</button>
          ) : (
            <button onClick={() => Auth.federatedSignIn()}>
              Federated Sign In
            </button>
          )}
        </div>
        <button onClick={() => Auth.signOut()}>Sign Out {user}</button>

        {/* {session && (
          <div>
            <Button onClick={handleClick}>Upload</Button>
            <input type="file" ref={fileInputRef} onChange={handleChange} />
            {/* <SimpleGrid columns={{ sm: 2, md: 3 }}>
              <Image src="/images/puyar.jpeg" width={200} height={200} />
            </SimpleGrid>
          </div>
        )} */}
      </main>
    </div>
  );
}

export default Home;
