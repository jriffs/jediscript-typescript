import { getUserByID, checkSemantic, retweet, postTwit, Jedi } from "../worker-functions/workers.js"
import { ProjectedDocument, Req } from "../interfaces/interfaces.js"
import { updateUser, client, getStoredUser, createUser } from "../database.js"



export class Request implements Req {
    #tweetFromID: string
    #tweetID: string
    #action: string
    #text: string
    constructor({ tweetFromID, tweetID, action, text }: {tweetFromID: string, tweetID: string, action: string, text: string }) {
        this.#tweetFromID = tweetFromID,
        this.#tweetID = tweetID,
        this.#action = action,
        this.#text = text
    }

    public async main(): Promise<void> {
        try {
            const action = this.#action.toLowerCase()
            if (action === ' question ') {
                try {
                    await this.#checkAndUpdate(action)
                    await retweet(Jedi, this.#tweetID)
                    await this.#broadCast(await getUserByID(this.#tweetFromID))
                } catch (e) {
                    console.error(e)
                }
            }else if (action === ' answer ') {
                try {
                    await this.#checkAndUpdate(action)
                } catch (e) {
                    console.error(e)
                }
            } else if (action === ' update ') {
               try {
                await retweet(Jedi, this.#tweetID)
                await this.#broadCast(await getUserByID(this.#tweetFromID))
               } catch (e) {
                console.error(e)
               }
            } 
        } catch (e) {
            console.error(e)
        }
    }

    async #lookUpUsername(): Promise<string> {
        let username = await getUserByID(this.#tweetFromID)
        return `@${username}`                
    }

    async #broadCast(username: string): Promise<void> {
        try {
            const tag = await this.#lookUpUsername()
            const uri = `https://twitter.com/${username}/status/${this.#tweetID}`
            let article: string
            const whatArticle = (this.#action === ' question ')? article = 'a': article = 'an'
            whatArticle
            const broadCast = `Heads up #DevAudience .. ${tag} just posted ${article} ${this.#action} .. Please drop a like, retweet or comment/answer \n ${uri}`
            await postTwit(broadCast)
        } catch (e) {
            console.error(e)
            throw(e)
        }
    }

    async #checkAndUpdate(act: string): Promise<void> {
        try {
            let username = await getUserByID(this.#tweetFromID)
            let user = await getStoredUser({
                client: client,
                db: 'users',
                collection: 'actions',
                Username: username
            }) as ProjectedDocument | null  
            const check = (user === null || user === undefined)? 
            await this.#addUser(act, username)
            : 
            await this.#updateUser(act, username, user)
            check
            console.log('check complete')
        } catch (e) {
            console.error(e)
        }
    }

    async #addUser(act: string, username: string): Promise<void> {
        if (act === ' question ') {
            try {
                await createUser({
                    client: client,
                    db: 'users',
                    collection:'actions',
                    newDoc: {
                        name: username,
                        userID: this.#tweetFromID,
                        question_count: 1,
                        answer_count: 0 
                    }
                })
            } catch (e) {
                console.error(e)
            }
        } else {
            try {
                await createUser({
                    client: client,
                    db: 'users',
                    collection:'actions',
                    newDoc: {
                        name: username,
                        userID: this.#tweetFromID,
                        question_count: 0,
                        answer_count: 1 
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
    }

    async #updateUser(act: string, username: string, user: ProjectedDocument | null ): Promise<void> {
        if (act === ' question ') {
            try {
                await updateUser({
                    name: username,
                    client: client,
                    collection: 'actions',
                    db: 'users',
                    update: {
                        question_count: (user?.question_count! + 1)
                    }
                })
            } catch (e) {
                console.error(e)
            }
        } else {
            try {
                await updateUser({
                    name: username,
                    client: client,
                    collection: 'actions',
                    db: 'users',
                    update: {
                        answer_count: (user?.answer_count! + 1)
                    }
                })
            } catch (e) {
                console.error(e)
            }
        }
    }
}

