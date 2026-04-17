import { ActionIcon, Button, Loader, NativeSelect, Paper, Popover, Stack, Text, TextInput, Tooltip } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { API } from "../routes/auth";
import { AreaChart } from "@mantine/charts";
import { ReferenceArea } from "recharts";
import { IconCalendar, IconId } from "@tabler/icons-react";
import { useDashboardSocket } from "../components/home-comp/useDashboardSocket";
import getUser from "../routes/getuser";
import { DateTimePicker } from "@mantine/dates";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSearchParams } from "react-router-dom";

type LogEntry = {
  _id: string;
  timestamp: string;
  deviceID: string;
  current: number;
  temperature: number;
  active?: boolean;
};

export default function LogsPage()
{
  useScrollReveal();

  const userInfo: any = getUser();
  const [searchParams] = useSearchParams();
  const selectedDeviceIDFromQuery = (searchParams.get("deviceID") ?? "").trim();
  const token = localStorage.getItem("token");
  useDashboardSocket(token);

  const deviceIDs = useMemo(() => {
    if(Array.isArray(userInfo?.regDevices) && userInfo.regDevices.length > 0)
      return userInfo.regDevices.map((id: any) => String(id));

    if(Array.isArray(userInfo?.devices) && userInfo.devices.length > 0)
      return userInfo.devices.map((id: any) => String(id));

    return [];
  }, [userInfo]);

  const [deviceID, setDeviceID] = useState("[Pick a Registered Device]");
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [datePopoverOpened, setDatePopoverOpened] = useState(false);
  const [didAutoloadQueryDevice, setDidAutoloadQueryDevice] = useState(false);

  const sortedLogs = [...logs]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const chartData = sortedLogs.map((log) => ({
    timestampMs: new Date(log.timestamp).getTime(),
    current: Number(log.current.toFixed(2)),
    temperature: Number(log.temperature.toFixed(2)),
  }));

  const inactiveReferenceAreas = [];
  let inactiveStart: number | null = null;

  for(let i = 0; i < sortedLogs.length; i += 1)
  {
    const log = sortedLogs[i];
    const chartTimestamp = new Date(log.timestamp).getTime();
    const isInactive = log.active === false;
    const nextLog = sortedLogs[i + 1];
    const nextTimestamp = nextLog ? new Date(nextLog.timestamp).getTime() : chartTimestamp;

    if(isInactive && inactiveStart == null)
      inactiveStart = chartTimestamp;

    if(inactiveStart != null && (!isInactive || i === sortedLogs.length - 1))
    {
      inactiveReferenceAreas.push({
        x1: inactiveStart,
        x2: isInactive ? nextTimestamp : chartTimestamp
      });

      inactiveStart = null;
    }
  }

  async function getLogs(targetDeviceID: string)
  {
    try
    {
      setErrorMessage("");

      const params = new URLSearchParams({
        deviceID: targetDeviceID,
        limit: "1000"
      });

      if(startDate)
        params.append("startDate", new Date(startDate).toISOString());

      if(endDate)
        params.append("endDate", new Date(endDate).toISOString());

      const response = await API.get(`/data/logs?${params.toString()}`);
      setLogs(Array.isArray(response.data.logs) ? response.data.logs : []);
    }
    catch(error: any)
    {
      setLogs([]);
      setErrorMessage(error?.response?.data?.message ?? "Failed To Fetch Prior Data");
      console.log(error);
    }
  }

  function handleDeviceChange(nextDeviceID: string)
  {
    setDeviceID(nextDeviceID);
    getLogs(nextDeviceID);
  }

  function applyDateRange()
  {
    setDatePopoverOpened(false);
    getLogs(deviceID);
  }

  useEffect(() => {
    if(didAutoloadQueryDevice)
      return;

    if(selectedDeviceIDFromQuery.length === 0)
    {
      setDidAutoloadQueryDevice(true);
      return;
    }

    if(!deviceIDs.includes(selectedDeviceIDFromQuery))
      return;

    setDidAutoloadQueryDevice(true);
    handleDeviceChange(selectedDeviceIDFromQuery);
  }, [didAutoloadQueryDevice, selectedDeviceIDFromQuery, deviceIDs]);

  return (
    <div className="logs-page-styling">

      {errorMessage ? (
        <Text data-reveal c="red" style={{ marginTop: "16px" }}>
          {errorMessage}
        </Text>
      ) : null}

      <Paper data-reveal withBorder p="md" className="logs-chart" style={{ marginTop: "24px" }}>
        <div className="logs-metadata-styling-area">
          <Text fw={400} mb="lg">Previous Logs - {deviceID}</Text>
          <Text>
            {startDate ? new Date(startDate).toLocaleString() + " - ": ""} {endDate ? new Date(endDate).toLocaleString() : ""}
          </Text>
          <div className="logs-buttons">
            <Popover
              trapFocus
              position="bottom-end"
              shadow="md"
              offset={18}
              opened={datePopoverOpened}
              onChange={setDatePopoverOpened}
              withOverlay
              overlayProps={{ zIndex: 298, blur: '4px'}}
              zIndex={299}
            >
              <Popover.Target>
                <Tooltip label="Date Range">
                  <ActionIcon
                    radius="md"
                    variant="outline"
                    color="green"
                    style={{ marginTop: "5px", width: "5%" }}
                    onClick={() => setDatePopoverOpened((opened) => !opened)}
                  >
                    <IconCalendar />
                  </ActionIcon>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                <Stack gap="sm" w={320}>
                  <DateTimePicker
                    label="Start Date"
                    placeholder="Select start date"
                    value={startDate}
                    onChange={setStartDate}
                    dropdownType="popover"
                    popoverProps={{ withinPortal: false }}
                    clearable
                    classNames={
                      {
                        label: "device-popover-text",
                        input: "date-input-field",
                        calendarHeader: "calendar-header",
                        calendarHeaderControl: "calendar-header-control",
                        levelsGroup: "calendar-body",
                        timeInput: "calendar-time-input",
                        submitButton: "submit-button"
                      }}
                    timePickerProps={
                      {
                        withDropdown: true,
                        format: '12h',
                        classNames: {
                          input: "calendar-time-input",
                          section: "calendar-time-section",
                          controlsListGroup: "calendar-body",
                          control: "calendar-header-control"
                        }
                      }
                    }
                  />
                  <DateTimePicker
                    label="End Date"
                    placeholder="Select end date"
                    value={endDate}
                    onChange={setEndDate}
                    dropdownType="popover"
                    popoverProps={{ withinPortal: false }}
                    clearable
                    classNames={
                      {
                        label: "device-popover-text",
                        input: "date-input-field",
                        calendarHeader: "calendar-header",
                        calendarHeaderControl: "calendar-header-control",
                        levelsGroup: "calendar-body",
                        timeInput: "calendar-time-input",
                        submitButton: "submit-button"
                      }}
                    timePickerProps={
                      {
                        withDropdown: true,
                        format: '12h',
                        classNames: {
                          input: "calendar-time-input",
                          section: "calendar-time-section",
                          controlsListGroup: "calendar-body",
                          control: "calendar-header-control"
                        }
                      }
                    }
                  />
                  <Button variant="primary" size="sm" onClick={applyDateRange}>Apply Range</Button>
                </Stack>
              </Popover.Dropdown>
            </Popover>




            <Popover trapFocus position="bottom" shadow="md" withOverlay offset={18} overlayProps={{ zIndex: 10000, blur: '4px'}} zIndex={10001}>
              <Popover.Target>
                <Tooltip label="Select Device">
                  <ActionIcon radius="md" variant="outline" color="green" style={{ marginTop: "5px", width: "5%" }}>
                    <IconId />
                  </ActionIcon>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                <NativeSelect
                  label="Devices"
                  radius="md"
                  data={deviceIDs}
                  onChange={(e) => handleDeviceChange(e.target.value)}
                  classNames={{ root: "device-popover-back", label: "device-popover-text", input: "device-popover-input" }}
                />
              </Popover.Dropdown>
            </Popover>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "999px", backgroundColor: "var(--mantine-color-green-6)" }} />
            <Text size="sm">Current</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "999px", backgroundColor: "var(--mantine-color-orange-6)" }} />
            <Text size="sm">Temperature</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "2px", backgroundColor: "rgb(255, 123, 123)" }} />
            <Text size="sm">Inactive</Text>
          </div>
        </div>

        {chartData.length > 0 ? (
          <AreaChart
            h={320}
            w="100%"
            data={chartData}
            dataKey="timestampMs"
            curveType="linear"
            withLegend
            withTooltip
            withXAxis
            withYAxis
            withRightYAxis
            yAxisLabel="Current (A)"
            rightYAxisLabel="Temperature (°C)"
            xAxisProps={{
              type: "number",
              domain: ["dataMin", "dataMax"],
              tickFormatter: (value) => new Date(Number(value)).toLocaleString(),
            }}
            yAxisProps={{
              tickFormatter: (value) => `${value} A`,
            }}
            rightYAxisProps={{
              tickFormatter: (value) => `${value} °C`,
            }}
            tooltipProps={{
              labelFormatter: (value) => new Date(Number(value)).toLocaleString(),
            }}
            valueFormatter={(value) => `${value}`}
            series={[
              { name: "current", label: "Current", color: "green.6" },
              { name: "temperature", label: "Temperature", color: "orange.6", yAxisId: "right" },
            ]}
          >
            {inactiveReferenceAreas.map((area, index) => (
              <ReferenceArea
                key={`${area.x1}-${area.x2}-${index}`}
                x1={area.x1}
                x2={area.x2}
                yAxisId="left"
                fill="rgb(255, 123, 123)"
                strokeOpacity={1}
                label={{
                  position: "insideBottom",
                  fontSize: "min(2vw, 15px)"
                }}
              />
            ))}
          </AreaChart>
        ) : (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Loader size={100} color="rgba(126, 247, 150, 1)" type="dots" />
          </div>
        )}
      </Paper>
    </div>
  );
}
