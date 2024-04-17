import { Calendar, Whisper, Popover, Badge, CustomProvider } from "rsuite";
import { useActivityLog } from "../contexts/ActivityLogContext";
import { dummyHolidays } from "../config/dummyHolidays";

function formatHolidayDate(dateObj) {
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate();

  month = month < 10 ? "0" + month : month;
  day = day < 10 ? "0" + day : day;

  return `${year}-${month}-${day}`;
}

function getHoliday(date) {
  const formattedDate = formatHolidayDate(date);

  const matchingHolidays = dummyHolidays.filter(
    (holiday) => holiday.date === formattedDate
  );

  return matchingHolidays.map((holiday) => ({
    time: "All day",
    title: holiday.title,
  }));
}

export default function CalenderComponent() {
  const { setSelectedDate } = useActivityLog();

  function renderCell(date) {
    const holidayList = getHoliday(date);
    if (holidayList.length) {
      const moreCount = holidayList.length - 1;
      return (
        <ul className="text-xs overflow-hidden  text-center p-0 list-none">
          <Whisper
            placement="top"
            trigger="click"
            speaker={
              <Popover>
                {holidayList.map((item, index) => (
                  <p key={index}>
                    <b>{item.time}</b> - {item.title}
                  </p>
                ))}
              </Popover>
            }
          >
            <ul className="">
              <li className="truncate">
                <Badge /> <b>{holidayList[0].time}</b> - {holidayList[0].title}
              </li>
              {moreCount > 0 && (
                <li className="text-blue-500 hover:underline">
                  {moreCount} more
                </li>
              )}
            </ul>
          </Whisper>
        </ul>
      );
    } else {
      return null;
    }
  }

  async function onDateChange(date) {
    setSelectedDate(date);
  }

  return (
    <>
      <CustomProvider theme="dark">
        <Calendar
          renderCell={renderCell}
          cellClassName={() => "hover:bg-[#3c3f43] "}
          compact
          bordered
          onChange={onDateChange}
          className="h-fit"
        />
      </CustomProvider>
    </>
  );
}
