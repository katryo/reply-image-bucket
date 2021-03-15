import React, { useEffect, useState } from "react";
import { API, Storage, withSSRContext } from "aws-amplify";
import { VStack, Box, Button } from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getIdFromKey, isGetImageData, isString } from "../../lib/image";
import { getImage, listImages } from "../../graphql/queries";

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
          return {
            props: { data: { key, image: getImageData.data.getImage } },
          };
        }
      }
    }
  }
  return { props: {} };
};

const ImagePage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  useEffect(() => {
    (async () => {
      if ("data" in props && "key" in props.data) {
        const key = props.data.key;
        console.log({ key });
        const url = await Storage.get(key).catch((e) => {
          console.log(e);
        });
        console.log({ url });
        if (isString(url)) {
          setImageUrl(url);
        }
      }
    })();
  }, [props]);

  if (imageUrl === "") {
    return <div>No image found</div>;
  }
  return (
    <VStack>
      <Box>
        <img src={imageUrl} />
      </Box>
      <Box>
        <Button>Delete</Button>
        <a target="_blank" download={imageUrl}>
          <Button>Download</Button>
        </a>
      </Box>
    </VStack>
  );
};

export default ImagePage;
