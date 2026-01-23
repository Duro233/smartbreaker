import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.join(__dirname, 'secrets.env')
});

const app = express();

import http from 'http';
import { Server } from 'socket.io';
import WebSocket from 'ws';

import {webSocketDashboard} from './functions/websocket_dashboard/websocket_dashboard.js';
import {webSocketClient} from './functions/websocket_client/websocket_client.js';

const allowedOrigins = ['http://0.0.0.0:5173', 'http://localhost:5173'];
app.use(cors( { origin: allowedOrigins, credentials: true} ));
app.use(bodyParser.json());

// Setup Websocket Server for Clients
const wss = new WebSocket.Server({ port: 5001 });


// Setup Websocket Server for Dashboard
const server = http.createServer(app);
const io = new Server(server, 
{
  cors: 
  {
    // Use port associated with the frontend
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});
let esp_client = webSocketClient(wss, io);
// console.log("serverjs test: ", esp_client);

webSocketDashboard(io, esp_client);
// Websocket Interface w/ Respect to Frontend
/*io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("Test Balls", (msg) => {
    console.log("Message received:", msg);
    try 
    {
      if(espSocket === null)
        throw new Error("ESP Client is Not Connected");
      espSocket.send(`${msg}`);
    }
    catch (error)
    {
      console.log("beef", error);
    } 
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});*/


// WebSocket Interface w/ Regards to ESP32
/*let espSocket = null;
const wss = new WebSocket.Server({ port: 5001 });
// Connection event handler
wss.on('connection', (ws) => {
  console.log('New client connected');
  espSocket = ws;
  
  // Send a welcome message to the client
  ws.send('Welcome to the WebSocket server!');
 
  // Message event handler
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
    io.emit("update", `Test ${message}`);
    // Echo the message back to the client
   // ws.send(`Server received: ${message}`);
  });

  // Close event handler
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});*/


import { MongoClient } from 'mongodb';
const url = process.env.MONGO_DB;
const mdb_client = new MongoClient(url);

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mdb_client.connect();
    // Send a ping to confirm a successful connection
    await mdb_client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mdb_client.close();
  }
}
run().catch(console.dir);

//const user_db = mdb_client.db('Users');
await mongoose.connect(process.env.MONGO_DB);



// API section
import {setApp} from './api.js';
setApp(app, mdb_client);





app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader
    (
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader
    (
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

server.listen(5000, "0.0.0.0", () => {
	console.log(`Server Running`);
}); // start Node + Express server on port 5000



