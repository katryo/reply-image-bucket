import Head from "next/head";
import styles from "../styles/Home.module.css";
import ReactPhotoGallery from "react-photo-gallery";

const images = [{ src: "/images/puyar.jpeg", width: 1, height: 1 }];

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Reply Image Bucket</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Reply Image Bucket</h1>

        <ReactPhotoGallery photos={images} />
      </main>
    </div>
  );
}
