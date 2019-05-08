import dotenv from "dotenv";
import express from "express";
import giphy from "giphy-api";
import request from "request";

dotenv.config();

const giphyApi = giphy(process.env.GIPHY_API_KEY);
const app = express();
const PORT = process.env.PORT; // default port to listen
const clientId = process.env.CLIENT_ID; // '123456789.123456789';
const clientSecret = process.env.CLIENT_SERCRET; // '11111a2222b3333c44444e';

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// Lets start our server
app.listen(PORT, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ PORT }` );
});

// This route handles GET requests to our root ngrok address and responds
// with the same "Ngrok is working message" we used before
app.get("/", (req, res) => {
    res.send("Ngrok is working! Path Hit: " + req.url);
});

// This route handles get request to a /oauth endpoint. We'll use this endpoint
// for handling the logic of the Slack oAuth process behind our app.
app.get("/oauth", (req, res) => {
    // When a user authorizes an app, a code query parameter is passed on the
    // oAuth endpoint. If that code is not there, we respond with an error message
    if (!req.query.code) {
        res.status(500);
        res.send({Error: "Looks like we're not getting code."});
        // tslint:disable-next-line:no-console
        console.log("Looks like we're not getting code.");
    } else {
        // If it's there...

        // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's
        // client ID, client secret, and the code we just got as query parameters.
        request({
            method: "GET", // Specify the method
            qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret}, // Query string data
            url: "https://slack.com/api/oauth.access", // URL to hit

        }, (error, response, body) => {
            if (error) {
                // tslint:disable-next-line:no-console
                console.log(error);
            } else {
                res.json(body);
            }
        });
    }
});

// Route the endpoint that our slash command will point to and send back a simple
// response to indicate that ngrok is working
app.post("/command", (req, res) => {
    giphyApi.random({
        fmt: "json",
        rating: "g",
        tag: "deploy"
    }, (err, giphyRes) => {
        // tslint:disable-next-line:no-console
        console.log(giphyRes.data.url);
        res.header("Content-type: application/json");
        res.send(
            {
                attachments: [
                    {
                        image_url: giphyRes.data.url
                    }
                ],
                parse: "full",
                response_type: "in_channel",
                text: "Deploy!",
                unfurl_links: true,
                unfurl_media: true,
            });
    });
});
