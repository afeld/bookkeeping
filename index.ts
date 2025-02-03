// https://github.com/freshbooks/freshbooks-nodejs-sdk/blob/main/packages/api/README.md

// import { Client } from "@freshbooks/api";
import freshbooks from "@freshbooks/api";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import open from "open";
import { read as opRead } from "@1password/op-js";

const { Client } = freshbooks;
const rl = readline.createInterface({ input, output });

const clientId = opRead.parse(
  "op://v7ogqjxnttwfv527qvfjpf7fcq/FreshBooks/API/Client ID"
);
const clientSecret = opRead.parse(
  "op://v7ogqjxnttwfv527qvfjpf7fcq/FreshBooks/API/Client Secret"
);

if (!clientId || !clientSecret) {
  throw new Error("Missing FreshBooks application client ID or client secret");
}

const client = new Client(clientId, {
  clientSecret,
  redirectUri: "https://afeld.me",
});

const authorize = async () => {
  const authUrl = client.getAuthRequestUrl([
    "user:profile:read",
    "user:clients:read",
    "user:time_entries:read",
    "user:time_entries:write",
  ]);
  await open(authUrl, { app: { name: "firefox" } });
  const code = await rl.question("Enter the authorization code: ");
  await client.getAccessToken(code);
};

const getBusinessID = async () => {
  const identity = await client.users.me();

  if (identity.ok === true) {
    const business = identity.data.businessMemberships[0];
    return business.id;
  } else {
    throw new Error("Failed to fetch business ID");
  }
};

await authorize();
const businessID = await getBusinessID();
console.log(businessID);

rl.close();
