const keywordTableName = `Keyword-jmjbhdjqq5dfxdngf5xtlbmqde-${process.env.ENV}`;
export const generateDeleteItem = (id: string) => {
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
