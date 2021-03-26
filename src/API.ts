/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type KeywordInfo = {
  __typename: "KeywordInfo",
  id?: string,
  owner?: string,
  imageId?: string,
  text?: string,
  createdAt?: string,
  updatedAt?: string,
};

export type CreateImageInput = {
  id?: string | null,
  fileName: string,
  fileExtension: string,
  userSub: string,
  key: string,
};

export type ModelImageConditionInput = {
  fileName?: ModelStringInput | null,
  fileExtension?: ModelStringInput | null,
  userSub?: ModelStringInput | null,
  key?: ModelIDInput | null,
  and?: Array< ModelImageConditionInput | null > | null,
  or?: Array< ModelImageConditionInput | null > | null,
  not?: ModelImageConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Image = {
  __typename: "Image",
  id?: string,
  fileName?: string,
  fileExtension?: string,
  userSub?: string,
  key?: string,
  createdAt?: string,
  updatedAt?: string,
  owner?: string | null,
  keywords?: ModelKeywordConnection,
};

export type ModelKeywordConnection = {
  __typename: "ModelKeywordConnection",
  items?:  Array<Keyword | null > | null,
  nextToken?: string | null,
};

export type Keyword = {
  __typename: "Keyword",
  id?: string,
  imageId?: string,
  text?: string,
  createdAt?: string,
  updatedAt?: string,
  image?: Image,
  owner?: string | null,
};

export type UpdateImageInput = {
  id: string,
  fileName?: string | null,
  fileExtension?: string | null,
  userSub?: string | null,
  key?: string | null,
};

export type DeleteImageInput = {
  id?: string | null,
};

export type CreateKeywordInput = {
  id?: string | null,
  imageId: string,
  text: string,
};

export type ModelKeywordConditionInput = {
  imageId?: ModelIDInput | null,
  text?: ModelStringInput | null,
  and?: Array< ModelKeywordConditionInput | null > | null,
  or?: Array< ModelKeywordConditionInput | null > | null,
  not?: ModelKeywordConditionInput | null,
};

export type UpdateKeywordInput = {
  id: string,
  imageId?: string | null,
  text?: string | null,
};

export type DeleteKeywordInput = {
  id?: string | null,
};

export type ModelImageFilterInput = {
  id?: ModelIDInput | null,
  fileName?: ModelStringInput | null,
  fileExtension?: ModelStringInput | null,
  userSub?: ModelStringInput | null,
  key?: ModelIDInput | null,
  and?: Array< ModelImageFilterInput | null > | null,
  or?: Array< ModelImageFilterInput | null > | null,
  not?: ModelImageFilterInput | null,
};

export type ModelImageConnection = {
  __typename: "ModelImageConnection",
  items?:  Array<Image | null > | null,
  nextToken?: string | null,
};

export type ModelKeywordFilterInput = {
  id?: ModelIDInput | null,
  imageId?: ModelIDInput | null,
  text?: ModelStringInput | null,
  and?: Array< ModelKeywordFilterInput | null > | null,
  or?: Array< ModelKeywordFilterInput | null > | null,
  not?: ModelKeywordFilterInput | null,
};

export type CreateKeywordOnImageMutationVariables = {
  text?: string | null,
  imageId?: string | null,
};

export type CreateKeywordOnImageMutation = {
  createKeywordOnImage?: string | null,
};

export type UpdateKeywordsOnImageMutationVariables = {
  textList?: Array< string | null > | null,
  imageId?: string | null,
};

export type UpdateKeywordsOnImageMutation = {
  updateKeywordsOnImage:  Array< {
    __typename: "KeywordInfo",
    id: string,
    owner: string,
    imageId: string,
    text: string,
    createdAt: string,
    updatedAt: string,
  } | null >,
};

export type CreateImageMutationVariables = {
  input?: CreateImageInput,
  condition?: ModelImageConditionInput | null,
};

export type CreateImageMutation = {
  createImage?:  {
    __typename: "Image",
    id: string,
    fileName: string,
    fileExtension: string,
    userSub: string,
    key: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    keywords?:  {
      __typename: "ModelKeywordConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type UpdateImageMutationVariables = {
  input?: UpdateImageInput,
  condition?: ModelImageConditionInput | null,
};

export type UpdateImageMutation = {
  updateImage?:  {
    __typename: "Image",
    id: string,
    fileName: string,
    fileExtension: string,
    userSub: string,
    key: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    keywords?:  {
      __typename: "ModelKeywordConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type DeleteImageMutationVariables = {
  input?: DeleteImageInput,
  condition?: ModelImageConditionInput | null,
};

export type DeleteImageMutation = {
  deleteImage?:  {
    __typename: "Image",
    id: string,
    fileName: string,
    fileExtension: string,
    userSub: string,
    key: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    keywords?:  {
      __typename: "ModelKeywordConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type CreateKeywordMutationVariables = {
  input?: CreateKeywordInput,
  condition?: ModelKeywordConditionInput | null,
};

export type CreateKeywordMutation = {
  createKeyword?:  {
    __typename: "Keyword",
    id: string,
    imageId: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    image:  {
      __typename: "Image",
      id: string,
      fileName: string,
      fileExtension: string,
      userSub: string,
      key: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    owner?: string | null,
  } | null,
};

export type UpdateKeywordMutationVariables = {
  input?: UpdateKeywordInput,
  condition?: ModelKeywordConditionInput | null,
};

export type UpdateKeywordMutation = {
  updateKeyword?:  {
    __typename: "Keyword",
    id: string,
    imageId: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    image:  {
      __typename: "Image",
      id: string,
      fileName: string,
      fileExtension: string,
      userSub: string,
      key: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    owner?: string | null,
  } | null,
};

export type DeleteKeywordMutationVariables = {
  input?: DeleteKeywordInput,
  condition?: ModelKeywordConditionInput | null,
};

export type DeleteKeywordMutation = {
  deleteKeyword?:  {
    __typename: "Keyword",
    id: string,
    imageId: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    image:  {
      __typename: "Image",
      id: string,
      fileName: string,
      fileExtension: string,
      userSub: string,
      key: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    owner?: string | null,
  } | null,
};

export type ListImagesQueryVariables = {
  filter?: ModelImageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListImagesQuery = {
  listImages?:  {
    __typename: "ModelImageConnection",
    items?:  Array< {
      __typename: "Image",
      id: string,
      fileName: string,
      fileExtension: string,
      userSub: string,
      key: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type GetImageQueryVariables = {
  id?: string,
};

export type GetImageQuery = {
  getImage?:  {
    __typename: "Image",
    id: string,
    fileName: string,
    fileExtension: string,
    userSub: string,
    key: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    keywords?:  {
      __typename: "ModelKeywordConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type GetKeywordQueryVariables = {
  id?: string,
};

export type GetKeywordQuery = {
  getKeyword?:  {
    __typename: "Keyword",
    id: string,
    imageId: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    image:  {
      __typename: "Image",
      id: string,
      fileName: string,
      fileExtension: string,
      userSub: string,
      key: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    owner?: string | null,
  } | null,
};

export type ListKeywordsQueryVariables = {
  filter?: ModelKeywordFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListKeywordsQuery = {
  listKeywords?:  {
    __typename: "ModelKeywordConnection",
    items?:  Array< {
      __typename: "Keyword",
      id: string,
      imageId: string,
      text: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    } | null > | null,
    nextToken?: string | null,
  } | null,
};

export type OnCreateImageSubscription = {
  onCreateImage?:  {
    __typename: "Image",
    id: string,
    fileName: string,
    fileExtension: string,
    userSub: string,
    key: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    keywords?:  {
      __typename: "ModelKeywordConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnUpdateImageSubscription = {
  onUpdateImage?:  {
    __typename: "Image",
    id: string,
    fileName: string,
    fileExtension: string,
    userSub: string,
    key: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    keywords?:  {
      __typename: "ModelKeywordConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnDeleteImageSubscription = {
  onDeleteImage?:  {
    __typename: "Image",
    id: string,
    fileName: string,
    fileExtension: string,
    userSub: string,
    key: string,
    createdAt: string,
    updatedAt: string,
    owner?: string | null,
    keywords?:  {
      __typename: "ModelKeywordConnection",
      nextToken?: string | null,
    } | null,
  } | null,
};

export type OnCreateKeywordSubscription = {
  onCreateKeyword?:  {
    __typename: "Keyword",
    id: string,
    imageId: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    image:  {
      __typename: "Image",
      id: string,
      fileName: string,
      fileExtension: string,
      userSub: string,
      key: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    owner?: string | null,
  } | null,
};

export type OnUpdateKeywordSubscription = {
  onUpdateKeyword?:  {
    __typename: "Keyword",
    id: string,
    imageId: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    image:  {
      __typename: "Image",
      id: string,
      fileName: string,
      fileExtension: string,
      userSub: string,
      key: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    owner?: string | null,
  } | null,
};

export type OnDeleteKeywordSubscription = {
  onDeleteKeyword?:  {
    __typename: "Keyword",
    id: string,
    imageId: string,
    text: string,
    createdAt: string,
    updatedAt: string,
    image:  {
      __typename: "Image",
      id: string,
      fileName: string,
      fileExtension: string,
      userSub: string,
      key: string,
      createdAt: string,
      updatedAt: string,
      owner?: string | null,
    },
    owner?: string | null,
  } | null,
};
