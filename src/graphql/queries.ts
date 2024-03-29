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
        width
        height
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
      width
      height
      createdAt
      updatedAt
      owner
      keywords {
        nextToken
      }
    }
  }
`;
export const imagesByUserSub = /* GraphQL */ `
  query ImagesByUserSub(
    $userSub: String
    $sortDirection: ModelSortDirection
    $filter: ModelImageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    imagesByUserSub(
      userSub: $userSub
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        fileName
        fileExtension
        userSub
        key
        width
        height
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const getKeyword = /* GraphQL */ `
  query GetKeyword($id: ID!) {
    getKeyword(id: $id) {
      id
      imageId
      imageKey
      text
      userSub
      width
      height
      createdAt
      updatedAt
      image {
        id
        fileName
        fileExtension
        userSub
        key
        width
        height
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
        imageKey
        text
        userSub
        width
        height
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const keywordsByImageId = /* GraphQL */ `
  query KeywordsByImageId(
    $imageId: ID
    $text: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelKeywordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    keywordsByImageId(
      imageId: $imageId
      text: $text
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        imageId
        imageKey
        text
        userSub
        width
        height
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const keywordsByUserSub = /* GraphQL */ `
  query KeywordsByUserSub(
    $userSub: String
    $sortDirection: ModelSortDirection
    $filter: ModelKeywordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    keywordsByUserSub(
      userSub: $userSub
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        imageId
        imageKey
        text
        userSub
        width
        height
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
export const keywordsByText = /* GraphQL */ `
  query KeywordsByText(
    $text: String
    $userSub: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelKeywordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    keywordsByText(
      text: $text
      userSub: $userSub
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        imageId
        imageKey
        text
        userSub
        width
        height
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
