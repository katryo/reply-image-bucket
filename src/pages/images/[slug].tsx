import React, { useEffect, useState } from "react";
import { API, Storage, withSSRContext } from "aws-amplify";
import {
  VStack,
  Box,
  Button,
  Input,
  UnorderedList,
  ListItem,
  Flex,
} from "@chakra-ui/react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
  destroyImage,
  getIdFromKey,
  isGetImageData,
  isImage,
  isString,
} from "../../lib/image";
import { ErrorAlert } from "../../components/ErrorAlert";
import { getImage, keywordsByImageId } from "../../graphql/queries";
import { isKeywordList, isKeywordsByImageId } from "../../lib/keyword";

const updateKeywordsOnImage = /* GraphQL */ `
  mutation UpdateKeywordsOnImage($textList: [String], $imageId: ID) {
    updateKeywordsOnImage(textList: $textList, imageId: $imageId) {
      id
      text
    }
  }
`;

const MAX_KEYWORD_COUNT = 10;

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
          const keywordsByImageIdData = await API.graphql({
            query: keywordsByImageId,
            variables: {
              imageId: id,
            },
            authMode: "AMAZON_COGNITO_USER_POOLS",
          });
          if (isKeywordsByImageId(keywordsByImageIdData)) {
            const keywords = keywordsByImageIdData.data.keywordsByImageId.items.filter(
              (keyword) => {
                return keyword.imageId === id;
              }
            );
            return {
              props: {
                data: {
                  key,
                  image: getImageData.data.getImage,
                  keywords,
                },
              },
            };
          }
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
  const [textList, setTextList] = useState<string[]>([""]);
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
        if ("image" in props.data) {
          const image = props.data.image;
          if (isImage(image)) {
            const imageId = image.id;
            setId(imageId);
            setVersion(props.data.image._version);
          }
        }
        if ("keywords" in props.data) {
          const keywords = props.data.keywords;
          if (isKeywordList(keywords)) {
            setTextList(
              keywords.map((keyword) => {
                return keyword.text;
              })
            );
          }
        }
      }
    })();
  }, [props]);

  const generateHandleTextChange = (idx: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      const newTextList = [...textList];
      newTextList[idx] = event.target.value;
      setTextList(newTextList);
    };
  };

  const generateHandleRemoveClicked = (idx: number) => {
    return (_event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const newTextList = [];
      for (let i = 0; i < textList.length; i++) {
        if (i === idx) {
          continue;
        }
        newTextList.push(textList[i]);
      }

      setTextList(newTextList);
    };
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

  const handleAddKeywordClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    console.log({ textList });
    if (textList.length >= MAX_KEYWORD_COUNT) {
      return;
    }
    const newTextList = [...textList];
    newTextList.push("");
    setTextList(newTextList);
  };

  const handleUpdateTextClicked = async (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      const result = await API.graphql({
        query: updateKeywordsOnImage,
        variables: {
          textList: textList,
          imageId: id,
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

        <UnorderedList>
          {textList.map((text, idx) => {
            return (
              <ListItem key={idx} display="flex">
                <Flex>
                  <Input
                    placeholder="Enter keywords"
                    size="md"
                    value={text}
                    onChange={generateHandleTextChange(idx)}
                  />
                  <Button onClick={generateHandleRemoveClicked(idx)}>
                    Remove
                  </Button>
                </Flex>
              </ListItem>
            );
          })}
        </UnorderedList>
        <Button onClick={handleAddKeywordClicked}>Add keyword</Button>
        <Button onClick={handleUpdateTextClicked}>Update text</Button>
      </Box>
    </VStack>
  );
};

export default ImagePage;
