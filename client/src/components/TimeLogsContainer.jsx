import { useActivityLog } from "../contexts/ActivityLogContext";

export default function TimeLogsContainer() {
  const { selectedDate, works } = useActivityLog();
  const { logs } = useActivityLog();

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    <div className=" flex flex-col space-y-3 items-center min-h-64  h-2/4 xl:h-3/4 border  mt-6 rounded-2xl   xl:overflow-hidden">
      <p className="text-xl mt-4">
        Time Logs for:
        <span className="text-orange-300">
          {" "}
          {days[selectedDate.getDay()]} {selectedDate.getDate()}{" "}
          {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </span>
      </p>
      <div className="w-full flex h-full overflow-y-auto">
        <ul className="mx-auto text-lg">
          {logs.length ? (
            logs.map((log) => {
              return (
                <li
                  key={log.id}
                  className="hover:bg-slate-300 hover:text-black cursor-pointer px-2 py-1 rounded-lg"
                >
                  <b>LogIn: </b>
                  {log.timeIn} <b className="ml-3">LogOut: </b>
                  {log.timeOut}
                </li>
              );
            })
          ) : (
            <p>No Time Logs Found</p>
          )}
        </ul>
      </div>
      <div className="px-1 py-1 flex space-x-2">
        <span>
          <span className="font-semibold text-orange-400">Today :</span>{" "}
          {works.today.hours} : {works.today.minutes}
        </span>
        <span>
          <span className="font-semibold text-orange-400">Week :</span>{" "}
          {works.week.hours} : {works.week.minutes}
        </span>
        <span>
          <span className="font-semibold text-orange-400">Mon :</span>{" "}
          {works.month.hours} : {works.month.minutes}
        </span>
        <span>
          <span className="font-semibold text-orange-400">Quat :</span>{" "}
          {works.quarter.hours} : {works.quarter.minutes}
        </span>
      </div>
    </div>
  );
}
