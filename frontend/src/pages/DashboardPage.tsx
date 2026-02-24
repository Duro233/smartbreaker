import getUser from '../routes/getuser';
import { useMemo } from 'react';
import { useDashboardSocket } from '../components/home-comp/useDashboardSocket';
import DeviceList from '../components/home-comp/DeviceList';

export default function DashboardPage()
{
  const userInfo: any = getUser();
  const token = localStorage.getItem('token');
  const {authState, devicePayloadsById, deviceStatus, sendDeviceCommand} = useDashboardSocket(token);

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
    <h2> Welcome Back, {userInfo?.first}!</h2>
      <DeviceList
        registeredDeviceIDs={deviceIDs}
        payloadsByDeviceID={devicePayloadsById}
        statusByDeviceID={deviceStatus}
      />
    </div>
  );
}
