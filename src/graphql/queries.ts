/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listImages = /* GraphQL */ `
  query ListImages(
    $filter: ModelImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listImages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        fileName
        fileExtension
        userSub
        key
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getImage = /* GraphQL */ `
  query GetImage($id: ID!) {
    getImage(id: $id) {
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
export const getKeyword = /* GraphQL */ `
  query GetKeyword($id: ID!) {
    getKeyword(id: $id) {
      id
      imageId
      text
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
export const listKeywords = /* GraphQL */ `
  query ListKeywords(
    $filter: ModelKeywordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listKeywords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        imageId
        text
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
