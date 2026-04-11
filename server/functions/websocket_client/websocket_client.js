import * as userService from "../../services/users_services.js";
import * as dataService from "../../services/data_services.js";
import { EventEmitter } from "events";
import { getIdConnectPayload, messageParser } from "./websocket_client_aux.js";

const LOG_FLUSH_INTERVAL_MS = 60 * 1000;

function extractTelemetryValue(payloadText, label)
{
    if(typeof payloadText !== "string")
        return null;

    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = payloadText.match(new RegExp(`${escapedLabel}\\s*=\\s*(-?\\d+(?:\\.\\d+)?)`, "i"));
    if(!match)
        return null;

    const numericValue = Number(match[1]);
    return Number.isFinite(numericValue) ? numericValue : null;
}

function getTelemetryFromPayload(rawMessage)
{
    const current = extractTelemetryValue(rawMessage, "Current");
    const temperature = extractTelemetryValue(rawMessage, "Temperature");
    const activeValue = extractTelemetryValue(rawMessage, "Active?");

    if(current == null || temperature == null)
        return null;

    return {
        current,
        temperature,
        active: activeValue == null ? false : activeValue !== 0
    };
}

/* Refer to websocket_client_doc.txt for proper documentation */
export function webSocketClient(wss, io)
{
    const espSocket = new EventEmitter();

    const deviceSocketsById = new Map(); // Map of DeviceID -> WS Connection ID
    const wsMeta = new Map(); // Map of WS Connection ID -> DeviceID
    const latestTelemetryByDeviceId = new Map(); // Map of DeviceID -> latest telemetry snapshot

    const flushLatestTelemetry = async () =>
    {
        for(const [deviceID, telemetry] of latestTelemetryByDeviceId.entries())
        {
            try
            {
                await dataService.logData({
                    timestamp: telemetry.timestamp,
                    deviceID,
                    current: telemetry.current,
                    temperature: telemetry.temperature,
                    active: telemetry.active
                });
                latestTelemetryByDeviceId.delete(deviceID);
            }
            catch(error)
            {
                console.log("Telemetry Logging Error:", error);
            }
        }
    };

    setInterval(() => {
        void flushLatestTelemetry();
    }, LOG_FLUSH_INTERVAL_MS);

    // Handler method to see if referenced device is currently online
    espSocket.isDeviceOnline = (deviceID) => {
        if(typeof deviceID !== "string")
            return false;
        return deviceSocketsById.has(deviceID.trim());
    };

    // Method for handling 'messages' dashboard -> device
    espSocket.sendToDevice = (deviceID, payload) => {
        if(typeof deviceID !== "string")
            return false;
        if(typeof payload === "undefined")
            return false;

        // get desired ws connection by deviceID
        const targetDeviceID = deviceID.trim();
        const targetWs = deviceSocketsById.get(targetDeviceID);

        if(!targetWs || targetWs.readyState !== targetWs.OPEN)
            return false;

        // format payload
        const outgoingPayload = typeof payload === "string"
            ? payload
            : JSON.stringify(payload);


        targetWs.send(outgoingPayload);
        return true;
    };


    // ESP Device Handlers
    wss.on("connection", async (ws) =>
    {
        ws.on("message", async (message) => {
            const rawMessage = message.toString();
            let parsedPayload;

            try
            {
                parsedPayload = JSON.parse(rawMessage);
            }
            catch
            {
                parsedPayload = rawMessage;
            }

            const parsedMessage = messageParser(parsedPayload);
            const idConnectPayload = getIdConnectPayload(parsedMessage);

            // Message Handler (might be refactored)
            if(idConnectPayload)
            {
                // Try to register new device to account
                try
                {
                    const registerResult = await userService.registerDeviceToAccount(idConnectPayload);

                    // General register fail handler -> Send to client device
                    if(!registerResult.success)
                    {
                        ws.send(JSON.stringify({
                            type: "ID_CONNECT_RESULT",
                            success: false,
                            error: registerResult.error
                        }));
                        return;
                    }

                    const userID = String(registerResult.userID);
                    const deviceID = registerResult.deviceID;

                    deviceSocketsById.set(deviceID, ws); // Map deviceID -> ws Connection
                    wsMeta.set(ws, {userID, deviceID}); // Map ws Connection -> userID/deviceID

                    // Send to current client account connection results
                    ws.send(JSON.stringify({
                        type: "ID_CONNECT_RESULT",
                        success: true,
                        alreadyLinked: registerResult.alreadyLinked,
                        deviceID,
                        userID
                    }));

                    // Send to dashboard w/ current user that device is online
                    io.to(`user:${userID}`).emit("device_status", {
                        deviceID,
                        online: true
                    });
                    return;
                }
                catch (error)
                {
                    ws.send(JSON.stringify({
                        type: "ID_CONNECT_RESULT",
                        success: false,
                        error: "SERVER_ERROR"
                    }));
                    console.log("ID Connect Error:", error);
                    return;
                }
            }

            // Get associated metadata associated with current ws client connection
            const meta = wsMeta.get(ws);
            if(meta)
            {
                const telemetry = getTelemetryFromPayload(rawMessage);
                if(telemetry)
                {
                    latestTelemetryByDeviceId.set(meta.deviceID, {
                        ...telemetry,
                        timestamp: new Date()
                    });
                }

                // Send message to dashboard
                io.to(`user:${meta.userID}`).emit("device_message", {
                    deviceID: meta.deviceID,
                    payload: rawMessage,
                    online: true,
                    parsed: parsedMessage,
                    timestamp: Date.now()
                });
                return;
            }

            // Unidentified messages remain visible for debugging.
            io.emit("update", rawMessage);
        });

        // Handler for disconnecting a client websocket connection
        ws.on("close", () => {
            const meta = wsMeta.get(ws);
            if(meta)
            {
                const mappedWs = deviceSocketsById.get(meta.deviceID);
                if(mappedWs === ws)
                {
                    deviceSocketsById.delete(meta.deviceID);
                }

                io.to(`user:${meta.userID}`).emit("device_status", {
                    deviceID: meta.deviceID,
                    online: false
                });
            }

            wsMeta.delete(ws);
            ws.off();
            console.log("ESP Client disconnected");
        });
    });

    return espSocket;
}
