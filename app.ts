import { read as opRead } from "@1password/op-js";
import api from "@freshbooks/api";
import fbApp from "@freshbooks/app";
import passport from "passport";

const { Client } = api;
const { createApp } = fbApp;

const CLIENT_ID = opRead.parse(
  "op://v7ogqjxnttwfv527qvfjpf7fcq/FreshBooks/API/Client ID"
);
const CLIENT_SECRET = opRead.parse(
  "op://v7ogqjxnttwfv527qvfjpf7fcq/FreshBooks/API/Client Secret"
);

if (!CLIENT_ID || !CLIENT_SECRET) {
  throw new Error("Missing FreshBooks application client ID or client secret");
}

const PORT = 3000;
const ORIGIN = "https://afeld-bookkeeping.loca.lt";
const AUTH_PATH = "/settings";
const CALLBACK_PATH = "/auth/freshbooks/redirect";
const CALLBACK_URL = ORIGIN + CALLBACK_PATH;

const app = createApp(CLIENT_ID, CLIENT_SECRET, CALLBACK_URL);

// set up authorization route
app.get(AUTH_PATH, passport.authorize("freshbooks"));

// set up an authenticated route
app.get(CALLBACK_PATH, passport.authorize("freshbooks"), async (req, res) => {
  // get an API client
  const code = req.query.code.toString();
  const client = new Client(CLIENT_ID, {
    clientSecret: CLIENT_SECRET,
    redirectUri: CALLBACK_URL,
  });
  await client.getAccessToken(code);

  // fetch the current user
  try {
    const { data } = await client.users.me();
    res.send(data.id);
  } catch ({ code, message }) {
    res.status(500);
    res.send(`Error - ${code}: ${message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Example app running: ${ORIGIN}${AUTH_PATH}`);
});
