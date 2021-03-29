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
var aws = require("aws-sdk");
var dynamodb_1 = require("./shared/dynamodb");
exports.handler = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var imageId, owner, ddb, imageTableName, getImageParams, getImageResult, keywordTableName, scanKeywordsParams, getKeywordsResult, keywords, isString, keywordIds, deleteKeywords, deleteImage;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                imageId = event.arguments.imageId;
                console.log({ imageId: imageId });
                if (imageId === undefined) {
                    throw new Error("text and imageId must be valid");
                }
                if (event.identity === undefined) {
                    throw new Error("Identity not set");
                }
                owner = event.identity.username;
                if (owner === undefined) {
                    throw new Error("You need to login first.");
                }
                aws.config.update({ region: process.env.REGION });
                ddb = new aws.DynamoDB({ apiVersion: "2012-08-10" });
                imageTableName = "Image-jmjbhdjqq5dfxdngf5xtlbmqde-" + process.env.ENV;
                getImageParams = {
                    TableName: imageTableName,
                    Key: {
                        id: {
                            S: imageId
                        }
                    }
                };
                console.log(JSON.stringify(getImageParams));
                return [4 /*yield*/, ddb
                        .getItem(getImageParams)
                        .promise()["catch"](function (e) {
                        console.log(e);
                        throw e;
                    })];
            case 1:
                getImageResult = _a.sent();
                if (!getImageResult) {
                    return [2 /*return*/];
                }
                if (getImageResult.Item && getImageResult.Item.owner.S === owner) {
                    console.log("Image's owner is the user");
                }
                else {
                    throw new Error("Request must be from the image owner");
                }
                console.log({ getImageResult: getImageResult });
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
                getKeywordsResult = _a.sent();
                if (!getKeywordsResult) {
                    return [2 /*return*/];
                }
                keywords = getKeywordsResult.Items;
                isString = function (s) {
                    return s !== undefined;
                };
                keywordIds = keywords === undefined
                    ? []
                    : keywords.map(function (keyword) { return keyword.id.S; }).filter(isString);
                deleteKeywords = keywordIds.map(dynamodb_1.generateDeleteItem);
                deleteImage = {
                    Delete: {
                        TableName: "Image-jmjbhdjqq5dfxdngf5xtlbmqde-" + process.env.ENV,
                        Key: {
                            id: {
                                S: imageId
                            }
                        }
                    }
                };
                console.log({ imageId: imageId });
                console.log({ owner: owner });
                return [4 /*yield*/, ddb
                        .transactWriteItems({
                        TransactItems: __spreadArrays(deleteKeywords, [deleteImage])
                    })
                        .promise()["catch"](function (e) {
                        console.log(e);
                        throw e;
                    })];
            case 3:
                _a.sent();
                return [2 /*return*/, imageId];
        }
    });
}); };
