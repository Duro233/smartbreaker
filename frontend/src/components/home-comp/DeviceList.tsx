import { useDashboardSocket } from "./useDashboardSocket";
import { Box, Center, RingProgress, Grid, Text, ActionIcon, Progress, Button} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

type DevicePayloadListProps = {
    registeredDeviceIDs: string[];
    payloadsByDeviceID: Record<string, string>;
    statusByDeviceID: Record<string, boolean>;
}

type ParsedPayload = {
    parts: string[];
    part1: string;
    part2: string;
    part3: string;
};

function splitPayload(payload: string | undefined, delimiter = "|"): ParsedPayload {
    const parts = payload ? payload.split(delimiter).map((part) => part.trim()) : [];
    const [part1 = "", part2 = "", part3 = ""] = parts;

    return {
        parts,
        part1,
        part2,
        part3,
    };
}


export default function DeviceList({registeredDeviceIDs, payloadsByDeviceID, statusByDeviceID} : DevicePayloadListProps)
{
    const token = localStorage.getItem('token');
    const {sendDeviceCommand} = useDashboardSocket(token);
    const ringSize = 200;

    if(registeredDeviceIDs.length === 0)
        return <h4>No devices registered.</h4>;
    
    return (
        <>
            <Grid grow gutter="lg"> 
                {registeredDeviceIDs.map((deviceID) => {
                    const payload = payloadsByDeviceID[deviceID];
                    const { part1, part2, part3 } = splitPayload(payload);

                    return (
                <Grid.Col key={deviceID} span={3} className= {statusByDeviceID[deviceID] ? "dashboard-container" : "dashboard-container-offline"}>
                    
                    <div className="dashboard-container-action-icon-area">
                        <ActionIcon radius={'md'} variant="outline" color='red'>
                            <IconTrash></IconTrash>
                        </ActionIcon>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <h4 style={{margin: '0px'}}>{deviceID}</h4>
                        <h5 style={{margin: '0px'}}>{statusByDeviceID[deviceID] ? "Online | Active" : "Offline"}</h5>
                    </div>
                    <Center style={{ height: ringSize, width: '100%' }}>
                    <Box style={{ position: 'relative', width: ringSize, height: ringSize + 90 }}>
                        <RingProgress
                        size={ringSize}
                        thickness={8}
                        roundCaps
                        sections={[
                            {value: statusByDeviceID[deviceID] ? 10 : 0, color: 'green' /*temp setup*/}
                        ]}
                    />
                        <Center style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                            <Text size='xl' ta="center" lh={1}>
                                {statusByDeviceID[deviceID] ? "10 %" : "0 %" /*temp setup*/}
                            </Text>
                        </Center>
                    </Box>
                    </Center>
                    {/*payload ?? "No payload yet"*/}
                    <Text size="xs">{payload ? (part1+' A') : "Current = 0.0 A"}</Text>

                    <div className="dashboard-container-temperature-area">
                        <Progress radius='xs' size='md' value={statusByDeviceID[deviceID] ? 32 : 0} style={{width: '100%'}} striped animated color="green"/>
                        <Text size="xs">{payload ? ("Temperature = 32" +'° C') : "Temperature = 0.0° C"}</Text>
                    </div>
                    <Button variant="primary" onClick={() => sendDeviceCommand(deviceID, 'TOGGLE', token? token : '')}>DISABLE</Button>
                </Grid.Col>
            )})}
            </Grid>
        </>
    );
}
