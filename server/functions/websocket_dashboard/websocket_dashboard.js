import * as userService from "../../services/users_services.js";

export function webSocketDashboard(io, espSocket)
{
    // Initial event handler for dashboard connecton
    io.on("connection", (socket) => {

        // Log dashboard connection
        console.log("Dashboard Client connected:", socket.id);

        socket.on("dashboard_auth", async (TOKEN) => {
            try
            {
                const token = TOKEN.token;
                if(typeof token !== "string" || token.length === 0)
                {
                    socket.emit("dashboard_auth_result", {
                        success: false,
                        error: "MISSING_TOKEN"
                    });
                    return;
                }

                const user = await userService.getUser(token);
                if(!user)
                {
                    socket.emit("dashboard_auth_result", {
                        success: false,
                        error: "INVALID_TOKEN"
                    });
                    return;
                }

                const userID = String(user.userID);
                socket.data.userID = userID;
                socket.join(`user:${userID}`);

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

        socket.on("device_command", async (msg) => {
            try
            {
                const userID = socket.data.userID;
                if(!userID)
                {
                    socket.emit("device_command_result", {
                        success: false,
                        error: "NOT_AUTHENTICATED"
                    });
                    return;
                }

                const deviceID = typeof msg?.deviceID === "string" ? msg.deviceID.trim() : "";
                const payload = msg?.payload;

                if(deviceID.length === 0)
                {
                    socket.emit("device_command_result", {
                        success: false,
                        error: "MISSING_DEVICE_ID"
                    });
                    return;
                }

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

                if(!espSocket.isDeviceOnline(deviceID))
                {
                    socket.emit("device_command_result", {
                        success: false,
                        deviceID,
                        error: "DEVICE_OFFLINE"
                    });
                    return;
                }

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
