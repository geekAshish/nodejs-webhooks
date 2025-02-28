import express from "express";
import axios from "axios";

const app = express();
const PORT = 5678;

app.use(express.json());

const webhooks = {
  COMMIT: [],
  PUSH: [],
  MERGE: [],
};

app.get("/api/webhook", (req, res) => {
  const { payloadUrl, secret, eventTypes } = req.body;

  eventTypes.forEach((types) => {
    webhooks[types].push({ payloadUrl, secret });
  });

  res.sendStatus(201);
});

app.get("/api/event-emulate", (req, res) => {
  const { type, data } = req.body;

  // Event Trigger (call webhook)
  setTimeout(async () => {
    webhooks[type].forEach(async (webhook) => {
      const { payloadUrl, secret } = webhook;

      await axios.post(payloadUrl, data, {
        headers: {
          "x-secret": secret,
        },
      });
    });
  }, 0);

  res.sendStatus(201);
});

// this can be an another service
const messages = [];

app.get("/api/git-info", (req, res) => {
  const data = req.body;
  messages.push(data);

  res.sendStatus(201);
});

app.listen(PORT, () => {
  console.log(`server is listing on PORT: `, PORT);
});
