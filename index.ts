// https://github.com/freshbooks/freshbooks-nodejs-sdk/blob/main/packages/api/README.md

// import { Client } from "@freshbooks/api";
import freshbooks from "@freshbooks/api";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import open from "open";

const { Client } = freshbooks;

const clientId = process.env.FRESHBOOKS_APPLICATION_CLIENT_ID;
const clientSecret = process.env.FRESHBOOKS_APPLICATION_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing FreshBooks application client ID or client secret");
}

// Instantiate new FreshBooks API client
const client = new Client(clientId, {
  clientSecret,
  redirectUri: "https://afeld.me",
});

// Give this URL to the user so they can authorize your application
const authUrl = client.getAuthRequestUrl();
// console.log(authUrl);

await open(authUrl, { app: { name: "firefox" } });

const rl = readline.createInterface({ input, output });
const answer = await rl.question("Enter the authorization code: ");
rl.close();

// This will redirect them to https://your-redirect-uri.com/?code=XXX
// const code = ...

// Returns an object containing the access token, refresh token, and expiry date
// Note that this function sets the token on this client instance to automatically
// authenticates all future requests with this client instance
// const tokens = client.getAccessToken(code);
