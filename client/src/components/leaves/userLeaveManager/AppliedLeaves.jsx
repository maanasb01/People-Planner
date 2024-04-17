import React, { useEffect, useState } from "react";
import { DatePicker, Stack, TagPicker } from "rsuite";
import { HOST } from "../../../config/config";
import Leave from "../Leave";
import { formatDate } from "../../../helpers/leaveHelpers";
import { useLoading } from "../../../contexts/LoadingContext";

export default function AppliedLeaves({ appliedLeaves, setAppliedLeaves }) {
  const [selectedMonthYear, setSelectedMonthYear] = useState(new Date());
  const [filterTags, setFilterTags] = useState({ type: [], status: [] });
  const { fetchWithLoader } = useLoading();

  useEffect(() => {
    if (selectedMonthYear !== null) {
      getLeaves();
    } else {
      setAppliedLeaves(null);
    }
  }, [selectedMonthYear]);

  useEffect(() => {
    console.log(filterTags);
  }, [filterTags]);

  async function getLeaves() {
    try {
      const res = await fetchWithLoader(
        `${HOST}/leave/getleaves/${selectedMonthYear.toISOString()}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();

      setAppliedLeaves(data.leaves);
      console.log(data.leaves);
    } catch (error) {
      console.log("Error fetching Applied Leaves", error);
    }
  }

  function filterLeaves(leave) {
    const { type, status } = filterTags;
    return (
      (type.length === 0 || type.includes(leave.leavetype)) &&
      (status.length === 0 || status.includes(leave.status))
    );
  }

  return (
    <div className="h-[20rem] 2xl:h-full overflow-hidden">
      <div className="flex items-center space-x-2 ">
        <label htmlFor="monthYear">Select Month and Year:</label>
        <Stack className="w-28">
          <DatePicker
            format="MM-yyyy"
            onChange={setSelectedMonthYear}
            value={selectedMonthYear}
            id="monthYear"
          />
        </Stack>
      </div>
      <div className="flex flex-col  space-x-2 ">
        <div className="text-lg mx-auto mb-2">
          Leaves For:{" "}
          <span className="font-bold">{formatDate(selectedMonthYear)}</span>
        </div>
        <div className="flex mb-2">
          <TagPicker
            onChange={(state) =>
              setFilterTags((prevTags) => ({ ...prevTags, type: state }))
            }
            size="sm"
            placeholder="Leave Type"
            data={[
              { label: "Regular", value: "regular" },
              { label: "Half-Day", value: "halfDay" },
            ]}
            className="w-64"
          />
          <TagPicker
            size="sm"
            placeholder="Status"
            onChange={(state) =>
              setFilterTags((prevTags) => ({ ...prevTags, status: state }))
            }
            data={[
              { label: "Pending", value: "pending" },
              { label: "Approved", value: "approved" },
              { label: "Denied", value: "denied" },
              { label: "Cancelled", value: "cancelled" },
            ]}
            className="w-64"
          />
        </div>

        <div className="h-64 overflow-y-auto pb-9">
          <ul className="flex flex-col space-y-3 ">
            {appliedLeaves &&
            appliedLeaves.filter(filterLeaves).length !== 0 ? (
              appliedLeaves.filter(filterLeaves).map((leave) => {
                return (
                  <li key={leave._id}>
                    <Leave
                      status={leave.status}
                      leavetype={leave.leavetype}
                      startDate={leave.startDate}
                      endDate={leave.endDate}
                      id={leave._id}
                      leaves={appliedLeaves}
                      setLeaves={setAppliedLeaves}
                    />
                  </li>
                );
              })
            ) : (
              <p className="mx-auto"> No Leaves to Display</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
