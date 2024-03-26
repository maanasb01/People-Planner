import { Calendar, Whisper, Popover, Badge, CustomProvider } from "rsuite";
import { useActivityLog } from "../contexts/ActivityLogContext";
import { HOST } from "../config/config";
import { useLoading } from "../contexts/LoadingContext";

export default function CalenderComponent() {
  const {selectedDate, setSelectedDate,setLogs,setDateLogs} = useActivityLog();
  const {fetchWithLoader} = useLoading();


  async function onDateChange(date){
    setSelectedDate(date);
  }




  return (
    <>
      <CustomProvider theme="dark">
        <Calendar bordered compact onChange={onDateChange}  className=""  />
      </CustomProvider>
    </>
  );
}
