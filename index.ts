// https://github.com/freshbooks/freshbooks-nodejs-sdk/blob/main/packages/api/README.md

// import { Client } from "@freshbooks/api";
import freshbooks from "@freshbooks/api";
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import open from "open";
import { read as opRead } from "@1password/op-js";

const { Client } = freshbooks;

const createClient = () => {
  const clientId = opRead.parse(
    "op://v7ogqjxnttwfv527qvfjpf7fcq/FreshBooks/API/Client ID"
  );
  const clientSecret = opRead.parse(
    "op://v7ogqjxnttwfv527qvfjpf7fcq/FreshBooks/API/Client Secret"
  );

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing FreshBooks application client ID or client secret"
    );
  }

  return new Client(clientId, {
    clientSecret,
    redirectUri: "https://afeld.me",
  });
};

const client = createClient();

const authorize = async () => {
  const authUrl = client.getAuthRequestUrl([
    "user:profile:read",
    // from example at
    // https://www.freshbooks.com/api/scopes
    "user:projects:read",
    "user:clients:read",
    "user:billable_items:read",
    "user:time_entries:read",
    "user:time_entries:write",

    // "user:bill_payments:read",
    // "user:bill_payments:write",
    // "user:billable_items:read",
    // "user:billable_items:write",
    // "user:business:read",
    // "user:business:write",
    // "user:clients:read",
    // "user:clients:write",
    // "user:credit_notes:read",
    // "user:credit_notes:write",
    // "user:estimates:read",
    // "user:estimates:write",
    // "user:expenses:read",
    // "user:expenses:write",
    // "user:invoices:read",
    // "user:invoices:write",
    // "user:journal_entries:read",
    // "user:journal_entries:write",
    // "user:notifications:read",
    // "user:notifications:write",
    // "user:online_payments:read",
    // "user:online_payments:write",
    // "user:other_income:read",
    // "user:other_income:write",
    // "user:payments:read",
    // "user:payments:write",
    // "user:projects:read",
    // "user:projects:write",
    // "user:reports:read",
    // "user:reports:write",
    // "user:retainers:read",
    // "user:retainers:write",
    // "user:taxes:read",
    // "user:taxes:write",
    // "user:teams:read",
    // "user:teams:write",
    // "user:time_entries:read",
    // "user:time_entries:write",
  ]);
  await open(authUrl, { app: { name: "firefox" } });

  const rl = readline.createInterface({ input, output });
  const code = await rl.question("Enter the authorization code: ");
  rl.close();

  const token = await client.getAccessToken(code);
  console.log(token);
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

console.log("Authorizing...");
await authorize();

console.log("Fetching business...");
const businessID = await getBusinessID();
console.log(businessID);

// const entries = await client.timeEntries.list(businessID);
// console.log(entries);

console.log("Creating time entry");
await client.timeEntries.create(
  // test entry
  {
    billable: true,
    clientId: 198915, // Dimagi
    duration: 60,
    isLogged: true,
    note: "test entry",
    projectId: 12667759, // SOW 3
    startedAt: new Date(),
  },
  businessID
);
