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
const classes_js_1 = require("./classes/classes.js");
const workers_js_1 = require("./worker-functions/workers.js");
const twitter_api_v2_1 = require("twitter-api-v2");
function get_Stream() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let stream = yield workers_js_1.app.v2.searchStream({ "expansions": "author_id", "tweet.fields": "referenced_tweets" });
            /* setTimeout(() => {
                stream.close()
            }, 180000) */
            stream.on(
            // Emitted when Node.js {response} is closed by remote or using .close().
            twitter_api_v2_1.ETwitterStreamEvent.ConnectionClosed, () => console.log('Connection has been closed.'));
            stream.on(
            // Emitted when a Twitter payload (a tweet or not, given the endpoint).
            twitter_api_v2_1.ETwitterStreamEvent.Data, (eventData) => {
                console.log(`Tweet recieved -> ${eventData.data.text}`);
                const tweeted = eventData.data.text;
                let screened = (0, workers_js_1.checkSemantic)(tweeted);
                if (screened === 'right syntax') {
                    if (eventData.data.referenced_tweets) {
                        let type = eventData.data.referenced_tweets[0].type;
                        if (type === 'retweeted' || type === 'quoted') {
                            console.log(`this is a ${type} tweet`);
                            return;
                        }
                    }
                    let props = (0, workers_js_1.getProperties)(eventData['data'].text);
                    let obj = new classes_js_1.Request({
                        tweetFromID: eventData.data.author_id,
                        tweetID: eventData.data.id,
                        action: props[1],
                        text: props[2]
                    });
                    obj.main();
                }
                else
                    console.log('tweet not related to community');
            });
            stream.on(
            // Emitted when a Twitter sent a signal to maintain connection active
            twitter_api_v2_1.ETwitterStreamEvent.DataKeepAlive, () => console.log('Twitter has a keep-alive packet.'));
            // Enable reconnect feature
            stream.autoReconnect = true;
        }
        catch (error) {
            console.log(error);
        }
    });
}
get_Stream();
