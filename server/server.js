import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';


// Get .env setup file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({
  path: path.join(__dirname, '.env')
});

const app = express();

/* Imports associated with setting up full-duplex communication 
through websockets.
Server (socket.io) is what is used for Frontend(dashboard) -> Node Communication
WebSocket (ws) is what is used for ESP32 -> Node Communication*/
import http from 'http';
import { Server } from 'socket.io';
import WebSocket from 'ws';

// Functions for handling full-duplex communication
import {webSocketDashboard} from './functions/websocket_dashboard/websocket_dashboard.js';
import {webSocketClient} from './functions/websocket_client/websocket_client.js';

// Cors Nonced
const allowedOrigins = ['http://0.0.0.0:5173', 'http://localhost:5173', 'http://thesmartbuilder.xyz'];
app.use(cors( {origin: allowedOrigins, credentials : true}));
app.use(bodyParser.json());

// Setup Websocket Server for Clients (ESP32)
const wss = new WebSocket.Server( {port: 5001} );

// Setup Websocket Server for Dashboard (React Frontend)
const server = http.createServer(app);
const io = new Server(server,
  {
    cors:
    {
      // Use the port associated with the frontend? (idk what this looks like in prod)
      origin: [...allowedOrigins, "http://134.199.198.51"],
      methods: ["GET", "POST"]
    }
  }
);

// Come back to this (should be functions defined for handling nonce)
let esp_client = webSocketClient(wss, io);
webSocketDashboard(io, esp_client)

import { MongoClient } from 'mongodb';
const url = process.env.MONGO_URI;
const mdb_client = new MongoClient(url);

async function run()
{
  try {
    // Connect the client to the server
    await mdb_client.connect();
    // Ping test
    await mdb_client.db("admin").command({ping: 1});
    console.log("Pinged your deplyment. You successfully connected to MongoDB");
    
  } finally {
    await mdb_client.close();
    
  }
}
run().catch(console.dir);
await mongoose.connect(process.env.MONGO_URI);

// API Section
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


const PORT = process.env.PORT || 5000;
server.listen(PORT, "0.0.0.0", () => {
  console.log("Server Running");
});


//app.use(cors());
//app.use(express.json());
/*
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

//app.use('/api/auth', require('./routes/auth'));

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */
