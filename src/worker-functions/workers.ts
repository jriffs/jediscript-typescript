import { TwitterApi } from "twitter-api-v2"
import { config } from "dotenv"


config()
const api_key: string = process.env.API_KEY!
const api_key_secret: string = process.env.API_KEY_SECRET!
const bearer: string = process.env.BEARER_TOKEN!
const access_token: string = process.env.ACCESS_TOKEN!
const access_token_secret: string = process.env.ACCESS_TOKEN_SECRET!
export const Jedi: string = process.env.LOGGED_USER_ID!

const tokens = {
    appKey: api_key,
    appSecret: api_key_secret,
    accessSecret: access_token_secret,
    accessToken: access_token
}

export const user = new TwitterApi(tokens)

export const app = new TwitterApi(bearer)

export const rwUser = user.readWrite

export async function getUserByID(ID: string): Promise<string> {
    try {
        let { data } = await rwUser.v2.user(ID)
        return data?.username
    } catch (e) {
        console.error(e)
        throw (e)
    }
}

export function getProperties(str: string): string[] {
    return str.split('~')
}

export async function retweet(loggedUser: string, tweetID: string): Promise<void> {
    try {
        let rt = await rwUser.v2.retweet(loggedUser, tweetID)
        console.log(rt)
    } catch (e) {
        console.error(e)
        throw(e)
    }
}

export async function postTwit(message: string): Promise<void> {
    try {
        let data = await rwUser.v2.tweet(message)
        console.log(data?.data)
    } catch (error) {
        console.log(error)
        throw(error)
    }
}

export function checkSemantic(string: string): string {
    let arr: string[] = string.split(' ')

    removeSpaces(arr)
        
    if (check_if_reply(arr[0]) === 'reply') {
        arr.shift()
    }
    if (!arr.includes('~')) {
        return 'Syntax Error -> Does not include'
    }

    let how_many = countInArray(arr, '~')
    if (how_many !== 2 ) {
        return 'Syntax Error -> "~" is less or more than 2'
    }
    
    if (arr[1] !== '~' || arr[3] !== '~') {
        return 'Syntax Error -> "~" not in position 1 or 3'
    }

    if (!arr[4] || arr[4] === '') {
        return 'Syntax Error -> sentence lacking !!!'
    }

    return 'right syntax'
}

function check_if_reply(string: string): 'reply' | 'not reply' {
    const reply = (string.split('').includes('@'))? 'reply': 'not reply'
    return reply     
}

function countInArray(array: string[], symbol: string): number {
    return array.filter(item => item === symbol).length
}

function removeSpaces(arr: string[]) {
    while (arr.includes(' ') || arr.includes('')) {
        arr.forEach((item) => {
            if (item === ' ' || item === '') {
                let index: number = arr.findIndex((element) => element === item)
                arr.splice(index, 1)
            }
        })
    }         
}
