import * as userService from "../../services/users_services.js";

export function webSocketDashboard(io, espSocket)
{
    io.on("connection", (socket) => {

        // Log dashboard connection
        console.log("Dashboard Client connected:", socket.id);

        // Event handler for initial user dashboard connection
        socket.on("dashboard_auth", async (TOKEN) => {
            try
            {
                const token = TOKEN.token;

                // Validate user through jwt
                const user = await userService.getUser(token);
                if(!user)
                {
                    socket.emit("dashboard_auth_result", {
                        success: false,
                        error: "INVALID_TOKEN"
                    });
                    return;
                }

                // Create a defined 'room' for user according to their userID
                const userID = String(user.userID);
                socket.data.userID = userID;
                socket.join(`user:${userID}`);

                // Validate that user lookup was successful, and return all devices to dashboard
                socket.emit("dashboard_auth_result", {
                    success: true,
                    userID,
                    devices: Array.isArray(user.devices) ? user.devices : []
                });
            }
            catch (error)
            {
                socket.emit("dashboard_auth_result", {
                    success: false,
                    error: "AUTH_SERVER_ERROR"
                });
                console.log("Dashboard Auth Error:", error);
            }
        });

        // Event Handler for parsing incoming commands sent from the dashboard
        socket.on("device_command", async (msg) => {
            try
            {
                const deviceID = typeof msg?.deviceID === "string" ? msg.deviceID.trim() : "";
                const payload = msg?.payload;
                const token = msg?.token;
                const user = await userService.getUser(token);
                const userID = user.userID;

                // Validate that specified deviceID is present
                if(deviceID.length === 0)
                {
                    socket.emit("device_command_result", {
                        success: false,
                        error: "MISSING_DEVICE_ID"
                    });
                    return;
                }

                // Check to see that the current deviceID is operated by the current user
                const ownsDevice = await userService.userOwnsDevice({userID, deviceID});
                if(!ownsDevice)
                {
                    socket.emit("device_command_result", {
                        success: false,
                        deviceID,
                        error: "DEVICE_NOT_OWNED"
                    });
                    return;
                }

                // Verify that the current device is online
                if(!espSocket.isDeviceOnline(deviceID))
                {
                    socket.emit("device_command_result", {
                        success: false,
                        deviceID,
                        error: "DEVICE_OFFLINE"
                    });
                    return;
                }

                // Send command to the device
                const wasSent = espSocket.sendToDevice(deviceID, payload);
                socket.emit("device_command_result", {
                    success: wasSent,
                    deviceID,
                    error: wasSent ? null : "SEND_FAILED"
                });
            }
            catch (error)
            {
                socket.emit("device_command_result", {
                    success: false,
                    error: "COMMAND_SERVER_ERROR"
                });
                console.log("Device Command Error:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("Dashboard Client disconnected:", socket.id);
        });
    });
}
