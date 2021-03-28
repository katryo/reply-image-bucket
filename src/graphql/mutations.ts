/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createKeywordOnImage = /* GraphQL */ `
  mutation CreateKeywordOnImage($text: String, $imageId: ID) {
    createKeywordOnImage(text: $text, imageId: $imageId)
  }
`;
export const updateKeywordsOnImage = /* GraphQL */ `
  mutation UpdateKeywordsOnImage($textList: [String], $imageId: ID) {
    updateKeywordsOnImage(textList: $textList, imageId: $imageId) {
      id
      owner
      imageId
      text
      createdAt
      updatedAt
    }
  }
`;
export const deleteImageAndItsKeywords = /* GraphQL */ `
  mutation DeleteImageAndItsKeywords($imageId: ID) {
    deleteImageAndItsKeywords(imageId: $imageId)
  }
`;
export const createImage = /* GraphQL */ `
  mutation CreateImage(
    $input: CreateImageInput!
    $condition: ModelImageConditionInput
  ) {
    createImage(input: $input, condition: $condition) {
      id
      fileName
      fileExtension
      userSub
      key
      createdAt
      updatedAt
      owner
      keywords {
        nextToken
      }
    }
  }
`;
export const updateImage = /* GraphQL */ `
  mutation UpdateImage(
    $input: UpdateImageInput!
    $condition: ModelImageConditionInput
  ) {
    updateImage(input: $input, condition: $condition) {
      id
      fileName
      fileExtension
      userSub
      key
      createdAt
      updatedAt
      owner
      keywords {
        nextToken
      }
    }
  }
`;
export const deleteImage = /* GraphQL */ `
  mutation DeleteImage(
    $input: DeleteImageInput!
    $condition: ModelImageConditionInput
  ) {
    deleteImage(input: $input, condition: $condition) {
      id
      fileName
      fileExtension
      userSub
      key
      createdAt
      updatedAt
      owner
      keywords {
        nextToken
      }
    }
  }
`;
export const createKeyword = /* GraphQL */ `
  mutation CreateKeyword(
    $input: CreateKeywordInput!
    $condition: ModelKeywordConditionInput
  ) {
    createKeyword(input: $input, condition: $condition) {
      id
      imageId
      text
      userSub
      createdAt
      updatedAt
      image {
        id
        fileName
        fileExtension
        userSub
        key
        createdAt
        updatedAt
        owner
      }
      owner
    }
  }
`;
export const updateKeyword = /* GraphQL */ `
  mutation UpdateKeyword(
    $input: UpdateKeywordInput!
    $condition: ModelKeywordConditionInput
  ) {
    updateKeyword(input: $input, condition: $condition) {
      id
      imageId
      text
      userSub
      createdAt
      updatedAt
      image {
        id
        fileName
        fileExtension
        userSub
        key
        createdAt
        updatedAt
        owner
      }
      owner
    }
  }
`;
export const deleteKeyword = /* GraphQL */ `
  mutation DeleteKeyword(
    $input: DeleteKeywordInput!
    $condition: ModelKeywordConditionInput
  ) {
    deleteKeyword(input: $input, condition: $condition) {
      id
      imageId
      text
      userSub
      createdAt
      updatedAt
      image {
        id
        fileName
        fileExtension
        userSub
        key
        createdAt
        updatedAt
        owner
      }
      owner
    }
  }
`;
