import React, { useState } from "react";
import {
  Modal,
  Tabs,
  Radio,
  RadioGroup,
  DateRangePicker,
  DatePicker,
} from "rsuite";
import { HOST } from "../../../config/config";
import { useAuth } from "../../../contexts/AuthContext";
import { useLoading } from "../../../contexts/LoadingContext";
import AppliedLeaves from "./AppliedLeaves";
import TimePicker from "./TimePicker";

export default function LeavesManager({
  isLeaveManagerOpen,
  setIsLeaveManagerOpen,
}) {
  const [leaveType, setLeaveType] = useState("");
  const [selectedRegularLeaves, setSelectedRegularLeaves] = useState([]);
  const [halfDayDate, setHalfDayDate] = useState(null);
  const [startTime, setStartTime] = useState({
    hrs: 12,
    mins: 0,
    period: "AM",
  });
  const [endTime, setEndTime] = useState({ hrs: 12, mins: 0, period: "AM" });
  const [appliedLeaves, setAppliedLeaves] = useState(null);
  const { user } = useAuth();
  const { showSuccess, showAlert,fetchWithLoader, } = useLoading();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (leaveType === "regular") {
      console.log(selectedRegularLeaves);

      if (selectedRegularLeaves.length > 1) {
        try {
          const res = await fetchWithLoader(`${HOST}/leave`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              managerId: user?.managerId,
              leavetype: leaveType,
              startDate: selectedRegularLeaves[0],
              endDate: selectedRegularLeaves[1],
            }),
          });

          const data = await res.json();
          if (data.success) {
            showSuccess(data.message);
            setSelectedRegularLeaves([]);
            setAppliedLeaves((prevLeaves) => [...prevLeaves, data.leave]);
          }
        } catch (error) {
          console.error(error);
        }
      }
    } else if (leaveType === "halfDay") {
      if (!halfDayDate || !startTime.period || !endTime.period) {
        showAlert("All Fields are necessary.");
        return;
      }

      const selectedDate = halfDayDate;

      let startDate = new Date(selectedDate);
      startDate.setHours(
        startTime.period === "AM"
          ? startTime.hrs % 12
          : (startTime.hrs % 12) + 12,
        startTime.mins
      );
      let endDate = new Date(selectedDate);
      endDate.setHours(
        endTime.period === "AM" ? endTime.hrs % 12 : (endTime.hrs % 12) + 12,
        endTime.mins
      );

      if ((endDate - startDate) / 60000 < 60) {
        showAlert("Duration Should be more than an Hour.");
        return;
      }

      try {
        const res = await fetchWithLoader(`${HOST}/leave`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            managerId: user?.managerId,
            leavetype: leaveType,
            startDate,
            endDate,
          }),
        });

        const data = await res.json();
        if (data.success) {
          showSuccess(data.message);
          setHalfDayDate(null);
          setStartTime({ hrs: 12, mins: 0, period: "AM" });
          setEndTime({ hrs: 12, mins: 0, period: "AM" });
          setAppliedLeaves((prevLeaves) => [...prevLeaves, data.leave]);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const { beforeToday } = DateRangePicker;

  return (
    <>
      <Modal
        open={isLeaveManagerOpen}
        onClose={() => setIsLeaveManagerOpen(false)}
      >
        <Modal.Header>
          <Modal.Title>Leaves</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs defaultActiveKey="applyForLeaves">
            <Tabs.Tab eventKey="applyForLeaves" title="Apply for Leave">
              <form onSubmit={handleSubmit} className="flex flex-col w-full ">
                <div className="py-3 w-full  mx-auto">
                  <RadioGroup
                    name="radio-group-controlled"
                    inline={true}
                    value={leaveType}
                    onChange={setLeaveType}
                  >
                    <Radio value="regular">Regular Leave</Radio>
                    <Radio value="halfDay">Half-Day Leave</Radio>
                  </RadioGroup>
                </div>
                {leaveType === "regular" && (
                  <div>
                    <label htmlFor="datePicker">Select Date(s): </label>
                    <DateRangePicker
                      id="datePicker"
                      showOneCalendar
                      format="dd.MM.yyyy"
                      shouldDisableDate={beforeToday()}
                      value={selectedRegularLeaves}
                      onChange={setSelectedRegularLeaves}
                      size="sm"
                    />
                    <p className="text-xs mt-1">
                      * Click the date twice if only one day leave is required.
                    </p>
                  </div>
                )}
                {leaveType === "halfDay" && (
                  <div className="flex flex-col space-y-1">
                    <label>
                      Date:
                      <DatePicker
                        className="ml-2"
                        format="dd.MM.yyyy"
                        value={halfDayDate}
                        onChange={setHalfDayDate}
                      />
                    </label>
                    <div>
                      <TimePicker time={startTime} setTime={setStartTime} />
                      <TimePicker time={endTime} setTime={setEndTime} />
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  className="py-1 px-2 mt-4  w-fit border border-orange-400 text-orange-400 rounded-md hover:border-orange-600"
                >
                  Submit
                </button>
              </form>
            </Tabs.Tab>
            <Tabs.Tab eventKey="leavesApplied" title="Leaves Applied">
              <AppliedLeaves
                appliedLeaves={appliedLeaves}
                setAppliedLeaves={setAppliedLeaves}
              />
            </Tabs.Tab>
          </Tabs>
        </Modal.Body>
      </Modal>
    </>
  );
}
