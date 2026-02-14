type DevicePayloadListProps = {
    payloadsByDeviceID: Record<string, string>;
};

export default function DevicePayloadList({payloadsByDeviceID}: DevicePayloadListProps)
{
    const entries = Object.entries(payloadsByDeviceID);
    if(entries.length === 0)
    {
        return <h4>No device payloads received yet.</h4>;
    }

    return (
        <>
            {entries.map(([deviceID, payload]) => (
                <h4 key={deviceID}>{deviceID}: {payload}</h4>
            ))}
        </>
    );
}
