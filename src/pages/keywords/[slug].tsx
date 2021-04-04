import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {API, Auth, Storage} from 'aws-amplify';
import {ArrowBackIcon} from '@chakra-ui/icons';
import {
  Box,
  IconButton,
  UnorderedList,
  ListItem,
  Link as ChakraLink,
  Flex,
  Text,
  Image as ChakraImage,
} from '@chakra-ui/react';
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next';
import NextLink from 'next/link';
import {GRAPHQL_AUTH_MODE} from '@aws-amplify/api-graphql';
import {isString} from '../../lib/image';
import {keywordsByText, listKeywords} from '../../graphql/queries';
import {
  isKeywordsByTextData,
  isListKeywordsData,
  Keyword,
  isKeywordList,
} from '../../lib/keyword';

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

export const getStaticPaths: GetStaticPaths = async _context => {
  const listKeywordsData = await API.graphql({
    query: listKeywords,
    authMode: GRAPHQL_AUTH_MODE.API_KEY,
  });
  if (!isListKeywordsData(listKeywordsData)) {
    throw new Error('non-listImagesData returned.');
  }
  const paths = listKeywordsData.data.listKeywords.items.map(keyword => {
    return {params: {slug: keyword.text}};
  });
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const slug = context.params.slug;
  if (typeof slug !== 'string') {
    throw new Error('slug is not string');
  }
  return {
    props: {slug},
    revalidate: 60 * 60,
  };
};

const KeywordPage = ({
  slug,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [keywordAndImageUrlList, setKeywordAndImageUrlList] = useState<
    KeywordAndImageUrl[]
  >([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user = await Auth.currentAuthenticatedUser().catch((e: Error) => {
        console.log(e);
      });
      if (!user) {
        return;
      }
      const userSub = user.attributes.sub;
      if (!isString(slug)) {
        return;
      }
      let keywordsByTextData;
      try {
        keywordsByTextData = await API.graphql({
          query: keywordsByText,
          variables: {
            text: slug,
            userSub: {eq: userSub},
          },
        });
      } catch (e) {
        console.log(e);
        return;
      }
      if (!isKeywordsByTextData(keywordsByTextData)) {
        return;
      }
      const keywords = keywordsByTextData.data.keywordsByText.items;
      if (!isKeywordList(keywords)) {
        return;
      }
      const keywordAndImageUrlListOrVoid = await Promise.all(
        keywords.map(async keyword => {
          const imageUrl = await Storage.get(keyword.imageKey).catch(e => {
            console.log(e);
          });
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
    })();
  }, [slug]);

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
                const keyword = keywordAndImageUrl.keyword;
                return (
                  <ListItem key={keyword.imageKey} display="flex" mt="1rem">
                    <NextLink
                      href={`/images/${keyword.imageKey}?w=${keyword.width}&h=${keyword.height}`}
                      passHref
                    >
                      <ChakraLink>
                        <Flex>
                          <Text>{keyword.text}</Text>
                          <ChakraImage
                            src={keywordAndImageUrl.imageUrl}
                            boxSize={40}
                            objectFit="cover"
                          />
                        </Flex>
                      </ChakraLink>
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
