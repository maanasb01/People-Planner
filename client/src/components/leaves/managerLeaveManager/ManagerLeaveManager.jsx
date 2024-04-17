import React, { useEffect, useState } from "react";
import { Modal, Radio, RadioGroup } from "rsuite";
import { HOST } from "../../../config/config";
import Leave from "../Leave";
import { useLoading } from "../../../contexts/LoadingContext";

export default function ManagerLeaveManager({
  isManagerModalOpen,
  setIsManagerModalOpen,
}) {
  const [displayedLeavesType, setDisplayedLeavesType] = useState("toProcess");
  const { showSuccess, showAlert,fetchWithLoader } = useLoading();
  const [leaves, setLeaves] = useState(null);

  useEffect(() => {
    getReqLeaves();
  }, []);

  async function getReqLeaves() {
    try {
      const res = await fetchWithLoader(`${HOST}/leave/getrequestedleaves`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();
      if (data?.success) {
        setLeaves(data.leaves);
      } else {
        showAlert("Something went wrong while fetching the requested leaves.");
      }
    } catch (error) {
      console.log(error);
      showAlert("Something went wrong while fetching the requested leaves.");
    }
  }

  // Status here is what the status should be set.
  async function manageRequestedLeave(leaveId, status) {
    try {
      const req = await fetchWithLoader(`${HOST}/leave/${leaveId}/manage`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await req.json();
      if (data?.success) {
        setLeaves((prevLeaves) => {
          return prevLeaves.map((leave) => {
            if (leave._id === leaveId) {
              leave.status = status;
            }
            return leave;
          });
        });
        showSuccess("Requested Leave Processed Successfully!");
      } else {
        showAlert("Some Error Occured While Processing the Requested leave.");
      }
    } catch (error) {
      console.log("Error Occured While Managing Leave: ", error);
      showAlert("Some Error Occured While Processing the Requested leave.");
    }
  }

  return (
    <>
      <Modal
        open={isManagerModalOpen}
        onClose={() => setIsManagerModalOpen(false)}
      >
        <Modal.Header>
          <Modal.Title className="pb-2">Manage Requested Leaves</Modal.Title>
        </Modal.Header>
        <Modal.Body className="flex flex-col ">
          <RadioGroup
            name="radio-group-controlled"
            inline={true}
            value={displayedLeavesType}
            onChange={setDisplayedLeavesType}
          >
            <Radio value="toProcess">Leaves to Process</Radio>
            <Radio value="processed">Processed Leaves</Radio>
          </RadioGroup>

          <div className="flex  h-[80vh] overflow-y-auto">
            <ul className="flex flex-col space-y-2 w-full">
              {leaves &&
                leaves.length !== 0 &&
                leaves
                  .filter((leave) => {
                    if (displayedLeavesType === "processed") {
                      return leave.status !== "pending";
                    } else {
                      return leave.status === "pending";
                    }
                  })
                  .map((leave) => {
                    return (
                      <li key={leave._id}>
                        <Leave
                          status={leave.status}
                          leavetype={leave.leavetype}
                          startDate={leave.startDate}
                          endDate={leave.endDate}
                          id={leave._id}
                          leaves={leaves}
                          setLeaves={setLeaves}
                          isManagerModal={true}
                          isProcessedSection={
                            displayedLeavesType === "processed"
                          }
                          userName={leave.userName ? leave.userName : "User"}
                          manageRequestedLeave={manageRequestedLeave}
                        />
                      </li>
                    );
                  })}
            </ul>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
