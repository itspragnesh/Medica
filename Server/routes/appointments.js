const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const mongoose = require('mongoose');

// Authentication middleware
const authMiddleware = (req, res, next) => {
  if (!req.session.user || !req.session.user._id) {
    return res.status(401).json({ success: false, message: 'Unauthorized, please log in', redirectTo: '/login' });
  }
  req.user = req.session.user;
  next();
};

// Valid time slots
const validTimeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM',
  '02:00 PM', '03:00 PM', '04:00 PM',
];

// POST /api/appointments - Book an appointment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    // Validate input
    if (!doctorId || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields: doctorId, date, and time are required' });
    }

    // Validate doctorId format
    if (!mongoose.Types.ObjectId.isValid(doctorId)) {
      return res.status(400).json({ message: 'Invalid doctor ID format' });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // Validate time slot
    if (!validTimeSlots.includes(time)) {
      return res.status(400).json({ message: 'Invalid time slot' });
    }

    // Validate date (no past dates)
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      return res.status(400).json({ message: 'Cannot book appointments in the past' });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found. Please select a valid doctor.' });
    }

    // Check for double-booking
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: appointmentDate.toISOString().split('T')[0],
      time,
      status: { $ne: 'Cancelled' },
    });
    if (existingAppointment) {
      return res.status(400).json({ message: 'Doctor is already booked at this time' });
    }

    // Create appointment
    const appointment = new Appointment({
      userId: req.user._id,
      doctorId,
      date: appointmentDate,
      time,
      status: 'Scheduled',
    });

    await appointment.save();

    // Populate doctor details
    const populatedAppointment = await Appointment.findById(appointment._id).populate('doctorId');
    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/appointments - Get user's appointments
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const appointments = await Appointment.find({ userId: req.user._id, status: { $ne: 'Cancelled' } }).populate('doctorId');
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/appointments/:id/cancel - Cancel an appointment
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate appointment ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid appointment ID format' });
    }

    // Find appointment and verify ownership
    const appointment = await Appointment.findOne({ _id: id, userId: req.user._id });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found or not authorized' });
    }

    // Check if already cancelled
    if (appointment.status === 'Cancelled') {
      return res.status(400).json({ message: 'Appointment is already cancelled' });
    }

    // Update status
    appointment.status = 'Cancelled';
    await appointment.save();

    // Populate doctor details
    const populatedAppointment = await Appointment.findById(id).populate('doctorId');
    res.status(200).json({ success: true, message: 'Appointment cancelled', appointment: populatedAppointment });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;