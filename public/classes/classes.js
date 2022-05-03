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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Request_instances, _Request_tweetFromID, _Request_tweetID, _Request_action, _Request_text, _Request_lookUpUsername, _Request_broadCast, _Request_checkAndUpdate, _Request_addUser, _Request_updateUser;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = void 0;
const workers_js_1 = require("../worker-functions/workers.js");
const database_js_1 = require("../database.js");
class Request {
    constructor({ tweetFromID, tweetID, action, text }) {
        _Request_instances.add(this);
        _Request_tweetFromID.set(this, void 0);
        _Request_tweetID.set(this, void 0);
        _Request_action.set(this, void 0);
        _Request_text.set(this, void 0);
        __classPrivateFieldSet(this, _Request_tweetFromID, tweetFromID, "f"),
            __classPrivateFieldSet(this, _Request_tweetID, tweetID, "f"),
            __classPrivateFieldSet(this, _Request_action, action, "f"),
            __classPrivateFieldSet(this, _Request_text, text, "f");
    }
    main() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const action = __classPrivateFieldGet(this, _Request_action, "f").toLowerCase();
                if (action === ' question ') {
                    try {
                        yield __classPrivateFieldGet(this, _Request_instances, "m", _Request_checkAndUpdate).call(this, action);
                        yield (0, workers_js_1.retweet)(workers_js_1.Jedi, __classPrivateFieldGet(this, _Request_tweetID, "f"));
                        yield __classPrivateFieldGet(this, _Request_instances, "m", _Request_broadCast).call(this, yield (0, workers_js_1.getUserByID)(__classPrivateFieldGet(this, _Request_tweetFromID, "f")));
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else if (action === ' answer ') {
                    try {
                        yield __classPrivateFieldGet(this, _Request_instances, "m", _Request_checkAndUpdate).call(this, action);
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
                else if (action === ' update ') {
                    try {
                        yield (0, workers_js_1.retweet)(workers_js_1.Jedi, __classPrivateFieldGet(this, _Request_tweetID, "f"));
                        yield __classPrivateFieldGet(this, _Request_instances, "m", _Request_broadCast).call(this, yield (0, workers_js_1.getUserByID)(__classPrivateFieldGet(this, _Request_tweetFromID, "f")));
                    }
                    catch (e) {
                        console.error(e);
                    }
                }
            }
            catch (e) {
                console.error(e);
            }
        });
    }
}
exports.Request = Request;
_Request_tweetFromID = new WeakMap(), _Request_tweetID = new WeakMap(), _Request_action = new WeakMap(), _Request_text = new WeakMap(), _Request_instances = new WeakSet(), _Request_lookUpUsername = function _Request_lookUpUsername() {
    return __awaiter(this, void 0, void 0, function* () {
        let username = yield (0, workers_js_1.getUserByID)(__classPrivateFieldGet(this, _Request_tweetFromID, "f"));
        return `@${username}`;
    });
}, _Request_broadCast = function _Request_broadCast(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tag = yield __classPrivateFieldGet(this, _Request_instances, "m", _Request_lookUpUsername).call(this);
            const uri = `https://twitter.com/${username}/status/${__classPrivateFieldGet(this, _Request_tweetID, "f")}`;
            let article;
            const whatArticle = (__classPrivateFieldGet(this, _Request_action, "f") === ' question ') ? article = 'a' : article = 'an';
            whatArticle;
            const broadCast = `Heads up #DevAudience .. ${tag} just posted ${article} ${__classPrivateFieldGet(this, _Request_action, "f")} .. Please drop a like, retweet or comment/answer \n ${uri}`;
            yield (0, workers_js_1.postTwit)(broadCast);
        }
        catch (e) {
            console.error(e);
            throw (e);
        }
    });
}, _Request_checkAndUpdate = function _Request_checkAndUpdate(act) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let username = yield (0, workers_js_1.getUserByID)(__classPrivateFieldGet(this, _Request_tweetFromID, "f"));
            let user = yield (0, database_js_1.getStoredUser)({
                client: database_js_1.client,
                db: 'users',
                collection: 'actions',
                Username: username
            });
            const check = (user === null || user === undefined) ?
                yield __classPrivateFieldGet(this, _Request_instances, "m", _Request_addUser).call(this, act, username)
                :
                    yield __classPrivateFieldGet(this, _Request_instances, "m", _Request_updateUser).call(this, act, username, user);
            check;
            console.log('check complete');
        }
        catch (e) {
            console.error(e);
        }
    });
}, _Request_addUser = function _Request_addUser(act, username) {
    return __awaiter(this, void 0, void 0, function* () {
        if (act === ' question ') {
            try {
                yield (0, database_js_1.createUser)({
                    client: database_js_1.client,
                    db: 'users',
                    collection: 'actions',
                    newDoc: {
                        name: username,
                        userID: __classPrivateFieldGet(this, _Request_tweetFromID, "f"),
                        question_count: 1,
                        answer_count: 0
                    }
                });
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            try {
                yield (0, database_js_1.createUser)({
                    client: database_js_1.client,
                    db: 'users',
                    collection: 'actions',
                    newDoc: {
                        name: username,
                        userID: __classPrivateFieldGet(this, _Request_tweetFromID, "f"),
                        question_count: 0,
                        answer_count: 1
                    }
                });
            }
            catch (e) {
                console.error(e);
            }
        }
    });
}, _Request_updateUser = function _Request_updateUser(act, username, user) {
    return __awaiter(this, void 0, void 0, function* () {
        if (act === ' question ') {
            try {
                yield (0, database_js_1.updateUser)({
                    name: username,
                    client: database_js_1.client,
                    collection: 'actions',
                    db: 'users',
                    update: {
                        question_count: ((user === null || user === void 0 ? void 0 : user.question_count) + 1)
                    }
                });
            }
            catch (e) {
                console.error(e);
            }
        }
        else {
            try {
                yield (0, database_js_1.updateUser)({
                    name: username,
                    client: database_js_1.client,
                    collection: 'actions',
                    db: 'users',
                    update: {
                        answer_count: ((user === null || user === void 0 ? void 0 : user.answer_count) + 1)
                    }
                });
            }
            catch (e) {
                console.error(e);
            }
        }
    });
};
