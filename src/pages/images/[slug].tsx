import React, { useEffect, useState } from "react";
import { API, Storage, withSSRContext } from "aws-amplify";
import { VStack, Box, Button, Input } from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
  destroyImage,
  getIdFromKey,
  isGetImageData,
  isImage,
  isString,
} from "../../lib/image";
import { ErrorAlert } from "../../components/ErrorAlert";
import { getImage } from "../../graphql/queries";

const createKeywordOnImage = /* GraphQL */ `
  mutation CreateKeywordOnImage($text: String, $imageId: ID) {
    createKeywordOnImage(text: $text, imageId: $imageId)
  }
`;

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
          console.log(getImageData.data.getImage);
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
  const [isDestroyingImage, setIsDestroyingImage] = useState<boolean>(false);
  const [
    deleteImageErrorMessage,
    setDeleteImageErrorMessage,
  ] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [_version, setVersion] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if ("data" in props) {
        if ("key" in props.data) {
          const imageKey = props.data.key;
          setKey(imageKey);
          const url = await Storage.get(imageKey).catch((e) => {
            console.log(e);
          });
          if (isString(url)) {
            setImageUrl(url);
          }
        }
        if ("image" in props.data && isImage(props.data.image)) {
          const imageId = props.data.image.id;
          setId(imageId);
          setVersion(props.data.image._version);
        }
      }
    })();
  }, [props]);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleDeleteButtonClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (key !== "" && id !== "") {
      setIsDestroyingImage(true);
      await destroyImage({ id, key })
        .catch((e) => {
          console.log(e);
          setDeleteImageErrorMessage("Failed to delete the image");
        })
        .finally(() => {
          setIsDestroyingImage(false);
          console.log("success");
        });
    }
  };

  const handleUpdateTextClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      const result = await API.graphql({
        query: createKeywordOnImage,
        variables: {
          text: 100,
          imageId: 123,
        },
      });
      console.log({ result });
    } catch (e) {
      console.log({ e });
    }
  };

  if (imageUrl === "") {
    return <div>No image found</div>;
  }
  return (
    <VStack>
      <Box>
        <img src={imageUrl} />
      </Box>
      <Box>
        <Button
          colorScheme="red"
          isDisabled={isDestroyingImage}
          onClick={handleDeleteButtonClicked}
        >
          Delete
        </Button>
        {deleteImageErrorMessage && (
          <ErrorAlert errorMessage={deleteImageErrorMessage} />
        )}
        <a target="_blank" href={imageUrl} download>
          <Button>Download</Button>
        </a>

        <Input
          placeholder="Enter keywords"
          size="md"
          value={text}
          onChange={handleTextChange}
        />
        <Button onClick={handleUpdateTextClicked}>Update text</Button>
      </Box>
    </VStack>
  );
};

export default ImagePage;
