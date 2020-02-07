# Starter App Using Node, TypeScript, React and Parcel

This example app shows how to create a simple server using Express and TypeScript, as well as a frontend to interact with it using React and Parcel. This uses Okta for authentication.

**Prerequisites**: [Node.js](https://nodejs.org/en/).

## Getting Started

To install this example application, run the following commands:

```bash
npm install
```

This will install a local copy of the project. You will need to set up some environment variables before the app will run properly.

To integrate Okta's Identity Platform for user authentication, you'll first need to:


You will need to create an application in Okta:
* Log in to your Okta account, then navigate to **Applications** and click the **Add Application** button
* Select **Single-Page App** and click **Next**
* Give your application a name (e.g. "Real-Time Chat")
* Click **Done**
* Save your **Client ID** for later

You'll also need to create a token in Okta:

* From your Okta account, navigate to **Tokens** from the **API** dropwon in the header
* Click **Create Token**
* Give your token a name (e.g. "Real-Time Chat")
* Click **Done**
* Save your **Token** for later (if you lose this, you'll need to create another one)

Now create a file called `.env` in the project root and add the following variables, replacing the values with your own from the previous steps.
**.env**
```bash
OKTA_ORG_URL=https://{yourOktaOrgUrl}
OKTA_CLIENT_ID={yourClientId}
OKTA_TOKEN={yourToken}
```

Now create a file at `src/client/config.json` based on `config.json.example`, replacing the values with your own from the previous steps.
**config.json**
```json
{
  "oktaOrgUrl": "<yourOktaOrgUrl>",
  "oktaClientId": "<yourClientId>"
}
```

Now you can run both the Node backend and the React frontend with the following command:

```bash
npm start
```

## License

Apache 2.0, see [LICENSE](LICENSE).

