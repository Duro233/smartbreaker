import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export type DevicePayloadMap = Record<string, string>;

export function useDashboardSocket(token: string | null)
{
    const [authState, setAuthState] = useState("Pending");
    const [devicePayloadsById, setDevicePayloadsById] = useState<DevicePayloadMap>({});

    useEffect(() => {
        if(!token)
        {
            setAuthState("Missing token");
            return;
        }

        const authenticateDashboard = () => {
            socket.emit("dashboard_auth", {token});
        };

        const handleAuthResult = (result: any) => {
            if(result?.success)
            {
                setAuthState(`Authenticated as ${result.userID}`);
                return;
            }

            setAuthState(`Auth failed: ${result?.error ?? "Unknown error"}`);
        };

        const handleDeviceMessage = (arg: any) => {
            const incomingDeviceID = typeof arg?.deviceID === "string" ? arg.deviceID : "unknown-device";
            const incomingPayload = typeof arg?.payload === "string"
                ? arg.payload
                : JSON.stringify(arg?.payload ?? arg);

            // Keep latest payload per device ID.
            setDevicePayloadsById((prev) => ({
                ...prev,
                [incomingDeviceID]: incomingPayload
            }));
        };

        const handleDeviceStatus = (arg: any) => {
            console.log("device_status", arg);
        };

        const handleDeviceCommandResult = (arg: any) => {
            console.log("device_command_result", arg);
        };

        socket.on("connect", authenticateDashboard);
        socket.on("dashboard_auth_result", handleAuthResult);
        socket.on("device_message", handleDeviceMessage);
        socket.on("device_status", handleDeviceStatus);
        socket.on("device_command_result", handleDeviceCommandResult);

        if(socket.connected)
        {
            authenticateDashboard();
        }

        return () => {
            socket.off("connect", authenticateDashboard);
            socket.off("dashboard_auth_result", handleAuthResult);
            socket.off("device_message", handleDeviceMessage);
            socket.off("device_status", handleDeviceStatus);
            socket.off("device_command_result", handleDeviceCommandResult);
        };
    }, [token]);

    const sendDeviceCommand = (deviceID: string, payload: string) => {
        if(!deviceID.trim())
        {
            return;
        }

        socket.emit("device_command", {
            deviceID,
            payload
        });
    };

    return {
        authState,
        devicePayloadsById,
        sendDeviceCommand
    };
}
