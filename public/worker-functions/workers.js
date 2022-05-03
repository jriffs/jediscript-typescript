"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkSemantic = exports.postTwit = exports.retweet = exports.getProperties = exports.getUserByID = exports.rwUser = exports.app = exports.user = exports.Jedi = void 0;
const twitter_api_v2_1 = require("twitter-api-v2");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const api_key = process.env.API_KEY;
const api_key_secret = process.env.API_KEY_SECRET;
const bearer = process.env.BEARER_TOKEN;
const access_token = process.env.ACCESS_TOKEN;
const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
exports.Jedi = process.env.LOGGED_USER_ID;
const tokens = {
    appKey: api_key,
    appSecret: api_key_secret,
    accessSecret: access_token_secret,
    accessToken: access_token
};
exports.user = new twitter_api_v2_1.TwitterApi(tokens);
exports.app = new twitter_api_v2_1.TwitterApi(bearer);
exports.rwUser = exports.user.readWrite;
function getUserByID(ID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { data } = yield exports.rwUser.v2.user(ID);
            return data === null || data === void 0 ? void 0 : data.username;
        }
        catch (e) {
            console.error(e);
            throw (e);
        }
    });
}
exports.getUserByID = getUserByID;
function getProperties(str) {
    return str.split('~');
}
exports.getProperties = getProperties;
function retweet(loggedUser, tweetID) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let rt = yield exports.rwUser.v2.retweet(loggedUser, tweetID);
            console.log(rt);
        }
        catch (e) {
            console.error(e);
            throw (e);
        }
    });
}
exports.retweet = retweet;
function postTwit(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let data = yield exports.rwUser.v2.tweet(message);
            console.log(data === null || data === void 0 ? void 0 : data.data);
        }
        catch (error) {
            console.log(error);
            throw (error);
        }
    });
}
exports.postTwit = postTwit;
function checkSemantic(string) {
    let arr = string.split(' ');
    removeSpaces(arr);
    if (check_if_reply(arr[0]) === 'reply') {
        arr.shift();
    }
    if (!arr.includes('~')) {
        return 'Syntax Error -> Does not include';
    }
    let how_many = countInArray(arr, '~');
    if (how_many !== 2) {
        return 'Syntax Error -> "~" is less or more than 2';
    }
    if (arr[1] !== '~' || arr[3] !== '~') {
        return 'Syntax Error -> "~" not in position 1 or 3';
    }
    if (!arr[4] || arr[4] === '') {
        return 'Syntax Error -> sentence lacking !!!';
    }
    return 'right syntax';
}
exports.checkSemantic = checkSemantic;
function check_if_reply(string) {
    const reply = (string.split('').includes('@')) ? 'reply' : 'not reply';
    return reply;
}
function countInArray(array, symbol) {
    return array.filter(item => item === symbol).length;
}
function removeSpaces(arr) {
    while (arr.includes(' ') || arr.includes('')) {
        arr.forEach((item) => {
            if (item === ' ' || item === '') {
                let index = arr.findIndex((element) => element === item);
                arr.splice(index, 1);
            }
        });
    }
}
