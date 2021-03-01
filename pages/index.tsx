import Head from "next/head";
import styles from "../styles/Home.module.css";
// import ReactPhotoGallery from "react-photo-gallery";
import Link from "next/link";
// import Image from "next/image";

import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth/lib/types";

import { Button } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
// import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { SimpleGrid } from "@chakra-ui/react";
// import { AuthButtonGroup } from "../components/authButtonGroup";
import { Auth, Hub } from "aws-amplify";

import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

const images = [{ src: "/images/puyar.jpeg", width: 1, height: 1 }];

function Home() {
  // const [session, loading] = useSession();
  // const [uploadedFile, setUploadefFile] = useState<File>();
  const [user, setUser] = useState();

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
        case "cognitoHostedUI":
          getUser().then((userData) => setUser(userData));
          break;
        case "signOut":
          setUser(undefined);
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data);
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => {
        console.log({ userData });
        return userData;
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

        <div>
          <p>User: {userInfo}</p>
          {user ? (
            <button onClick={() => Auth.signOut()}>Sign Out</button>
          ) : (
            <button
              onClick={() =>
                Auth.federatedSignIn({
                  provider: CognitoHostedUIIdentityProvider.Google,
                })
              }
            >
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
