"use strict";
/* Amplify Params - DO NOT EDIT
    API_REPLYIMAGEBUCKET_GRAPHQLAPIENDPOINTOUTPUT
    API_REPLYIMAGEBUCKET_GRAPHQLAPIIDOUTPUT
    API_REPLYIMAGEBUCKET_GRAPHQLAPIKEYOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var ulid_1 = require("ulid");
var aws = require("aws-sdk");
var KEYWORD_COUNT_MAX = 10;
exports.handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, textList, imageId, owner, ddb, getImageParams, getImageResult, getImageResultItem, imageKey, userSub, keywordTableName, scanKeywordsParams, getKeywordsResult, isString, keywords, keywordIds, now, generateDeleteItem, deleteItems, generateCreateItem, createItems;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log(JSON.stringify(event));
                if (event === undefined) {
                    throw new Error("text and imageId must be valid");
                }
                _a = event.arguments, textList = _a.textList, imageId = _a.imageId;
                if (textList === undefined || imageId === undefined) {
                    throw new Error("text and imageId must be valid");
                }
                if (textList.length > KEYWORD_COUNT_MAX) {
                    throw new Error("The number of keywords must be less than " + KEYWORD_COUNT_MAX);
                }
                if (event === undefined) {
                    throw new Error("You need to login.");
                }
                if (event.identity === undefined) {
                    throw new Error("You need to login.");
                }
                owner = event.identity.username;
                if (owner === undefined) {
                    throw new Error("You need to login first.");
                }
                aws.config.update({ region: process.env.REGION });
                ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });
                getImageParams = {
                    TableName: "Image-jmjbhdjqq5dfxdngf5xtlbmqde-" + process.env.ENV,
                    Key: {
                        id: {
                            S: event.arguments.imageId
                        }
                    }
                };
                return [4 /*yield*/, ddb
                        .getItem(getImageParams)
                        .promise()["catch"](function (e) {
                        console.log(e);
                        throw e;
                    })];
            case 1:
                getImageResult = _b.sent();
                if (!getImageResult) {
                    return [2 /*return*/];
                }
                getImageResultItem = getImageResult.Item;
                if (getImageResultItem === undefined) {
                    return [2 /*return*/];
                }
                imageKey = getImageResultItem.key.S;
                if (imageKey === undefined) {
                    return [2 /*return*/];
                }
                userSub = getImageResultItem.userSub.S;
                if (userSub === undefined) {
                    return [2 /*return*/];
                }
                keywordTableName = "Keyword-jmjbhdjqq5dfxdngf5xtlbmqde-" + process.env.ENV;
                scanKeywordsParams = {
                    TableName: keywordTableName,
                    ExpressionAttributeValues: {
                        ":v": {
                            S: imageId
                        }
                    },
                    FilterExpression: "imageId = :v"
                };
                return [4 /*yield*/, ddb
                        .scan(scanKeywordsParams)
                        .promise()["catch"](function (e) {
                        console.log(e);
                        throw e;
                    })];
            case 2:
                getKeywordsResult = _b.sent();
                if (!getKeywordsResult) {
                    return [2 /*return*/];
                }
                isString = function (s) {
                    return s !== undefined;
                };
                keywords = getKeywordsResult.Items;
                keywordIds = keywords === undefined
                    ? []
                    : keywords.map(function (keyword) { return keyword.id.S; }).filter(isString);
                now = new Date().toISOString();
                generateDeleteItem = function (id) {
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
                deleteItems = keywordIds.map(generateDeleteItem);
                generateCreateItem = function (text) {
                    return {
                        Put: {
                            TableName: keywordTableName,
                            Item: {
                                id: {
                                    S: ulid_1.ulid()
                                },
                                owner: {
                                    S: owner
                                },
                                userSub: {
                                    S: userSub
                                },
                                imageId: {
                                    S: imageId
                                },
                                imageKey: {
                                    S: imageKey
                                },
                                text: {
                                    S: text
                                },
                                __typename: {
                                    S: "Keyword"
                                },
                                createdAt: {
                                    S: now
                                },
                                updatedAt: {
                                    S: now
                                }
                            }
                        }
                    };
                };
                createItems = textList.map(generateCreateItem);
                return [4 /*yield*/, ddb
                        .transactWriteItems({
                        TransactItems: __spreadArrays(deleteItems, createItems)
                    })
                        .promise()["catch"](function (e) {
                        console.log(e);
                        throw e;
                    })];
            case 3:
                _b.sent();
                return [2 /*return*/, createItems.map(function (item) {
                        return {
                            id: item.Put.Item.id.S,
                            owner: item.Put.Item.owner.S,
                            imageId: item.Put.Item.imageId.S,
                            text: item.Put.Item.text.S,
                            createdAt: item.Put.Item.createdAt.S,
                            updatedAt: item.Put.Item.updatedAt.S
                        };
                    })];
        }
    });
}); };
