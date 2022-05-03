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
exports.createUser = exports.getStoredUser = exports.updateUser = exports.client = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const uri = process.env.MONGO_DB_URI;
exports.client = new mongodb_1.MongoClient(uri);
function updateUser({ client, db, collection, name, update }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const result = yield client.db(db).collection(collection).updateOne({ name: name }, { $set: update });
            console.log(`${result.matchedCount} document(s) matched the query criteria.`);
            console.log(`${result.modifiedCount} document(s) was/were updated.`);
            yield client.close();
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.updateUser = updateUser;
function getStoredUser({ client, db, collection, Username }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const user = yield client.db(db).collection(collection).findOne({ name: Username }, { projection: { _id: 0, answer_count: 1, question_count: 1, name: 1 } });
            yield client.close();
            return user;
        }
        catch (error) {
            throw (error);
        }
    });
}
exports.getStoredUser = getStoredUser;
function createUser({ client, db, collection, newDoc }) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const result = yield client.db(db).collection(collection).insertOne(newDoc);
            yield client.close();
            if (result.insertedId) {
                let answer = 'successful';
                console.log(answer);
                return answer;
            }
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.createUser = createUser;
