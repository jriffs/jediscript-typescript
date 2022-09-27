import { Request } from "./classes/classes.js"
import { app, checkSemantic, getProperties } from "./worker-functions/workers.js"
import { ETwitterStreamEvent } from "twitter-api-v2"


// http://localhost:5000/files/8decc08a-a0a1-4ad8-b800-860fbc68076a/url?filename=N6J48GW-cat-meowing.mp3

async function get_Stream() {
    try {
        let stream = await app.v2.searchStream({"expansions": "author_id", "tweet.fields": "referenced_tweets"})

        /* setTimeout(() => {
            stream.close()
        }, 180000) */
          
        stream.on(
        // Emitted when Node.js {response} is closed by remote or using .close().
        ETwitterStreamEvent.ConnectionClosed,
        () => console.log('Connection has been closed.'),
        )
        
        // http://localhost:5000/files/8decc08a-a0a1-4ad8-b800-860fbc68076a/url?filename=N6J48GW-cat-meowing.mp3
          
        stream.on(
        // Emitted when a Twitter payload (a tweet or not, given the endpoint).
        ETwitterStreamEvent.Data,
        (eventData) => {
            console.log(`Tweet recieved -> ${eventData.data.text}`)
            const tweeted = eventData.data.text
             
            let screened = checkSemantic(tweeted)
            if (screened === 'right syntax') {
                if (eventData.data.referenced_tweets) {
                    let type = eventData.data.referenced_tweets[0].type
                    if (type === 'retweeted' || type === 'quoted') {
                        console.log(`this is a ${type} tweet`)
                        return    
                    }
                }
                let props = getProperties(eventData['data'].text)                
                let obj = new Request({
                    tweetFromID: eventData.data.author_id!,
                    tweetID: eventData.data.id,
                    action: props[1],
                    text: props[2]
                })
                obj.main()
            }else console.log('tweet not related to community')
        })
          
        stream.on(
        // Emitted when a Twitter sent a signal to maintain connection active
        ETwitterStreamEvent.DataKeepAlive,
        () => console.log('Twitter has a keep-alive packet.'),
        )
          
        // Enable reconnect feature
        stream.autoReconnect = true
    } catch (error) {
        console.log(error)
    }
}

get_Stream()


