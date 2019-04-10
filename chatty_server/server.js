const express = require("express");
const SocketServer = require("ws").Server;
const uuidv4 = require('uuid');

const PORT = 3001;

const server = express()
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on port ${PORT}`)
  );

const wss = new SocketServer({ server });

wss.on("connection", ws => {
  console.log("Client connected");

  ws.on('message', (message) => {
    const userMessage = JSON.parse(message);
    let { username, content, type } = userMessage;

    // Perform different task depending on the message type.
    switch(type) {
      case 'postMessage':
      type = 'incoming message',
      userMessage.id = uuidv4();
      wss.broadcast(JSON.stringify(userMessage));
      break;

      default:
      console.log('Cannot read message type');

    }
  })

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
