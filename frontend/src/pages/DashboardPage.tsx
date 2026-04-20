import getUser from '../routes/getuser';
import { useEffect, useMemo, useState } from 'react';
import { useDashboardSocket } from '../components/home-comp/useDashboardSocket';
import DeviceList from '../components/home-comp/DeviceList';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function DashboardPage()
{
  useScrollReveal();

  const userInfo: any = getUser();
  const token = localStorage.getItem('token');
  const {devicePayloadsById, deviceStatus} = useDashboardSocket(token);

  const deviceIDsFromUser = useMemo(() => {
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
  const [deviceIDs, setDeviceIDs] = useState<string[]>([]);

  useEffect(() => {
    setDeviceIDs(deviceIDsFromUser);
  }, [deviceIDsFromUser]);

  return (
    <div data-reveal style={{background: 'var(--app-bg)'}}>
      <DeviceList
        registeredDeviceIDs={deviceIDs}
        payloadsByDeviceID={devicePayloadsById}
        statusByDeviceID={deviceStatus}
        name={userInfo?.first}
        onDeviceDeleted={(deviceID) => {
          setDeviceIDs((currentDeviceIDs) =>
            currentDeviceIDs.filter((registeredDeviceID) => registeredDeviceID !== deviceID)
          );
        }}
      />
    </div>
  );
}
