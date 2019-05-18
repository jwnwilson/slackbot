### Slackbot 

Setup

1. Create .env file with these values:

```
CLIENT_ID= slack bot id
CLIENT_SERCRET= slack bot secret
OAUTH= oauth token for slack bot with correct scope (send message scope required)
PORT=4000
GIPHY_API_KEY= giphy api key
```

2. install ngrok

3. run:

    npm run start 

    ngrok http 4000

4. Update hooks on slack to point to the generated endpoint
