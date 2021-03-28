"use strict";
exports.__esModule = true;
exports.generateDeleteItem = void 0;
var keywordTableName = "Keyword-jmjbhdjqq5dfxdngf5xtlbmqde-" + process.env.ENV;
var generateDeleteItem = function (id) {
    return {
        Delete: {
            TableName: keywordTableName,
            Key: {
                id: {
                    S: id
                }
            }
        }
    };
};
exports.generateDeleteItem = generateDeleteItem;
