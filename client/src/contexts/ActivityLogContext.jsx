import { createContext, useContext, useEffect, useState } from "react";
import { useLoading } from "./LoadingContext";
import { HOST } from "../config/config";

const ActivityLogContext = createContext();

export const useActivityLog = () => {
  return useContext(ActivityLogContext);
};

export const ActivityLogProvider = ({ children }) => {
  // Logs to Display
  // Would conatin array of dates objects from backend
  const [dateLogs, setDateLogs] = useState([]);
  // Time logs
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [works,setWorks] =useState({
    today:{hours:"00",minutes:"00"},
    week:{hours:"00",minutes:"00"},
    month:{hours:"00",minutes:"00"},
    quarter:{hours:"00",minutes:"00"},
  })
  const { fetchWithLoader } = useLoading();

  useEffect(() => {
    async function setDate() {
      const res = await fetchWithLoader(
        `${HOST}/timelog/alllogs/${selectedDate}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const fetchedDateLogs = await res.json();
      setDateLogs(fetchedDateLogs.data.logs);
      const hoursWorkedToday = calculateTodayWorkTime(fetchedDateLogs.data.logs);
      setWorks(prevWorks=> ({...prevWorks,today:hoursWorkedToday}));
      setAllWorks(fetchedDateLogs.data);

    }
    setDate();
  }, [selectedDate]);

  useEffect(() => {
    const timeLogs = dateLogs?.map((timeStamp) => {
      const loginDate = new Date(timeStamp.login);
      const logoutDate = timeStamp.logout ? new Date(timeStamp.logout) : null;

      return {
        id: timeStamp._id,
        timeIn: `${paddedNum(loginDate.getHours())} : ${paddedNum(
          loginDate.getMinutes()
        )}`,
        timeOut: logoutDate
          ? `${paddedNum(logoutDate.getHours())} : ${paddedNum(
              logoutDate.getMinutes()
            )}`
          : "---",
      };
    });
    setLogs(timeLogs);

  }, [dateLogs]);

  function paddedNum(n) {
    return String(n).padStart(2, "0");
  }

  // Set the Week, Month and Quarter works
  function setAllWorks(data){
    setWorks(prevWorks=>{

      return {
        ...prevWorks,
        week:{hours:paddedNum(data.totalWorkDoneWeek.totalHours),minutes:paddedNum(data.totalWorkDoneWeek.totalMinutes)},
        month:{hours:paddedNum(data.totalWorkDoneMonth.totalHours),minutes:paddedNum(data.totalWorkDoneMonth.totalMinutes)},
        quarter:{hours:paddedNum(data.totalWorkDoneQuarter.totalHours),minutes:paddedNum(data.totalWorkDoneQuarter.totalMinutes)}
      }

    })
  }

  function calculateTodayWorkTime(activities) {
    const totalMilliseconds = activities.reduce((total, activity) => {
      if (activity.login && activity.logout) {
        const loginTime = new Date(activity.login).getTime();
        const logoutTime = new Date(activity.logout).getTime();
        const timeDifference = logoutTime - loginTime;

        return total + timeDifference;
      }
      return total;
    }, 0);

    const totalHours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const remainingMilliseconds = totalMilliseconds % (1000 * 60 * 60);
    const totalMinutes = Math.round(remainingMilliseconds / (1000 * 60));

    return { hours: paddedNum(totalHours), minutes: paddedNum(totalMinutes) };
  }

  return (
    <ActivityLogContext.Provider
      value={{
        logs,
        setLogs,
        selectedDate,
        setSelectedDate,
        dateLogs,
        setDateLogs,
        works,
        setWorks
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
};
