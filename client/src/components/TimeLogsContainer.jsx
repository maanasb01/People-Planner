
import { useActivityLog } from "../contexts/ActivityLogContext";



export default function TimeLogsContainer() {
  const { selectedDate, setSelectedDate,selectedDayWork } = useActivityLog();
  const { logs } = useActivityLog();

  const days = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
  ];
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
    
      <div className=" flex flex-col space-y-3 items-center  xl:w-2/6 border h-2/4 xl:h-3/4 mt-6 rounded-2xl mx-4  xl:overflow-hidden">
        <p className="text-xl mt-4">
        Time Logs for: 
          <span className="text-orange-300"> {days[selectedDate.getDay()]} {selectedDate.getDate()} {months[selectedDate.getMonth()]} {selectedDate.getFullYear()}</span>
        </p>
        <div className="w-full flex h-full overflow-y-auto">
          <ul className="mx-auto text-lg">
            {logs.length ? (
              logs.map((log) => {
                return (
                  <li key={log.id} className="hover:bg-slate-300 hover:text-black cursor-pointer px-2 py-1 rounded-lg">
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
        <div>
            <p className="text-base flex space-x-2 "><span className="font-bold mb-2">Total Work : </span> <span className="text-amber-300"> {selectedDayWork.hours} Hrs {selectedDayWork.minutes} Mins</span></p>

        </div>
      </div>

  );
}
