import { useEffect, useState } from "react";
import { useActivityLog } from "../contexts/ActivityLogContext";
import { useLoading } from "../contexts/LoadingContext";
import { HOST } from "../config/config";
import { useAuth } from "../contexts/AuthContext";

export default function LogButtons() {
  const { selectedDate, setSelectedDate, setDateLogs } = useActivityLog();
  const [showLogButtons, setShowLogButtons] = useState(false);
  const { fetchWithLoader } = useLoading();
  const { user, setUser } = useAuth();

  useEffect(() => {
    setShowLogButtons(isSelectedDateToday());
  }, [selectedDate]);

  function isSelectedDateToday() {
    const today = new Date();
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    );
  }

  async function setLogin() {
    try {
      const res = await fetchWithLoader(`${HOST}/timelog/intime`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: new Date(), timeIn: new Date() }),
      });

      const data = await res.json();
      if (data.data?.user) {
        setUser(data.data.user);
        setDateLogs((prevLogs) => {
          const updatedLogs = [...prevLogs, data.data.activityLog];
          return updatedLogs;
        });
      }
    } catch (error) {
      console.error(error.message);
    }
  }
  async function setLogout() {
    try {
      const res = await fetchWithLoader(`${HOST}/timelog/outtime`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: new Date(), timeOut: new Date() }),
      });

      const data = await res?.json();
      if (data?.data?.user) {
        setUser(data.data.user);
        setDateLogs((prevLogs) => {
          if (prevLogs.length === 0) {
            // If there are no previous logs, just push the current log (For the multiple days logout when there is no entry of current day and user is logging out)
            return [data.data.activityLog];
          } else {
            const updatedLogs = [...prevLogs.slice(0, -1), data.data.activityLog];
            return updatedLogs;
          }
        });
      }
    } catch (error) {
      console.error("From Error:", error.message);
    }
  }
  return (
    <div className="flex space-x-2 w-fit ml-auto mr-4">
      <button
        onClick={setLogin}
        disabled={!showLogButtons}
        className="disabled:border-gray-500 disabled:text-gray-600 disabled:cursor-default px-2 py-1 border border-green-400 text-green-500 hover:border-green-300 hover:text-green-300"
      >
        Login
      </button>
      <button
        onClick={setLogout}
        disabled={!showLogButtons}
        className="disabled:border-gray-500 disabled:text-gray-600 disabled:cursor-default px-2 py-1 border border-red-400 text-red-500 hover:border-red-300 hover:text-red-300"
      >
        Log Out
      </button>
    </div>
  );
}
