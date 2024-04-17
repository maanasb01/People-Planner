import { useLoading } from "../../contexts/LoadingContext";
import { formatDate } from "../../helpers/leaveHelpers";

export function LeaveEntry({ title, value, isManagerModal }) {
  let valStyle = "";
  if (value === "pending") {
    valStyle = "text-yellow-400";
  } else if (value === "cancelled") {
    valStyle = "text-gray-400";
  } else if (value === "denied") {
    valStyle = "text-red-500";
  } else if (value === "approved") {
    valStyle = "text-green-500";
  } else if (value === "Regular") {
    valStyle = "text-blue-500";
  } else if (value === "Half-Day") {
    valStyle = "text-violet-500";
  }
  return (
    <span className="truncate border-r pr-2 flex flex-col items-center last-of-type:border-none ">
      <span
        className={`truncate ${
          isManagerModal ? "text-sm" : "text-base"
        } font-semibold text-orange-500`}
      >
        {title}{" "}
      </span>
      <span className={`   ${valStyle}`}>{value}</span>
    </span>
  );
}
// The leave component which renders a leave. The isManagerModal property is a boolean property which would be set to true if
// the leaves have to be rendered inside the manager's Requested leaves section (to manage employees requested leaves).
// isProcessedSection is also a boolean value passed by the ManagerLeaveManager component. It decides whether the current section is of processed leaves or not
export default function Leave({
  leavetype,
  status,
  startDate,
  endDate,
  id,
  leaves,
  setLeaves,
  userName = null,
  isManagerModal = false,
  isProcessedSection = false,
  manageRequestedLeave,
}) {
  const { showAlert, showSuccess } = useLoading();

  async function cancelLeave() {
    try {
      const res = await fetch(`${HOST}/leave/${id}/cancel`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data?.success) {
        setLeaves((leaves) => {
          return leaves.map((leave) => {
            if (leave._id === id) {
              leave.status = "cancelled";
            }
            return leave;
          });
        });
        showSuccess("Applied Leave Cancelled Successfully.");
      } else {
        showAlert("Something went wrong while cancelling the Leave.");
      }
    } catch (error) {
      console.error(error);
      showAlert("Something went wrong while cancelling the Leave.");
    }
  }

  const denyBtn = (
    <button
      onClick={() => manageRequestedLeave(id, "denied")}
      className="w-14 border px-1 py-1 border-red-600 text-red-600 hover:border-red-500 hover:text-red-500 "
    >
      Deny
    </button>
  );
  const approveBtn = (
    <button
      onClick={() => manageRequestedLeave(id, "approved")}
      className="w-14 border px-1 py-1 border-green-600 text-green-600 hover:border-green-500 hover:text-green-500"
    >
      Approve
    </button>
  );
  return (
    <div
      className={`flex space-x-2 items-center justify-between mr-4 w-full ${
        isManagerModal ? "text-xs" : ""
      }`}
    >
      <div
        className={`flex grow space-x-2 item-center  w-fit py-2 px-3  pl-1  mr-1 rounded-md border-slate-800 bg-slate-600 hover:bg-slate-700 cursor-pointer`}
      >
        {isManagerModal && (
          <LeaveEntry
            title={"From"}
            value={userName}
            isManagerModal={isManagerModal}
          />
        )}

        {leavetype === "halfDay" ? (
          <>
            <LeaveEntry
              title={"Leave Type"}
              value={"Half-Day"}
              isManagerModal={isManagerModal}
            />
            <LeaveEntry
              title={"Date"}
              value={formatDate(startDate, "getFullDay")}
              isManagerModal={isManagerModal}
            />
            <LeaveEntry
              title={"From"}
              value={formatDate(startDate, "getTime")}
              isManagerModal={isManagerModal}
            />
            <LeaveEntry
              title={"Till"}
              value={formatDate(endDate, "getTime")}
              isManagerModal={isManagerModal}
            />
            <LeaveEntry
              title={"Status"}
              value={status}
              isManagerModal={isManagerModal}
            />
          </>
        ) : (
          <>
            <LeaveEntry
              title={"Leave Type"}
              value={"Regular"}
              isManagerModal={isManagerModal}
            />
            <LeaveEntry
              title={"Start Date"}
              value={formatDate(startDate, "getFullDay")}
              isManagerModal={isManagerModal}
            />
            <LeaveEntry
              title={"End Date"}
              value={formatDate(endDate, "getFullDay")}
              isManagerModal={isManagerModal}
            />
            <LeaveEntry
              title={"Status"}
              value={status}
              isManagerModal={isManagerModal}
            />
          </>
        )}
      </div>
      {!isManagerModal ? (
        <button
          onClick={cancelLeave}
          className={`ml-auto border px-4 h-10 rounded-md text-red-500 border-red-600 hover:text-red-200 hover:bg-red-400 ${
            status !== "pending" && "invisible"
          }`}
        >
          Cancel
        </button>
      ) : // Only show these buttons inside manager's leave manager when the section is leaves to process
      !isProcessedSection ? (
        <div className="flex space-x-1 px-1">
          {approveBtn}
          {denyBtn}
        </div>
      ) : (
        <div
          className={`flex w-20 ${
            status !== "approved" && status !== "denied" ? "invisible" : ""
          }`}
        >
          {status === "approved" &&
            new Date(startDate) >= new Date() &&
            denyBtn}
          {status === "denied" &&
            new Date(startDate) >= new Date() &&
            approveBtn}
        </div>
      )}
    </div>
  );
}
