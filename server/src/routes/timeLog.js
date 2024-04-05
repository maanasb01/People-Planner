const express = require("express");
const { body, validationResult, param } = require("express-validator");
const ActivityLog = require("../models/ActivityLog");
const router = express.Router();
const tokenAuth = require("../middlewares/tokenAuth");
const User = require("../models/User");
const mongoose = require("mongoose");

router.post(
  "/intime",
  tokenAuth,
  [
    body("date")
      .exists()
      .withMessage("Date Missing")
      .isISO8601()
      .toDate()
      .withMessage("Invalid date format"),
    body("timeIn")
      .exists()
      .withMessage("TimeIn Missing")
      .isISO8601()
      .toDate()
      .withMessage("Invalid TimeIn date format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, timeIn } = req.body;
    const userId = req.user.id;

    const isToday = areSameDay(new Date(), timeIn);

    if (!isToday) {
      return res
        .status(405)
        .json({
          success: false,
          message:
            "You are trying to Login from a different date and not today.",
        });
    }

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await User.findById(userId);

      if (user.isActive === true) {
        return res
          .status(405)
          .json({ success: false, message: "User already Logged In." });
      }

      const activityLogs = await ActivityLog.create(
        [{ userId, date, login: timeIn }],
        { session }
      );

      const activiteLogId = activityLogs[0]._id;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { isActive: true, activeLog: activiteLogId } },
        { session, new: true }
      );

      await session.commitTransaction();

      return res.status(200).json({
        success: true,
        message: "In-Time added successfully",
        data: {
          activityLog: activityLogs[0],
          user: {
            name: updatedUser.name,
            email: updatedUser.email,
            isActive: updatedUser.isActive,
            activeLog: updatedUser.activeLog,
          },
        },
      });
    } catch (error) {
      await session.abortTransaction();
      console.error("Error adding time stamps:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    } finally {
      await session.endSession();
    }
  }
);

function areSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
/**
 *
 * @param {Date} d1
 * @param {Date} d2
 * @returns {number}
 */
function getBetweenDays(date1, date2) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    (d2.setHours(0, 0, 0, 0) - d1.setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
  );
}

router.post(
  "/outtime",
  tokenAuth,
  [
    body("date")
      .exists()
      .withMessage("Date Missing")
      .isISO8601()
      .toDate()
      .withMessage("Invalid date format"),
    body("timeOut")
      .exists()
      .withMessage("TimeOut Missing")
      .isISO8601()
      .toDate()
      .withMessage("Invalid timeOut date format"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { date, timeOut } = req.body;
    const userId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const user = await User.findById(userId);

      if (user.isActive === false) {
        return res.status(405).json({
          success: false,
          message: "TimeOut is not possible for user that is not loggedIn",
        });
      }
      const isToday = areSameDay(new Date(), timeOut);

      if (!isToday) {
        return res
          .status(405)
          .json({
            success: false,
            message:
              "You are trying to Logout from a different date and not today.",
          });
      }
      const activityLog = await ActivityLog.findById(user.activeLog);
      const timeIn = activityLog.login;

      const isLogoutOnSameDay = areSameDay(date, activityLog.date);

      if (isLogoutOnSameDay) {
        if (timeOut <= timeIn || !timeIn) {
          return res.status(400).json({
            success: false,
            message: "TimeOut should be greater than TimeIn",
          });
        } else {
          activityLog.logout = timeOut;
          await activityLog.save();

          user.activeLog = null;
          user.isActive = false;
          await user.save();

          await session.commitTransaction();

          return res.status(200).json({
            success: true,
            message: "Logout time stamp added successfully",
            data: {
              activityLog,
              user: {
                name: user.name,
                email: user.email,
                isActive: user.isActive,
                activeLog: user.activeLog,
              },
            },
          });
        }
      }
      // Login and Logout are in different days.
      else {
        // Should not be the case that timeOut>timeIn but as preventive measure, checking the condition
        if (timeOut >= timeIn) {
          //Saving the first Day
          const firstDayLogout = new Date(timeIn);
          activityLog.logout = firstDayLogout.setHours(23, 59, 59);
          await activityLog.save();

          const betweenDays = getBetweenDays(timeIn, timeOut);

          //If the difference between the dayIn and dayOut is more than 1 day, adding all the between days in the activityLog.
          if (betweenDays > 1 && betweenDays <= 7) {
            let betweenDates = [];

            for (let i = 1; i < betweenDays; i++) {
              let result = new Date(timeIn);
              result.setDate(result.getDate() + i);
              betweenDates.push(result);
            }

            await ActivityLog.create(
              betweenDates.map((d) => {
                let dateInTime = d.setHours(0);
                let dateOutTime = d.setHours(23, 59, 59);
                return {
                  userId,
                  date: dateInTime,
                  login: dateInTime,
                  logout: dateOutTime,
                };
              })
            );
          }
          // Login for the last day (the day user is logging out)
          const newLogin = new Date(timeOut);
          // Last day login at 12 AM and logout at the logout time (provided by the user)
          const nextDayActivityLog = await ActivityLog.create({
            date: newLogin,
            userId: userId,
            login: newLogin.setHours(0),
            logout: timeOut,
          });

          user.activeLog = null;
          user.isActive = false;
          await user.save();

          await session.commitTransaction();

          return res.status(200).json({
            success: true,
            message: `${
              betweenDays > 7
                ? "Logged in for more than 7 days. Between days were not considered. Only first day and this day are considered."
                : "LogOut Time stamp added successfully"
            }`,
            data: {
              activityLog: nextDayActivityLog[0],
              user: {
                name: user.name,
                email: user.email,
                isActive: user.isActive,
                activeLog: user.activeLog,
              },
            },
          });
        }
        // When Timeout < TimeIn
        else {
          return res.status(400).json({
            success: false,
            message: "Something went wrong. Time out is less than Time In",
          });
        }
      }
    } catch (error) {
      console.error("Error adding time stamps:", error);
      await session.abortTransaction();
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    } finally {
      await session.endSession();
    }
  }
);




