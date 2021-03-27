/* Amplify Params - DO NOT EDIT
	API_REPLYIMAGEBUCKET_GRAPHQLAPIENDPOINTOUTPUT
	API_REPLYIMAGEBUCKET_GRAPHQLAPIIDOUTPUT
	API_REPLYIMAGEBUCKET_GRAPHQLAPIKEYOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import { AppSyncResolverEvent } from "aws-lambda";
import * as aws from "aws-sdk";

interface Arguments {
  imageId: string;
}

exports.handler = async (event: AppSyncResolverEvent<Arguments>) => {
  const { imageId } = event.arguments;
  if (imageId === undefined) {
    throw new Error("text and imageId must be valid");
  }
  if (event.identity === undefined) {
    throw new Error("Identity not set");
  }
  const owner = event.identity.username;
  if (owner === undefined) {
    throw new Error("You need to login first.");
  }
  aws.config.update({ region: process.env.REGION });
  const ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });

  const imageTableName = `Image-jmjbhdjqq5dfxdngf5xtlbmqde-${process.env.ENV}`;
  const getImageParams = {
    TableName: imageTableName,
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
  if (getImageResult.Item && getImageResult.Item.owner.S === owner) {
    console.log("Image's owner is the user");
  } else {
    throw new Error("Request must be from the image owner");
  }

  console.log({ getImageResult });

  const keywordTableName = `Keyword-jmjbhdjqq5dfxdngf5xtlbmqde-${process.env.ENV}`;
  const scanKeywordsParams = {
    TableName: keywordTableName,
    ExpressionAttributeValues: {
      ":v": {
        S: imageId,
      },
    },
    FilterExpression: "imageId = :v",
  };

  const getKeywordsResult = await ddb
    .scan(scanKeywordsParams)
    .promise()
    .catch((e) => {
      console.log(e);
      throw e;
    });
  if (!getKeywordsResult) {
    return;
  }
  const keywords = getKeywordsResult.Items;

  const isString = (s?: string): s is string => {
    return s !== undefined;
  };
  const keywordIds =
    keywords === undefined
      ? []
      : keywords.map((keyword) => keyword.id.S).filter(isString);
  const generateDeleteItem = (id: string) => {
    return {
      Delete: {
        TableName: keywordTableName,
        Key: {
          id: {
            S: id,
          },
        },
      },
    };
  };
  const deleteKeywords = keywordIds.map(generateDeleteItem);

  const deleteImage = {
    Delete: {
      TableName: `Image-jmjbhdjqq5dfxdngf5xtlbmqde-${process.env.ENV}`,
      Key: {
        id: {
          S: imageId,
        },
      },
    },
  };

  console.log({ imageId });
  console.log({ owner });

  await ddb
    .transactWriteItems({
      TransactItems: [...deleteKeywords, deleteImage],
    })
    .promise()
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return imageId;
};
