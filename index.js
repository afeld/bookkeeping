// https://github.com/freshbooks/freshbooks-nodejs-sdk/blob/main/packages/api/README.md

import freshbooks from "@freshbooks/api";
const { Client } = freshbooks;

const clientId = process.env.FRESHBOOKS_APPLICATION_CLIENT_ID;
const clientSecret = process.env.FRESHBOOKS_APPLICATION_CLIENT_SECRET;

// Instantiate new FreshBooks API client
const client = new Client(clientId, {
  clientSecret,
  // redirectUri: 'https://your-redirect-uri.com/'
});

// Give this URL to the user so they can authorize your application
const authUrl = client.getAuthRequestUrl();
console.log(authUrl);

// This will redirect them to https://your-redirect-uri.com/?code=XXX
// const code = ...

// Returns an object containing the access token, refresh token, and expiry date
// Note that this function sets the token on this client instance to automatically
// authenticates all future requests with this client instance
const tokens = client.getAccessToken(code);
