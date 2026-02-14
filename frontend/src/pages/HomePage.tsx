import getUser from '../routes/getuser';
import { useMemo } from 'react';
import Navigation from '../components/navigation';
import { useDashboardSocket } from '../components/home-comp/useDashboardSocket';
import DevicePayloadList from '../components/home-comp/DevicePayloadList';
import DeviceCommandForm from '../components/home-comp/DeviceCommandForm';

export default function HomePage()
{
  const userInfo: any = getUser();
  const token = localStorage.getItem('token');
  const {authState, devicePayloadsById, sendDeviceCommand} = useDashboardSocket(token);

  const deviceIDs = useMemo(() => {
    if(Array.isArray(userInfo?.regDevices) && userInfo.regDevices.length > 0)
    {
      return userInfo.regDevices.map((id: any) => String(id));
    }

    if(Array.isArray(userInfo?.devices) && userInfo.devices.length > 0)
    {
      return userInfo.devices.map((id: any) => String(id));
    }

    return [];
  }, [userInfo]);

  return (
    <div style={{background: 'var(--app-bg)'}}>
      <Navigation></Navigation>
      <h2>Home Page</h2>
      <h2>{userInfo?.first} {userInfo?.last}</h2>
      <h4>{authState}</h4>
      <DeviceCommandForm deviceIDs={deviceIDs} onSend={sendDeviceCommand} />
      <DevicePayloadList payloadsByDeviceID={devicePayloadsById} />
    </div>
  );
}
