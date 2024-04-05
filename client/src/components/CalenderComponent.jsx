import { Calendar, Whisper, Popover, Badge, CustomProvider, Tooltip } from "rsuite";
import { useActivityLog } from "../contexts/ActivityLogContext";
import { HOST } from "../config/config";
import { useLoading } from "../contexts/LoadingContext";
import { useRef, useState } from "react";



const holidays = [
  {
      "date": "2024-01-01",
      "title": "New Year's Day"
  },
  {
      "date": "2024-01-26",
      "title": "Republic Day"
  },
  {
      "date": "2024-03-05",
      "title": "Dummy Holiday"
  },
  {
      "date": "2024-03-10",
      "title": "Holi"
  },
  {
      "date": "2024-04-01",
      "title": "April Fools' Day"
  },
  {
      "date": "2024-04-01",
      "title": "April Fools' Day again "
  },
  {
      "date": "2024-04-14",
      "title": "Good Friday"
  },
  {
      "date": "2024-04-21",
      "title": "Dummy Holiday"
  },
  {
      "date": "2024-05-01",
      "title": "May Day"
  },
  {
      "date": "2024-08-15",
      "title": "Independence Day"
  },
  {
      "date": "2024-10-02",
      "title": "Gandhi Jayanti"
  },
  {
      "date": "2024-10-25",
      "title": "Dussehra"
  },
  {
      "date": "2024-11-14",
      "title": "Diwali"
  },
  {
      "date": "2024-12-25",
      "title": "Christmas Day"
  }
]


function formatHolidayDate(dateObj) {
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate();
  
  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;
  
  return `${year}-${month}-${day}`;
}

function getHoliday(date) {
  const formattedDate = formatHolidayDate(date);

  const matchingHolidays = holidays.filter(holiday => holiday.date === formattedDate);

  return matchingHolidays.map(holiday => ({ time: 'All day', title: holiday.title }));
}


export default function CalenderComponent() {
  const {selectedDate, setSelectedDate,setLogs,setDateLogs} = useActivityLog();
  const {fetchWithLoader} = useLoading();

 


  function renderCell(date) {
    const holidayList = getHoliday(date);
    if (holidayList.length) {
      const moreCount = holidayList.length - 1;
      return (
        <ul className="text-xs overflow-hidden  text-center p-0 list-none">
          
            <Whisper
              placement="top"
              trigger="click"
              speaker={<Popover >{holidayList.map((item, index) => (
                              <p key={index}>
                                <b>{item.time}</b> - {item.title}
                              </p>
                            ))}</Popover>}
            >
              <ul className="">
                <li className="truncate"><Badge /> <b>{holidayList[0].time}</b> - {holidayList[0].title}</li>
                {moreCount > 0 && <li className="text-blue-500 hover:underline">{moreCount} more</li>}
              </ul>
            </Whisper>
          
        </ul>
      );
    }
  
    else {
      return null; 
    }
  }
  
  


  async function onDateChange(date){
    setSelectedDate(date);
  }




  return (
    <>
      <CustomProvider theme="dark">
        <Calendar renderCell={renderCell} cellClassName={()=>'hover:bg-[#3c3f43] '} compact  bordered  onChange={onDateChange}  className="h-fit"  />
      </CustomProvider>
    </>
  );
}
