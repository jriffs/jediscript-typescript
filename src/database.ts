import { MongoClient, MongoClientOptions } from "mongodb"
import { ProjectedDocument } from "./interfaces/interfaces.js";
import { config } from "dotenv"
config()

const uri: string = process.env.MONGO_DB_URI!

export const client = new MongoClient(uri)

export async function updateUser({client, db, collection, name, update}: {client: MongoClient, db: string, collection: string, name: string, update: {}}) {
    try {
        await client.connect()
        const result = await client.db(db).collection(collection).updateOne({ name: name }, { $set: update })
    
        console.log(`${result.matchedCount} document(s) matched the query criteria.`)
        console.log(`${result.modifiedCount} document(s) was/were updated.`)
        await client.close() 
    } catch (e) {
        console.error(e)
    }
}

export async function getStoredUser({client, db, collection, Username}: {client: MongoClient, db: string, collection: string, Username: string}) {
    try {
        await client.connect()
        const user = await client.db(db).collection(collection).findOne<ProjectedDocument>({ name: Username }, { projection: { _id: 0, answer_count: 1, question_count: 1, name: 1 } })
        await client.close()
        return user
    } catch (error) {
        throw(error)
    }
}

export async function createUser({client, db, collection, newDoc}: {client: MongoClient, db: string, collection: string, newDoc: {}}) {
    try {
        await client.connect()
        const result = await client.db(db).collection(collection).insertOne(newDoc)
        await client.close()
        if (result.insertedId) {
            let answer = 'successful'
            console.log(answer)
            return answer
        }
    } catch (e) {
        console.error(e)
    }
}