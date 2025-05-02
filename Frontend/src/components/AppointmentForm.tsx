import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Paper,
  Alert,
  Snackbar,
  Container,
  IconButton,
  Divider,
  Stepper,
  Step,
  StepLabel,
  SelectChangeEvent,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';

interface AppointmentFormProps {
  fullPage: boolean;
  onClose: () => void;
}

// Sample specialist data
const specialists = [
  { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', availableDays: [1, 3, 5] },
  { id: 2, name: 'Dr. Michael Chen', specialty: 'Dermatology', availableDays: [2, 4] },
  { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Neurology', availableDays: [1, 2, 5] },
  { id: 4, name: 'Dr. David Kim', specialty: 'Orthopedics', availableDays: [3, 4, 5] },
  { id: 5, name: 'Dr. Lisa Patel', specialty: 'Pediatrics', availableDays: [1, 2, 3, 4, 5] },
];

// Group by specialty
const specialties = [...new Set(specialists.map(s => s.specialty))];

// Sample time slots
const generateTimeSlots = () => {
  const slots = [];
  let hour = 9;
  let minute = 0;
  
  while (hour < 17) {
    slots.push(`${hour}:${minute === 0 ? '00' : minute}`);
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour += 1;
    }
  }
  
  return slots;
};

const timeSlots = generateTimeSlots();

const AppointmentForm = ({ fullPage, onClose }: AppointmentFormProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [specialty, setSpecialty] = useState('');
  const [doctor, setDoctor] = useState('');
  const [appointmentDate, setAppointmentDate] = useState<Date | null>(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [insuranceProvider, setInsuranceProvider] = useState('');
  const [insuranceNumber, setInsuranceNumber] = useState('');
  const [success, setSuccess] = useState(false);
  const [insuranceType, setInsuranceType] = useState('private');

  // Form validation
  const [errors, setErrors] = useState({
    specialty: false,
    doctor: false,
    appointmentDate: false,
    timeSlot: false,
    reason: false,
    name: false,
    email: false,
    phone: false,
  });

  const validateStep = (step: number) => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (step === 0) {
      if (!specialty) {
        newErrors.specialty = true;
        isValid = false;
      } else {
        newErrors.specialty = false;
      }
      
      if (!doctor) {
        newErrors.doctor = true;
        isValid = false;
      } else {
        newErrors.doctor = false;
      }
    } else if (step === 1) {
      if (!appointmentDate) {
        newErrors.appointmentDate = true;
        isValid = false;
      } else {
        newErrors.appointmentDate = false;
      }
      
      if (!timeSlot) {
        newErrors.timeSlot = true;
        isValid = false;
      } else {
        newErrors.timeSlot = false;
      }
      
      if (!reason || reason.length < 10) {
        newErrors.reason = true;
        isValid = false;
      } else {
        newErrors.reason = false;
      }
    } else if (step === 2) {
      if (!name) {
        newErrors.name = true;
        isValid = false;
      } else {
        newErrors.name = false;
      }
      
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        newErrors.email = true;
        isValid = false;
      } else {
        newErrors.email = false;
      }
      
      if (!phone || phone.length < 10) {
        newErrors.phone = true;
        isValid = false;
      } else {
        newErrors.phone = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSpecialtyChange = (event: SelectChangeEvent) => {
    setSpecialty(event.target.value);
    setDoctor(''); // Reset doctor when specialty changes
  };

  const handleDoctorChange = (event: SelectChangeEvent) => {
    setDoctor(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateStep(activeStep)) {
      // Submit form logic would go here
      console.log({
        specialty,
        doctor,
        appointmentDate,
        timeSlot,
        reason,
        name,
        email,
        phone,
        insuranceProvider,
        insuranceNumber,
        insuranceType
      });
      
      setSuccess(true);
      // Reset form after submission
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    }
  };

  const steps = ['Select Specialist', 'Choose Time & Date', 'Patient Information', 'Confirmation'];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ 
        height: fullPage ? '100%' : 'auto', 
        display: 'flex', 
        flexDirection: 'column',
        p: fullPage ? 0 : 2
      }}>
        {fullPage && (
          <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <IconButton onClick={onClose} sx={{ mr: 1 }}>
              <ArrowLeft size={20} />
            </IconButton>
            <Typography variant="h6">Book an Appointment</Typography>
          </Box>
        )}
        
        <Container maxWidth="md" sx={{ flexGrow: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {activeStep === 0 ? (
              <Box component="form" sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Select a Specialist
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth error={errors.specialty}>
                      <InputLabel id="specialty-label">Medical Specialty</InputLabel>
                      <Select
                        labelId="specialty-label"
                        id="specialty"
                        value={specialty}
                        label="Medical Specialty"
                        onChange={handleSpecialtyChange}
                      >
                        {specialties.map((spec) => (
                          <MenuItem key={spec} value={spec}>{spec}</MenuItem>
                        ))}
                      </Select>
                      {errors.specialty && (
                        <FormHelperText>Please select a specialty</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth disabled={!specialty} error={errors.doctor}>
                      <InputLabel id="doctor-label">Doctor</InputLabel>
                      <Select
                        labelId="doctor-label"
                        id="doctor"
                        value={doctor}
                        label="Doctor"
                        onChange={handleDoctorChange}
                      >
                        {specialists
                          .filter(s => s.specialty === specialty)
                          .map((doc) => (
                            <MenuItem key={doc.id} value={doc.id.toString()}>
                              {doc.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.doctor && (
                        <FormHelperText>Please select a doctor</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  
                  {doctor && (
                    <Grid item xs={12}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Doctor Information
                        </Typography>
                        {specialists
                          .filter(s => s.id.toString() === doctor)
                          .map((doc) => (
                            <Box key={doc.id}>
                              <Typography variant="body1" gutterBottom>
                                <strong>{doc.name}</strong>
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Specialty: {doc.specialty}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Available on: {doc.availableDays.map(day => {
                                  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                  return days[day];
                                }).join(', ')}
                              </Typography>
                            </Box>
                          ))}
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ) : activeStep === 1 ? (
              <Box component="form" sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Choose Appointment Date and Time
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <DatePicker 
                      label="Appointment Date"
                      value={appointmentDate}
                      onChange={(newValue) => setAppointmentDate(newValue)}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: errors.appointmentDate,
                          helperText: errors.appointmentDate ? 'Please select a date' : '',
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth error={errors.timeSlot}>
                      <InputLabel id="time-slot-label">Time Slot</InputLabel>
                      <Select
                        labelId="time-slot-label"
                        id="time-slot"
                        value={timeSlot}
                        label="Time Slot"
                        onChange={(e) => setTimeSlot(e.target.value)}
                      >
                        {timeSlots.map((slot) => (
                          <MenuItem key={slot} value={slot}>{slot}</MenuItem>
                        ))}
                      </Select>
                      {errors.timeSlot && (
                        <FormHelperText>Please select a time slot</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="reason"
                      label="Reason for Visit"
                      multiline
                      rows={4}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      error={errors.reason}
                      helperText={errors.reason ? 'Please enter a reason (min 10 characters)' : ''}
                    />
                  </Grid>
                </Grid>
              </Box>
            ) : activeStep === 2 ? (
              <Box component="form" sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Patient Information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="name"
                      label="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                      helperText={errors.name ? 'Please enter your full name' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="email"
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                      helperText={errors.email ? 'Please enter a valid email address' : ''}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={errors.phone}
                      helperText={errors.phone ? 'Please enter a valid phone number' : ''}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1" gutterBottom>
                      Insurance Information
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <Typography variant="body2" gutterBottom>
                        Insurance Type
                      </Typography>
                      <RadioGroup
                        row
                        value={insuranceType}
                        onChange={(e) => setInsuranceType(e.target.value)}
                      >
                        <FormControlLabel value="private" control={<Radio />} label="Private Insurance" />
                        <FormControlLabel value="medicare" control={<Radio />} label="Medicare" />
                        <FormControlLabel value="medicaid" control={<Radio />} label="Medicaid" />
                        <FormControlLabel value="none" control={<Radio />} label="Self-Pay" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  
                  {insuranceType !== 'none' && (
                    <>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="insuranceProvider"
                          label="Insurance Provider"
                          value={insuranceProvider}
                          onChange={(e) => setInsuranceProvider(e.target.value)}
                          disabled={insuranceType === 'none'}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          id="insuranceNumber"
                          label="Insurance Number"
                          value={insuranceNumber}
                          onChange={(e) => setInsuranceNumber(e.target.value)}
                          disabled={insuranceType === 'none'}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            ) : (
              <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 3, mb: 3, width: '100%', maxWidth: 600, borderRadius: 2 }}>
                  <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', textAlign: 'center' }}>
                    Appointment Summary
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Calendar size={20} color="#1976D2" />
                        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                          Appointment Details
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={4} sm={3}>
                          <Typography variant="body2" color="text.secondary">Doctor:</Typography>
                        </Grid>
                        <Grid item xs={8} sm={9}>
                          <Typography variant="body2">
                            {specialists.find(s => s.id.toString() === doctor)?.name}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4} sm={3}>
                          <Typography variant="body2" color="text.secondary">Specialty:</Typography>
                        </Grid>
                        <Grid item xs={8} sm={9}>
                          <Typography variant="body2">{specialty}</Typography>
                        </Grid>
                        
                        <Grid item xs={4} sm={3}>
                          <Typography variant="body2" color="text.secondary">Date:</Typography>
                        </Grid>
                        <Grid item xs={8} sm={9}>
                          <Typography variant="body2">
                            {appointmentDate?.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={4} sm={3}>
                          <Typography variant="body2" color="text.secondary">Time:</Typography>
                        </Grid>
                        <Grid item xs={8} sm={9}>
                          <Typography variant="body2">{timeSlot}</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                        <User size={20} color="#1976D2" />
                        <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                          Patient Information
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={4} sm={3}>
                          <Typography variant="body2" color="text.secondary">Name:</Typography>
                        </Grid>
                        <Grid item xs={8} sm={9}>
                          <Typography variant="body2">{name}</Typography>
                        </Grid>
                        
                        <Grid item xs={4} sm={3}>
                          <Typography variant="body2" color="text.secondary">Email:</Typography>
                        </Grid>
                        <Grid item xs={8} sm={9}>
                          <Typography variant="body2">{email}</Typography>
                        </Grid>
                        
                        <Grid item xs={4} sm={3}>
                          <Typography variant="body2" color="text.secondary">Phone:</Typography>
                        </Grid>
                        <Grid item xs={8} sm={9}>
                          <Typography variant="body2">{phone}</Typography>
                        </Grid>
                        
                        <Grid item xs={4} sm={3}>
                          <Typography variant="body2" color="text.secondary">Insurance:</Typography>
                        </Grid>
                        <Grid item xs={8} sm={9}>
                          <Typography variant="body2">
                            {insuranceType === 'none' ? 'Self-Pay' : `${insuranceProvider} (${insuranceType.charAt(0).toUpperCase() + insuranceType.slice(1)})`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="body2" gutterBottom sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      Please arrive 15 minutes before your scheduled appointment time. 
                      Don't forget to bring your insurance card and a valid ID.
                    </Typography>
                  </Box>
                </Paper>
                
                <Box sx={{ width: '100%', maxWidth: 600 }}>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    You will receive a confirmation email with these details once you confirm your appointment.
                  </Alert>
                </Box>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                  >
                    Confirm Appointment
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
        
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Appointment booked successfully!
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentForm;