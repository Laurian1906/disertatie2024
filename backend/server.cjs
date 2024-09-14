const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const port = 3002;

const wss = new WebSocket.Server({ server });

let gameStateData = {
  cards: [],
  shuffled: false,
};

let connectedClients = {}; // Object to store client data

let roomId = uuidv4(); // Generate a unique room ID for each connection
console.log("Room ID:", roomId);

wss.on("connection", (ws) => {
  console.log("Client connected through WebSocket");

  ws.uuid = uuidv4(); 

  connectedClients[ws.uuid] = { name: "", score: 0, errors: 0, sessionId: ws.uuid };

  console.log("Server connected clients:", Object.keys(connectedClients).length);

  ws.roomId = roomId; 

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.action === "gameState") {
      if (data.cardHTML && connectedClients[ws.uuid]) {
        gameStateData.cards.push(data.cardHTML);

        if (Object.keys(connectedClients).length === 1) {
          ws.send(
            JSON.stringify({
              connectedClients: Object.keys(connectedClients).length,
            })
          );
        }
      } else {
        console.error("Error: Client data not found for gameState action!");
        ws.send(
          JSON.stringify({ action: "error", message: "Client data not found!" })
        );
      }

      if (gameStateData.cards.length === 12 && Object.keys(connectedClients).length === 1) {
        fs.writeFile(
          "sessionCards.txt",
          JSON.stringify(gameStateData.cards),
          (err) => {
            if (err) {
              console.error("Error writing cards to file:", err);
              ws.send(
                JSON.stringify({
                  action: "error",
                  message: "Error saving game state!",
                })
              );
            }
          }
        );
      }

      if (Object.keys(connectedClients).length > 1) {
        try {
          gameStateData.cards = JSON.parse(
            fs.readFileSync("sessionCards.txt", "utf8")
          );
        } catch (error) {
          console.error("Error reading cards from file:", error);
          ws.send(
            JSON.stringify({
              action: "error",
              message: "Error loading game state!",
            })
          );
        }
      }

      gameStateData.shuffled = true;
    }

    if (data.action === "requestCardsArray" && Object.keys(connectedClients).length > 1) {
      console.log("Received shuffle request from client");
      console.log(gameStateData.cards.toString());
      if (gameStateData.cards.length > 1) {
        console.log("Cards are being taken from a file...");
        const cardsData = gameStateData.cards;
        console.log("Cards taken! Sending them to client.");
        ws.send(JSON.stringify({ cards: cardsData }));
      }
    }

    if (data.action === "rotateCard") {
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          console.log("data.blockClass:", data.blockClass);
          client.send(
            JSON.stringify({
              action: "cardRotated",
              blockClass: data.blockClass,
              isFacedUp: data.isFacedUp,
              cardID: data.cardID,
            })
          );
          console.log("cardRotated sent to client");
        }
      });
    }

    if (data.action === "compareCards") {
      const { cardIDs } = data;
      const client = connectedClients[ws.uuid]; // Get client data

      if (!client) {
        console.error("Error: Client data not found for compareCards action!");
        ws.send(
          JSON.stringify({ action: "error", message: "Client data not found!" })
        );
        return;
      }

      const cardID1Base = cardIDs[0].split("-")[0];
      const cardID2Base = cardIDs[1].split("-")[0];

      const isEqual = cardID1Base === cardID2Base;

      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({
              action: "comparisonResult",
              cardIDs,
              isEqual,
            })
          );
          console.log("comparisonResult sent to client");
        }
      });
    }

    if (data.action === "updateScore") {
      const { score } = data;
      const client = connectedClients[ws.uuid]; // Folosește ws.uuid pentru identificare
    
      if (!client) {
        console.error("Error: Client not found for updateScore action!");
        ws.send(
          JSON.stringify({ action: "error", message: "Client not found!" })
        );
        return;
      }
    
      client.score = score; // Actualizează scorul clientului în obiectul global
      console.log(`Score ${score} of the player with sessionId ${ws.uuid}`);
    
      // Trimite scorul actualizat doar clientului care a făcut modificarea
      ws.send(JSON.stringify({ action: "scoreboard", score }));
    }

    if (data.action === "updateErrors") {
      const { error } = data;
      const client = connectedClients[ws.uuid]; // Get client data
    
      if (!client) {
        console.error("Error: Client not found for updateErrors action!");
        ws.send(
          JSON.stringify({ action: "error", message: "Client not found!" })
        );
        return;
      }
    
      client.errors = error; // Setează eroarea la valoarea dată pentru client
      console.error(`Error ${error} of the client with id ${client.sessionId}`);
      
      // Notifică clientul despre erorile actualizate
      ws.send(JSON.stringify({ action: "errorsUpdated", errors: client.errors }));
    }

    if (data.action === "client") {
      const { name } = data;
      connectedClients[ws.uuid].name = name; // Actualizează numele clientului
      console.log(`Player ${name} with sessionId: ${connectedClients[ws.uuid].sessionId} is connected!`);

      // Trimite datele inițiale înapoi clientului cu sessionId-ul generat
      ws.send(
        JSON.stringify({
          action: "clientData",
          name,
          sessionId: connectedClients[ws.uuid].sessionId,
        })
      );
    }
    
  });

  ws.on("close", () => {
    console.log("Client disconnected!");
    delete connectedClients[ws.uuid];
    console.log("Server connected clients:", Object.keys(connectedClients).length);
    gameStateData.shuffled = false;
  });
});

app.get("/", (req, res) => {
  res.send("Here is the server that handles things, you know...");
});

server.listen(port, () => {
  console.log("Server started on port: ", port);
  console.log(`You can access the app clicking here: http://localhost:${port}`);
});
