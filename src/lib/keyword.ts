import { Keyword } from "../models/index";
import { ulid } from "ulid";
import { deleteKeyword, createKeyword } from "../graphql/mutations";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";
import { listKeywords } from "../graphql/queries";

interface ListKeywordsData {
  data: {
    listKeywords: {
      items: Keyword[];
    };
  };
}

interface GetKeywordData {
  data: {
    getKeyword: Keyword;
  };
}

export const isKeyword = (obj: unknown): obj is Keyword => {
  if (!obj) {
    return false;
  }
  return (
    "id" in (obj as Keyword) &&
    "imageId" in (obj as Keyword) &&
    "text" in (obj as Keyword)
  );
};

export const isGetImageData = (obj: unknown): obj is GetKeywordData => {
  return (
    "data" in (obj as GetKeywordData) &&
    "getKeyword" in (obj as GetKeywordData).data &&
    isKeyword((obj as GetKeywordData).data.getKeyword)
  );
};

export interface ImageItem {
  src: string;
  key: string;
}

const isImageItem = (obj: unknown): obj is ImageItem => {
  return (
    "src" in (obj as ImageItem) &&
    "key" in (obj as ImageItem) &&
    typeof (obj as ImageItem).src === "string"
  );
};

export const getIdFromKey = (key: string): string => {
  const strings = key.split(".");
  const len = strings.length;
  if (len < 3) {
    return "";
  }
  return `${strings[len - 2]}`;
};

export async function saveKeyword({
  file,
  fileExtension,
  userSub,
  callbackStorageUploadSuccess,
}: {
  file: File;
  fileExtension: string;
  userSub: string;
  callbackStorageUploadSuccess: () => void;
}): Promise<void | Error> {
  const id = ulid();
  const key = `${file.name}.${id}.${fileExtension}`;
  let error = undefined;
  await Storage.put(key, file).catch((e) => {
    console.log(e);
    error = e;
  });
  if (error !== undefined) {
    return error;
  }
  callbackStorageUploadSuccess();
  const image = {
    id,
    fileExtension,
    userSub,
    key,
    fileName: file.name,
  };

  const result = await API.graphql({
    query: createKeyword,
    variables: {
      input: { ...image },
    },
  });
  console.log({ result });
}

export async function destroyKeyword({
  id,
}: {
  id: string;
}): Promise<void | Error> {
  let error = undefined;
  const image = {
    id,
  };

  try {
    const result = await API.graphql({
      query: deleteKeyword,
      variables: {
        input: { id },
      },
    });
    console.log({ result });
  } catch (e) {
    console.log(e);
    error = e;
  }
  if (error !== undefined) {
    return error;
  }
}

const isGraphQLResultOfKeywords = (
  graphQLResult: GraphQLResult<any> | Observable<any>
): graphQLResult is ListKeywordsData => {
  return (
    "data" in graphQLResult &&
    graphQLResult.data !== undefined &&
    "listKeywords" in graphQLResult.data &&
    graphQLResult.data.listKeywords !== undefined &&
    "items" in graphQLResult.data.listKeywords
  );
};

export const fetchKeywordList = async (): Promise<Keyword[]> => {
  let keywords: Keyword[] = [];
  try {
    const listImagesResult = await API.graphql(graphqlOperation(listKeywords));
    if (isGraphQLResultOfKeywords(listImagesResult)) {
      keywords = listImagesResult.data.listKeywords.items;
    }
    console.log({ listImagesResult });
  } catch (error) {
    console.log({ error });
  }
  return keywords;
};
