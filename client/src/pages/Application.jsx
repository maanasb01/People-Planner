import { useEffect, useState } from "react";
import CalenderComponent from "../components/CalenderComponent";
import Sidebar from "../components/Sidebar";
import {
  ActivityLogProvider,
} from "../contexts/ActivityLogContext";
import LogButtons from "../components/LogButtons";
import TimeLogsContainer from "../components/TimeLogsContainer";

export default function Application() {
  return (
    <ActivityLogProvider>
      <div className="flex flex-col">
        <header className="font-sans font-bold text-2xl ml-auto mr-5">
          People Planner
        </header>
          <Sidebar />
        <div className="flex flex-col xl:flex-row  h-screen">
          <div></div>
          <div className="xl:ml-7 mt-4 w-4/6 mx-auto ">
            <CalenderComponent />
            <LogButtons />
          </div>
          <TimeLogsContainer />
        </div>
      </div>
    </ActivityLogProvider>
  );
}
