import {ulid} from 'ulid';
import {deleteKeyword, createKeyword} from '../graphql/mutations';
import {API, Storage} from 'aws-amplify';
import {keywordsByUserSub} from '../graphql/queries';

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
    'id' in (obj as Keyword) &&
    'imageId' in (obj as Keyword) &&
    'text' in (obj as Keyword)
  );
};

export const isKeywordList = (obj: unknown): obj is Keyword[] => {
  return Array.isArray(obj) && obj.every(isKeyword);
};

export const isKeywordsByImageId = (
  obj: unknown
): obj is KeywordsByImageIdData => {
  return (
    'data' in (obj as KeywordsByImageIdData) &&
    'keywordsByImageId' in (obj as KeywordsByImageIdData).data &&
    'items' in (obj as KeywordsByImageIdData).data.keywordsByImageId
  );
};

export const isGetImageData = (obj: unknown): obj is GetKeywordData => {
  return (
    'data' in (obj as GetKeywordData) &&
    'getKeyword' in (obj as GetKeywordData).data &&
    isKeyword((obj as GetKeywordData).data.getKeyword)
  );
};

export interface ImageItem {
  src: string;
  key: string;
}

interface KeywordsByTextData {
  data: {
    keywordsByText: {
      items: Keyword[];
    };
  };
}

export const isKeywordsByTextData = (
  obj: unknown
): obj is KeywordsByTextData => {
  return (
    'data' in (obj as KeywordsByTextData) &&
    'keywordsByText' in (obj as KeywordsByTextData).data &&
    'items' in (obj as KeywordsByTextData).data.keywordsByText
  );
};

export const getIdFromKey = (key: string): string => {
  const strings = key.split('.');
  const len = strings.length;
  if (len < 3) {
    return '';
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
  await Storage.put(key, file).catch(e => {
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
      input: {...image},
    },
  });
  console.log({result});
}

export async function destroyKeyword({
  id,
}: {
  id: string;
}): Promise<void | Error> {
  let error = undefined;
  try {
    const result = await API.graphql({
      query: deleteKeyword,
      variables: {
        input: {id},
      },
    });
    console.log({result});
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
  graphQLResult: unknown
): graphQLResult is KeywordsByUserSub => {
  return (
    'data' in (graphQLResult as KeywordsByUserSub) &&
    (graphQLResult as KeywordsByUserSub).data !== undefined &&
    'keywordsByUserSub' in (graphQLResult as KeywordsByUserSub).data
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
    console.log({result});
    if (isGraphQLResultOfKeywordsByUserSub(result)) {
      return result.data.keywordsByUserSub.items;
    }
  } catch (e) {
    console.log(e);
  }
  return [];
};
