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
  textList: string[];
  imageId: string;
}

const KEYWORD_COUNT_MAX = 10;

exports.handler = async (event: AppSyncResolverEvent<Arguments>) => {
  if (event === undefined) {
    throw new Error("text and imageId must be valid");
  }
  const { textList, imageId } = event.arguments;
  if (textList === undefined || imageId === undefined) {
    throw new Error("text and imageId must be valid");
  }
  if (textList.length > KEYWORD_COUNT_MAX) {
    throw new Error(
      `The number of keywords must be less than ${KEYWORD_COUNT_MAX}`
    );
  }
  if (event === undefined) {
    throw new Error(`You need to login.`);
  }
  if (event.identity === undefined) {
    throw new Error(`You need to login.`);
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
  const getImageResultItem = getImageResult.Item;
  if (getImageResultItem === undefined) {
    return;
  }

  const imageKey = getImageResultItem.key.S;
  if (imageKey === undefined) {
    return;
  }

  console.log({ imageKey });

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

  const isString = (s?: string): s is string => {
    return s !== undefined;
  };

  const keywords = getKeywordsResult.Items;
  const keywordIds =
    keywords === undefined
      ? []
      : keywords.map((keyword) => keyword.id.S).filter(isString);

  const now = new Date().toISOString();

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

  const deleteItems = keywordIds.map(generateDeleteItem);

  const generateCreateItem = (text: string) => {
    return {
      Put: {
        TableName: keywordTableName,
        Item: {
          id: {
            S: ulid(),
          },
          owner: {
            S: owner,
          },
          userSub: {
            S: owner,
          },
          imageId: {
            S: imageId,
          },
          imageKey: {
            S: imageKey,
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
      },
    };
  };

  const createItems = textList.map(generateCreateItem);

  await ddb
    .transactWriteItems({
      TransactItems: [...deleteItems, ...createItems],
    })
    .promise()
    .catch((e) => {
      console.log(e);
      throw e;
    });

  return createItems.map((item) => {
    return {
      id: item.Put.Item.id.S,
      owner: item.Put.Item.owner.S,
      imageId: item.Put.Item.imageId.S,
      text: item.Put.Item.text.S,
      createdAt: item.Put.Item.createdAt.S,
      updatedAt: item.Put.Item.updatedAt.S,
    };
  });
};