router.get(
  "/alllogs/:date",
  tokenAuth,
  [
    param("date")
      .exists()
      .withMessage("Date Missing")
      .isISO8601()
      .toDate()
      .withMessage("Invalid Date Format"),
  ],
  async (req, res) => {
    const { date } = req.params;
    try {
      const userId = req.user.id;
      const extractedDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const logs = await ActivityLog.find({
        userId,
        date: {
          $gte: extractedDate, // Greater than or equal to the start of the date
          $lt: new Date(extractedDate.getTime() + 24 * 60 * 60 * 1000), // Less than the start of the next date
        },
      });

    // Calculate start and end dates for the week, month, and quarter
    const startOfWeek = new Date(extractedDate);
    startOfWeek.setDate(extractedDate.getDate() - extractedDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const startOfMonth = new Date(extractedDate.getFullYear(), extractedDate.getMonth(), 1);
    const endOfMonth = new Date(extractedDate.getFullYear(), extractedDate.getMonth() + 1, 0);

    const startOfQuarter = new Date(extractedDate.getFullYear(), Math.floor(extractedDate.getMonth() / 3) * 3, 1);
    const endOfQuarter = new Date(extractedDate.getFullYear(), Math.floor(extractedDate.getMonth() / 3) * 3 + 3, 0);

    // Fetch activity logs within each time frame
    const weekLogs = await ActivityLog.find({
      userId,
      date: {
        $gte: startOfWeek,
        $lt: endOfWeek,
      },
    });

    const monthLogs = await ActivityLog.find({
      userId,
      date: {
        $gte: startOfMonth,
        $lt: endOfMonth,
      },
    });

    const quarterLogs = await ActivityLog.find({
      userId,
      date: {
        $gte: startOfQuarter,
        $lt: endOfQuarter,
      },
    });

    // Calculate total work done for each time frame
    const totalWorkDoneWeek = calculateTotalWork(weekLogs);
    const totalWorkDoneMonth = calculateTotalWork(monthLogs);
    const totalWorkDoneQuarter = calculateTotalWork(quarterLogs);

    return res.status(200).json({
      success: true,
      data: {
        totalWorkDoneWeek,
        totalWorkDoneMonth,
        totalWorkDoneQuarter,
        logs
      },
    });
 }catch (error) {
  return res
    .status(500)
    .json({ success: false, message: "Internal Server Error" });
}

// Helper function to calculate total work done
function calculateTotalWork(logs) {
 let totalWorkDone = 0;
 logs.forEach(log => {
    if (log.logout && log.login) {
      const workDuration = log.logout - log.login;
      totalWorkDone += workDuration;
    }
 });

 const totalHours = Math.floor(totalWorkDone / (1000 * 60 * 60));
 const remainingMilliseconds = totalWorkDone % (1000 * 60 * 60);
 const totalMinutes = Math.round(remainingMilliseconds / (1000 * 60));
 return {totalHours,totalMinutes}
}
  }
);
module.exports = router;
