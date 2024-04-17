import { InputNumber, Stack, SelectPicker } from "rsuite";

export default function TimePicker({ time, setTime }) {
  const { hrs, mins, period } = time;

  const handleHourChange = (value) => {
    setTime((prevTime) => ({
      ...prevTime,
      hrs: value,
    }));
  };

  const handleMinuteChange = (value) => {
    setTime((prevTime) => ({
      ...prevTime,
      mins: value,
    }));
  };

  const handlePeriodChange = (value) => {
    setTime((prevTime) => ({
      ...prevTime,
      period: value,
    }));
  };

  const formatMinutes = (value) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <Stack className="w-fit flex">
      Start Time:
      <Stack.Item className="w-20">
        <InputNumber
          value={hrs}
          max={12}
          min={1}
          size="sm"
          className="w-4"
          onChange={handleHourChange}
        />
      </Stack.Item>
      <span className="mx-2 font-bold">:</span>
      <Stack.Item className="w-20">
        <InputNumber
          value={mins}
          max={59}
          min={0}
          size="sm"
          className="w-4"
          formatter={formatMinutes}
          onChange={handleMinuteChange}
        />
      </Stack.Item>
      <Stack.Item className="">
        <SelectPicker
          value={period}
          data={[
            { label: "AM", value: "AM" },
            { label: "PM", value: "PM" },
          ]}
          searchable={false}
          onChange={handlePeriodChange}
        />
      </Stack.Item>
    </Stack>
  );
}
