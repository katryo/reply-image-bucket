/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateImage = /* GraphQL */ `
  subscription OnCreateImage {
    onCreateImage {
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
export const onUpdateImage = /* GraphQL */ `
  subscription OnUpdateImage {
    onUpdateImage {
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
export const onDeleteImage = /* GraphQL */ `
  subscription OnDeleteImage {
    onDeleteImage {
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
export const onCreateKeyword = /* GraphQL */ `
  subscription OnCreateKeyword {
    onCreateKeyword {
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
export const onUpdateKeyword = /* GraphQL */ `
  subscription OnUpdateKeyword {
    onUpdateKeyword {
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
export const onDeleteKeyword = /* GraphQL */ `
  subscription OnDeleteKeyword {
    onDeleteKeyword {
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
