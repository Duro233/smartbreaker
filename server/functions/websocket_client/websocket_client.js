import * as userService from "../../services/users_services.js";
import { EventEmitter } from "events";

export function webSocketClient(wss, io)
{
    let espSocket = new EventEmitter();
    wss.on('connection', async (ws) =>
    {
        // Ack. New Client Connected on Backend Console
        console.log('New client connected');
        try 
        {  
            const user = await userService.loginUser({email : "beefnasty@gmail.com", password : "ilikegaypeople"});
            if(user != null)
            {
                //console.log(user);
                ws.send("gaygaygayg");
                ws.send(user.email);
            }
        } 
        catch (error) 
        {
            console.log(error);
        }

        // Send a welcome message to the client
        ws.send('Welcome to the WebSocket server!');

        // ESP Client -> Dashboard
        ws.on('message', (message) => {
            console.log(`Received: ${message}`);
            io.emit("update", `Test ${message}`);
        });

        // Dashboard -> ESP Client
        espSocket.sendTo = (payload) =>
        {
            console.log("IM GAY GAY", payload);
            ws.send(payload);
        }

        // Close event handler
        ws.on('close', () => {
            ws.off();
            console.log('Client disconnected');
        });

    });



    return espSocket;
}

