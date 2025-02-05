import { Client } from "@freshbooks/api";
import { createApp } from "@freshbooks/app";
import passport from "passport";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL;

const app = createApp(CLIENT_ID, CLIENT_SECRET, CALLBACK_URL);

// set up callback route
app.get("/auth/freshbooks/redirect", passport.authorize("freshbooks"));

// set up an authenticated route
app.get("/settings", passport.authorize("freshbooks"), async (req, res) => {
  // get an API client
  const { token } = req.user;
  const client = new Client(CLIENT_ID, token);

  // fetch the current user
  try {
    const { data } = await client.users.me();
    res.send(data.id);
  } catch ({ code, message }) {
    res.status(500, `Error - ${code}: ${message}`);
  }
});
