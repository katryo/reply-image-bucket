import {Image} from '../models/index';
import {ulid} from 'ulid';
import {createImage, deleteImageAndItsKeywords} from '../graphql/mutations';
import {API, graphqlOperation, Storage} from 'aws-amplify';
import {listImages, imagesByUserSub} from '../graphql/queries';

interface ListImagesData {
  data: {
    listImages: {
      items: Image[];
    };
  };
}

interface ImagesByUserSubData {
  data: {
    imagesByUserSub: {
      items: Image[];
    };
  };
}

interface GetImageData {
  data: {
    getImage: Image;
  };
}

interface CreateImageData {
  data: {
    createImage: Image;
  };
}

export const isImage = (obj: unknown): obj is Image => {
  if (!obj) {
    return false;
  }
  return (
    'id' in (obj as Image) &&
    'key' in (obj as Image) &&
    'fileName' in (obj as Image) &&
    'fileExtension' in (obj as Image) &&
    'userSub' in (obj as Image)
  );
};

export const isGetImageData = (obj: unknown): obj is GetImageData => {
  return (
    'data' in (obj as GetImageData) &&
    'getImage' in (obj as GetImageData).data &&
    isImage((obj as GetImageData).data.getImage)
  );
};

export const isCreateImageData = (obj: unknown): obj is CreateImageData => {
  return (
    'data' in (obj as CreateImageData) &&
    'createImage' in (obj as CreateImageData).data &&
    isImage((obj as CreateImageData).data.createImage)
  );
};

export interface ImageItem {
  src: string;
  key: string;
}

const isImageItem = (obj: unknown): obj is ImageItem => {
  return (
    'src' in (obj as ImageItem) &&
    'key' in (obj as ImageItem) &&
    typeof (obj as ImageItem).src === 'string'
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

export async function saveImage({
  file,
  fileExtension,
  userSub,
  callbackStorageUploadSuccess,
}: {
  file: File;
  fileExtension: string;
  userSub: string;
  callbackStorageUploadSuccess: () => void;
}): Promise<void | Error | Image> {
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
    query: createImage,
    variables: {
      input: {...image},
    },
  });
  if (isCreateImageData(result)) {
    return result.data.createImage;
  }
  console.log({result});
}

export async function destroyImage({
  id,
  key,
}: {
  id: string;
  key: string;
}): Promise<void | Error> {
  let error = undefined;

  try {
    const result = await API.graphql({
      query: deleteImageAndItsKeywords,
      variables: {
        imageId: id,
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

  await Storage.remove(key).catch(e => {
    console.log(e);
    error = e;
  });
  if (error !== undefined) {
    return error;
  }
}

export const isString = (obj: unknown): obj is string => {
  return typeof obj === 'string';
};

const isGraphQLResultOfImages = (
  graphQLResult: unknown
): graphQLResult is ListImagesData => {
  return (
    'data' in (graphQLResult as ListImagesData) &&
    (graphQLResult as ListImagesData).data !== undefined &&
    'listImages' in (graphQLResult as ListImagesData).data &&
    (graphQLResult as ListImagesData).data.listImages !== undefined &&
    'items' in (graphQLResult as ListImagesData).data.listImages
  );
};

const isGraphQLResultOfImagesByUserSub = (
  graphQLResult: unknown
): graphQLResult is ImagesByUserSubData => {
  return (
    'data' in (graphQLResult as ImagesByUserSubData) &&
    (graphQLResult as ImagesByUserSubData).data !== undefined &&
    'imagesByUserSub' in (graphQLResult as ImagesByUserSubData).data &&
    (graphQLResult as ImagesByUserSubData).data.imagesByUserSub !== undefined &&
    'items' in (graphQLResult as ImagesByUserSubData).data.imagesByUserSub
  );
};

export const fetchImageList = async (): Promise<ImageItem[]> => {
  let validS3ImageItems: ImageItem[] = [];
  try {
    const listImagesResult = await API.graphql(graphqlOperation(listImages));
    if (isGraphQLResultOfImages(listImagesResult)) {
      const items = listImagesResult.data.listImages.items;
      const s3ImageItems = await Promise.all(
        items.map(async (item: Image) => {
          console.log({itemkey: item.key});
          const s3Image = await Storage.get(item.key);
          if (isString(s3Image)) {
            return {src: s3Image, key: item.key};
          }
          return;
        })
      );
      validS3ImageItems = s3ImageItems.filter(isImageItem);
    }
  } catch (error) {
    console.log({error});
  }
  return validS3ImageItems;
};

export const fetchImageListByUserSub = async (
  userSub: string
): Promise<ImageItem[]> => {
  let validS3ImageItems: ImageItem[] = [];
  try {
    const result = await API.graphql({
      query: imagesByUserSub,
      variables: {userSub},
    });
    if (isGraphQLResultOfImagesByUserSub(result)) {
      const items = result.data.imagesByUserSub.items.slice(0, 10);
      const s3ImageItems = await Promise.all(
        items.map(async (item: Image) => {
          console.log({isstemkey: item.key});
          const s3Image = await Storage.get(item.key);
          if (isString(s3Image)) {
            return {src: s3Image, key: item.key};
          }
          return;
        })
      );
      validS3ImageItems = s3ImageItems.filter(isImageItem);
    }
  } catch (error) {
    console.log({error});
  }
  return validS3ImageItems;
};
