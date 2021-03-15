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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
      keywords {
        nextToken
        startedAt
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
      keywords {
        nextToken
        startedAt
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      owner
      keywords {
        nextToken
        startedAt
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      image {
        id
        fileName
        fileExtension
        userSub
        key
        _version
        _deleted
        _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      image {
        id
        fileName
        fileExtension
        userSub
        key
        _version
        _deleted
        _lastChangedAt
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
      _version
      _deleted
      _lastChangedAt
      createdAt
      updatedAt
      image {
        id
        fileName
        fileExtension
        userSub
        key
        _version
        _deleted
        _lastChangedAt
        createdAt
        updatedAt
        owner
      }
      owner
    }
  }
`;
