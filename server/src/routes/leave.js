const express = require("express");
const { body, validationResult, param } = require("express-validator");
const User = require("../models/User");
const tokenAuth = require("../middlewares/tokenAuth");
const mongoose = require("mongoose");
const Leave = require("../models/Leave");
const router = express.Router();

// Create a Leave
router.post(
    '/',
    tokenAuth, // Middleware to authenticate token
    [
      // Validation using express-validator
  
      body('managerId').isMongoId().withMessage('Manager ID must be a valid MongoDB ID'),
      body('leavetype').notEmpty().withMessage('Leave type is required'),
      body('startDate').isISO8601().toDate().withMessage('Start date must be a valid date in ISO8601 format'),
      body('endDate').isISO8601().toDate().withMessage('End date must be a valid date in ISO8601 format'),
    ],
    async (req, res) => {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const {managerId, leavetype, startDate, endDate} = req.body;
      const user = await User.findById(req.user.id);
  
      try {
        // Create a new leave instance
        const newLeave = new Leave({
          userId:req.user.id,
          managerId,
          leavetype,
          startDate,
          endDate,
          userName:user.name

        });

        await newLeave.save();

        res.status(201).json({success:true, message: 'Leave request posted successfully', leave: newLeave });
      } catch (err) {
        console.error('Error posting leave:', err);
        res.status(500).json({success:false, message: 'Server error' });
      }
    }
  );

  // Route to get Leaves
  // monthYear is a date 
  router.get('/getleaves/:monthYear',tokenAuth, [
    param('monthYear').isISO8601().toDate().withMessage("monthYear should be a valid ISO8601 format")
  ] ,async (req,res)=>{
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.user.id;
    const {monthYear} = req.params;
    const monthStart = new Date(monthYear.getFullYear(),monthYear.getMonth());
    const monthEnd = new Date(monthYear.getFullYear(),monthYear.getMonth()+1);

    try {
      const leaves = await Leave.find({userId,$or:[
        {startDate:{$gte:monthStart,$lt:monthEnd}},
        {endDate:{$gte:monthStart,$lt:monthEnd}}
      ]});

      res.status(200).json({success:true,leaves});
      
    } catch (error) {
      console.error("Error Getting Leaves:",error);
      res.status(500).json({success:false,message:"Internal Server Error"})
      
    }
  })

  // Route for cancelling a leave by the user
router.put(
    '/:leaveId/cancel',
    tokenAuth, 
    async (req, res) => {
      const { leaveId } = req.params;
      
      try {

        const leave = await Leave.findById(leaveId);
  

        if (!leave) {
          return res.status(404).json({ message: 'Leave not found' });
        }
  
        // Check if the user requesting the cancellation is the same as the user who applied for the leave
        if (leave.userId.toString() !== req.user.id) {
          return res.status(403).json({ message: 'Unauthorized to cancel this leave' });
        }
  
   
        if (leave.status === 'cancelled') {
          return res.status(400).json({ message: 'Leave is already cancelled' });
        }
  

        leave.status = 'cancelled';
  

        await leave.save();
  
    
        res.json({success:true, message: 'Leave cancelled successfully', leave });
      } catch (err) {
        console.error('Error cancelling leave:', err);
        res.status(500).json({success:false, message: 'Server error' });
      }
    }
  );

  // Route for getting all the leaves requested to the manager
  router.get('/getrequestedleaves',tokenAuth,async(req,res)=>{
    // This user is manager
    const userId = req.user.id;

    try {

      const user = await User.findById(userId);

      if(user.role!=="manager" || user===null){
        res.status(403).json({success:false,message:"Unauthorized to get the Data."});
      }

      const requestedLeaves = await Leave.find({managerId:userId});

      res.status(200).json({success:true,message:"Found Requested Leaves Successfully",leaves:requestedLeaves});
      
    } catch (err) {
      console.error('Error while getting requested leaves:', err);
        res.status(500).json({success:false, message: 'Server error' });
      
    }
  })
  
  // Route for approving or denying a leave by the manager
  router.put(
    '/:leaveId/manage',
    tokenAuth,
    async (req, res) => {
      const { leaveId } = req.params;
      const { status } = req.body;
  
      try {
   
        const leave = await Leave.findById(leaveId);

        if (!leave) {
          return res.status(404).json({success:false, message: 'Leave not found' });
        }
  
        // Check if the user requesting the approval/denial is the manager of the leave applicant
        if (leave.managerId.toString() !== req.user.id) {
          return res.status(403).json({success:false, message: 'Unauthorized to approve/deny this leave' });
        }
  
        leave.status = status;

        await leave.save();
  

        res.json({success:true, message: 'Leave status updated successfully', leave });
      } catch (err) {
        console.error('Error updating leave status:', err);
        res.status(500).json({success:false, message: 'Server error' });
      }
    }
  );
  
  
  module.exports = router;