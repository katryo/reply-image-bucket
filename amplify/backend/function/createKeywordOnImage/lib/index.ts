/* Amplify Params - DO NOT EDIT
	API_REPLYIMAGEBUCKET_GRAPHQLAPIENDPOINTOUTPUT
	API_REPLYIMAGEBUCKET_GRAPHQLAPIIDOUTPUT
	API_REPLYIMAGEBUCKET_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import { AppSyncResolverEvent } from "aws-lambda";
import { ulid } from "ulid";
import * as aws from "aws-sdk";

interface Arguments {
  text: string;
  imageId: string;
}

exports.handler = async (event: AppSyncResolverEvent<Arguments>) => {
  const { text, imageId } = event.arguments;
  if (text === undefined || imageId === undefined) {
    throw new Error("text and imageId must be valid");
  }
  const owner = event.identity.username;
  if (owner === undefined) {
    throw new Error("You need to login first.");
  }
  aws.config.update({ region: process.env.REGION });
  const ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });
  const getImageParams = {
    TableName: `Image-jmjbhdjqq5dfxdngf5xtlbmqde-${process.env.ENV}`,
    Key: {
      id: {
        S: event.arguments.imageId,
      },
    },
  };
  const getImageResult = await ddb
    .getItem(getImageParams)
    .promise()
    .catch((e) => {
      console.log(e);
      throw e;
    });
  if (!getImageResult) {
    return;
  }

  const now = new Date().toISOString();
  const id = ulid();
  const putKeywordParams = {
    TableName: `Keyword-jmjbhdjqq5dfxdngf5xtlbmqde-${process.env.ENV}`,
    Item: {
      id: {
        S: id,
      },
      owner: {
        S: owner,
      },
      imageId: {
        S: imageId,
      },
      text: {
        S: text,
      },
      __typename: {
        S: "Keyword",
      },
      createdAt: {
        S: now,
      },
      updatedAt: {
        S: now,
      },
    },
  };

  await ddb
    .putItem(putKeywordParams)
    .promise()
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return id;
};
