import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {withSSRContext, Storage} from 'aws-amplify';
import {ArrowBackIcon} from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  UnorderedList,
  ListItem,
  Flex,
  Text,
  Image as ChakraImage,
} from '@chakra-ui/react';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import NextLink from 'next/link';
import {isString} from '../../lib/image';
import {keywordsByText} from '../../graphql/queries';
import {isKeywordsByTextData, Keyword, isKeywordList} from '../../lib/keyword';

interface KeywordAndImageUrl {
  imageUrl: string;
  keyword: Keyword;
}

const isKeywordAndImageUrl = (obj: unknown): obj is KeywordAndImageUrl => {
  return (
    'imageUrl' in (obj as KeywordAndImageUrl) &&
    'keyword' in (obj as KeywordAndImageUrl)
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const {API, Auth} = withSSRContext(context);
  const user = await Auth.currentAuthenticatedUser().catch((e: Error) => {
    console.log(e);
  });
  if (!user) {
    return {props: {}};
  }
  const userSub = user.attributes.sub;
  const params = context.params;
  if (params !== undefined) {
    const text = params.slug;
    if (isString(text)) {
      const keywordsByTextData = await API.graphql({
        query: keywordsByText,
        variables: {
          text,
          userSub: {eq: userSub},
        },
        // authMode: 'AMAZON_COGNITO_USER_POOLS',
      });
      if (isKeywordsByTextData(keywordsByTextData)) {
        const keywords = keywordsByTextData.data.keywordsByText.items;

        return {
          props: {
            data: {
              keywords,
            },
          },
        };
      }
    }
  }
  return {props: {}};
};

const KeywordPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [keywordAndImageUrlList, setKeywordAndImageUrlList] = useState<
    KeywordAndImageUrl[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if ('data' in props) {
        if ('keywords' in props.data) {
          const keywords = props.data.keywords;
          if (isKeywordList(keywords)) {
            const keywordAndImageUrlListOrVoid = await Promise.all(
              keywords.map(async keyword => {
                console.log(keyword.imageKey);
                const imageUrl = await Storage.get(keyword.imageKey).catch(
                  e => {
                    console.log(e);
                  }
                );
                if (isString(imageUrl)) {
                  return {keyword, imageUrl};
                }
                return;
              })
            );
            const keywordAndImageUrlList = keywordAndImageUrlListOrVoid.filter(
              isKeywordAndImageUrl
            );
            console.log({keywordAndImageUrlList});

            setKeywordAndImageUrlList(keywordAndImageUrlList);
          }
        }
      }
    })();
  }, [props]);

  const onBackButtonClicked = (
    _event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    router.push('/');
  };

  return (
    <Box>
      <Box m={5}>
        <IconButton
          aria-label="Back"
          icon={<ArrowBackIcon />}
          onClick={onBackButtonClicked}
          size="lg"
        />
        {keywordAndImageUrlList.length > 0 && (
          <Box mt={5}>
            <UnorderedList ml={0}>
              {keywordAndImageUrlList.map(keywordAndImageUrl => {
                return (
                  <ListItem
                    key={keywordAndImageUrl.keyword.imageKey}
                    display="flex"
                    mt="1rem"
                  >
                    <NextLink
                      href={`/images/${keywordAndImageUrl.keyword.imageKey}`}
                    >
                      <Flex>
                        <Text>{keywordAndImageUrl.keyword.text}</Text>
                        <ChakraImage
                          src={keywordAndImageUrl.imageUrl}
                          boxSize={40}
                          objectFit="cover"
                        />
                      </Flex>
                    </NextLink>
                  </ListItem>
                );
              })}
            </UnorderedList>
          </Box>
        )}
        <IconButton
          aria-label="Back"
          icon={<ArrowBackIcon />}
          onClick={onBackButtonClicked}
          size="lg"
          mt={5}
        />
      </Box>
    </Box>
  );
};

export default KeywordPage;
