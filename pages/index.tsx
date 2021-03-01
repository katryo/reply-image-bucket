import Head from "next/head";
import styles from "../styles/Home.module.css";
import ReactPhotoGallery from "react-photo-gallery";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import { SimpleGrid } from "@chakra-ui/react";
import { AuthButtonGroup } from "../components/authButtonGroup";

import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";

const images = [{ src: "/images/puyar.jpeg", width: 1, height: 1 }];

function Home() {
  const [session, loading] = useSession();
  const [uploadedFile, setUploadefFile] = useState<File>();
  const router = useRouter();
  const fileInputRef = useRef(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files !== null && files.length > 0) {
      const file = files[0];
      setUploadefFile(file);
    }
  };

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    console.log({ uploadedFile });
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Reply Image Bucket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <AuthButtonGroup />
      <main className={styles.main}>
        <h1 className={styles.title}>Reply Image Bucket</h1>
        {session && (
          <div>
            <Button onClick={handleClick}>Upload</Button>
            <input type="file" ref={fileInputRef} onChange={handleChange} />
            <SimpleGrid columns={{ sm: 2, md: 3 }}>
              <Image src="/images/puyar.jpeg" width={200} height={200} />
            </SimpleGrid>
          </div>
        )}
      </main>
    </div>
  );
}

export default withAuthenticator(Home);
