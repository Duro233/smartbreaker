import { useDashboardSocket } from "./useDashboardSocket";
import { Box, Center, RingProgress, Grid, Text, ActionIcon, Progress, Button, Loader, Tooltip} from "@mantine/core";
import { IconTrash, IconLogs} from "@tabler/icons-react";

type DevicePayloadListProps = {
    registeredDeviceIDs: string[];
    payloadsByDeviceID: Record<string, string>;
    statusByDeviceID: Record<string, boolean>;
    name: string[];
}

type ParsedPayload = {
    parts: string[];
    current_val: string;
    temp_val: string;
    current_max: string;
    temp_max: string;
    active: string;
};

function splitPayload(payload: string | undefined, delimiter = "|"): ParsedPayload {
    const parts = payload ? payload.split(delimiter).map((part) => part.trim()) : [];
    const [current_val = "", temp_val = "", current_max = "", temp_max = "", active = ""] = parts;

    return {
        parts,
        current_val,
        temp_val,
        current_max,
        temp_max,
        active
    };
}


const handleLogsPageRedirect = () =>
{
    window.location.href='/logs';
}

export default function DeviceList({registeredDeviceIDs, payloadsByDeviceID, statusByDeviceID, name} : DevicePayloadListProps)
{
    const token = localStorage.getItem('token');
    const {sendDeviceCommand} = useDashboardSocket(token);
    const ringSize = 200

    if(registeredDeviceIDs.length === 0)
        return(
            <div>
                <Loader size={100} color="rgba(126, 247, 150, 1)" type="bars" />
            </div>
        )
    return (
        <>
            <h2 style={{ display: 'flex', justifyContent: 'center' }}> Welcome Back {name}!</h2>
            <Grid grow gutter="lg"> 
                {registeredDeviceIDs.map((deviceID) => {
                    const payload = payloadsByDeviceID[deviceID];
                    console.log(payload); // log payload in console so I can see it :///////
                    const { current_val, temp_val, current_max, temp_max, active} = splitPayload(payload);
                    const current_percentage = (parseFloat(current_val.split("=")[1]) / (parseFloat(current_max.split("=")[1])) * 100);
                    const temperature_percentage = (parseFloat(temp_val.split('=')[1]) / (parseFloat(temp_max.split("=")[1])) * 100);
                    //console.log(current_percentage);
                    //console.log(temperature_percentage);
                
                return (
                <Grid.Col key={deviceID} span={3} className= {statusByDeviceID[deviceID] ? "dashboard-container" : "dashboard-container-offline"}>
                    
                    {/* Delete/Log Button Styling */}
                    <div className="dashboard-container-action-icon-area">
                        <Tooltip label="View Logs">
                        <ActionIcon radius={'md'} variant="outline" color='green' style={{marginTop: "5px"}} onClick={() => handleLogsPageRedirect()}>
                            <IconLogs></IconLogs>
                        </ActionIcon>
                        </Tooltip>

                        <Tooltip label="Remove Device">
                        <ActionIcon radius={'md'} variant="outline" color='red'>
                            <IconTrash></IconTrash>
                        </ActionIcon>
                        </Tooltip>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <h4 style={{margin: '0px'}}>{deviceID}</h4>
                        <h5 style={{margin: '0px'}}>{statusByDeviceID[deviceID] ? "Online | Active" : "Offline"}</h5>
                    </div>
                    {/* Ring Styling */}
                    <Center style={{ height: ringSize, width: '100%' }}>
                    <Box style={{ position: 'relative', width: ringSize, height: ringSize}}>
                        <RingProgress
                        size={ringSize}
                        thickness={8}
                        transitionDuration={100}
                        roundCaps
                        sections={[
                            {value: statusByDeviceID[deviceID] ? parseInt(current_percentage) : 0, color: 'green' /*temp setup*/}
                        ]}
                    />
                        {/* Ring Percentage Text*/}
                        <Center style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                            <Text size='xl' ta="center" lh={1}>
                                {statusByDeviceID[deviceID] ? parseInt(current_percentage) + "%": "0 %" /*temp setup*/}
                            </Text>
                        </Center>
                    </Box>
                    </Center>
                    {/*payload ?? "No payload yet"*/}
                    {<Text size="xs">{payload ? (current_val+' A') : "Current = 0.0 A"}</Text>}
                    <Text size="xs">{payload ? (current_max + ' A') : "Max Current = 0.0 A"}</Text>
                    <div className="dashboard-container-temperature-area">
                        <Progress radius='xs' size='md' value={statusByDeviceID[deviceID] ? 32 : 0} style={{width: '100%'}} striped animated color="green"/>
                        <Text size="xs">{payload ? (temp_val+'° C') : "Temperature = 0.0° C"}</Text>
                    </div>
                    <Button variant="primary" onClick={() => sendDeviceCommand(deviceID, 'TOGGLE', token? token : '')}>{parseInt(active.split("=")[1]) == 0 ? "ENABLE" : "DISABLE"}</Button>
                </Grid.Col>
            )})}
            </Grid>
        </>
    );
}
