import { useEffect, useState } from "react";

type DeviceCommandFormProps = {
    deviceIDs: string[];
    onSend: (deviceID: string, payload: string) => void;
};

export default function DeviceCommandForm({deviceIDs, onSend}: DeviceCommandFormProps)
{
    const [selectedDeviceID, setSelectedDeviceID] = useState("");
    const [payload, setPayload] = useState("Hello from React");

    useEffect(() => {
        if(deviceIDs.length === 0)
        {
            setSelectedDeviceID("");
            return;
        }

        if(!selectedDeviceID || !deviceIDs.includes(selectedDeviceID))
        {
            setSelectedDeviceID(deviceIDs[0]);
        }
    }, [deviceIDs, selectedDeviceID]);

    const handleSend = () => {
        if(!selectedDeviceID)
        {
            console.log("No deviceID available for command routing");
            return;
        }

        onSend(selectedDeviceID, payload);
    };

    return (
        <div>
            <label htmlFor="device-select">Device:</label>
            <select
                id="device-select"
                value={selectedDeviceID}
                onChange={(event) => setSelectedDeviceID(event.target.value)}
            >
                {deviceIDs.length === 0 && <option value="">No registered devices</option>}
                {deviceIDs.map((id) => (
                    <option key={id} value={id}>{id}</option>
                ))}
            </select>
            <input
                type="text"
                value={payload}
                onChange={(event) => setPayload(event.target.value)}
            />
            <button onClick={handleSend}>Send to Device</button>
        </div>
    );
}
