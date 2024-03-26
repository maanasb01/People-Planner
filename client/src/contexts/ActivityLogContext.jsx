import { createContext, useContext, useEffect, useState } from "react";
import { useLoading } from "./LoadingContext";
import { HOST } from "../config/config";

const ActivityLogContext = createContext();

export const useActivityLog = () => {
  return useContext(ActivityLogContext);
};

export const ActivityLogProvider = ({ children }) => {
  // Logs to Display
  //Would conatin array of dates objects from backend
  const [dateLogs, setDateLogs] = useState([]);
  // Time logs
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDayWork, setSelectedDayWork] = useState({
    hours: 0,
    minutes: 0,
  });
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
      
      setDateLogs(fetchedDateLogs.data);
      const hoursWorked = calculateTotalWorkTime(fetchedDateLogs.data);
      setSelectedDayWork(hoursWorked);
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
    const hoursWorked = calculateTotalWorkTime(dateLogs);
    setSelectedDayWork(hoursWorked);
  }, [dateLogs]);

  function paddedNum(n) {
    return String(n).padStart(2, "0");
  }

  function calculateTotalWorkTime(activities) {
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
        selectedDayWork,
      }}
    >
      {children}
    </ActivityLogContext.Provider>
  );
};
