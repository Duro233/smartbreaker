import { useDashboardSocket } from "./useDashboardSocket";
import getUser from "../../routes/getuser";

type DevicePayloadListProps = {
    registeredDeviceIDs: string[];
    payloadsByDeviceID: Record<string, string>;
    statusByDeviceID: Record<string, boolean>;
}


export default function DeviceList({registeredDeviceIDs, payloadsByDeviceID, statusByDeviceID} : DevicePayloadListProps)
{
    const token = localStorage.getItem('token');
    const {sendDeviceCommand} = useDashboardSocket(token);

    //console.log(payloadsByDeviceID['EC8E5DDAF380']);


    if(registeredDeviceIDs.length === 0)
        return <h4>No devices registered.</h4>;
    
    return (
        <>
            {registeredDeviceIDs.map((deviceID) => (
                <h4 key={deviceID}>
                    {deviceID}
                    {" | "}
                    {statusByDeviceID[deviceID] ? "Online" : "Offline"}
                    {" | "}
                    {payloadsByDeviceID[deviceID] ?? "No payload yet"}
                    <button onClick={() => sendDeviceCommand(deviceID, 'TOGGLE', token? token : '')}>Toggle Button</button>
                </h4>
            ))}
        </>
    );
}
