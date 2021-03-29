import { ulid } from "ulid";
import { deleteKeyword, createKeyword } from "../graphql/mutations";
import { API, graphqlOperation, Storage } from "aws-amplify";
import { GraphQLResult } from "@aws-amplify/api-graphql";
import { Observable } from "zen-observable-ts";
import { keywordsByUserSub, listKeywords } from "../graphql/queries";

export interface Keyword {
  id: string;
  imageId: string;
  imageKey: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  userSub: string;
  owner: string;
}

interface KeywordsByImageIdData {
  data: {
    keywordsByImageId: {
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

export const isKeywordList = (obj: unknown): obj is Keyword[] => {
  return Array.isArray(obj) && obj.every(isKeyword);
};

export const isKeywordsByImageId = (
  obj: unknown
): obj is KeywordsByImageIdData => {
  return (
    "data" in (obj as KeywordsByImageIdData) &&
    "keywordsByImageId" in (obj as KeywordsByImageIdData).data &&
    "items" in (obj as KeywordsByImageIdData).data.keywordsByImageId
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

interface KeywordsByUserSub {
  data: {
    keywordsByUserSub: {
      items: Keyword[];
    };
  };
}

const isGraphQLResultOfKeywordsByUserSub = (
  graphQLResult: GraphQLResult<any> | Observable<any>
): graphQLResult is KeywordsByUserSub => {
  return (
    "data" in graphQLResult &&
    graphQLResult.data !== undefined &&
    "keywordsByUserSub" in graphQLResult.data
  );
};

export const fetchKeywordsByUserSub = async (
  userSub: string
): Promise<Keyword[]> => {
  try {
    const result = await API.graphql({
      query: keywordsByUserSub,
      variables: {
        userSub,
      },
    });
    console.log({ result });
    if (isGraphQLResultOfKeywordsByUserSub(result)) {
      return result.data.keywordsByUserSub.items;
    }
  } catch (e) {
    console.log(e);
  }
  return [];
};
