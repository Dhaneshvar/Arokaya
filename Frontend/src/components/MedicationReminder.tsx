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
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Switch,
  SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ArrowLeft, Clock, Pill as Pills, X, Edit, Trash2 } from 'lucide-react';

interface MedicationReminderProps {
  fullPage: boolean;
  onClose: () => void;
}

// Sample medication data
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: Date;
  days: string[];
  active: boolean;
}

const MedicationReminder = ({ fullPage, onClose }: MedicationReminderProps) => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'daily',
      time: new Date(2025, 0, 1, 8, 0),
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      active: true,
    },
    {
      id: '2',
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'daily',
      time: new Date(2025, 0, 1, 8, 0),
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      active: true,
    }
  ]);
  
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState<Date | null>(new Date());
  const [days, setDays] = useState<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
  const [editing, setEditing] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form validation
  const [errors, setErrors] = useState({
    name: false,
    dosage: false,
    time: false,
    days: false,
  });

  const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  const frequencyOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'twice-daily', label: 'Twice Daily' },
    { value: 'as-needed', label: 'As Needed' },
  ];

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    if (!name) {
      newErrors.name = true;
      isValid = false;
    } else {
      newErrors.name = false;
    }
    
    if (!dosage) {
      newErrors.dosage = true;
      isValid = false;
    } else {
      newErrors.dosage = false;
    }
    
    if (!time) {
      newErrors.time = true;
      isValid = false;
    } else {
      newErrors.time = false;
    }
    
    if (days.length === 0) {
      newErrors.days = true;
      isValid = false;
    } else {
      newErrors.days = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleDayToggle = (day: string) => {
    if (days.includes(day)) {
      setDays(days.filter(d => d !== day));
    } else {
      setDays([...days, day]);
    }
  };

  const handleFrequencyChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setFrequency(value);
    
    // Auto-select days based on frequency
    if (value === 'daily') {
      setDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    } else if (value === 'weekly') {
      setDays(['Monday']);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      if (editing) {
        // Update existing medication
        setMedications(medications.map(med => 
          med.id === editing 
            ? { ...med, name, dosage, frequency, time: time!, days, active: true } 
            : med
        ));
        setSuccessMessage('Medication updated successfully!');
      } else {
        // Add new medication
        const newMedication: Medication = {
          id: Date.now().toString(),
          name,
          dosage,
          frequency,
          time: time!,
          days,
          active: true,
        };
        setMedications([...medications, newMedication]);
        setSuccessMessage('Medication reminder set successfully!');
      }
      
      // Reset form
      setName('');
      setDosage('');
      setFrequency('daily');
      setTime(new Date());
      setDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
      setEditing(null);
      setSuccess(true);
    }
  };

  const handleEdit = (medication: Medication) => {
    setName(medication.name);
    setDosage(medication.dosage);
    setFrequency(medication.frequency);
    setTime(medication.time);
    setDays(medication.days);
    setEditing(medication.id);
  };

  const handleDelete = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    setSuccessMessage('Medication removed successfully!');
    setSuccess(true);
  };

  const handleToggleActive = (id: string) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, active: !med.active } : med
    ));
  };

  const handleCancel = () => {
    setName('');
    setDosage('');
    setFrequency('daily');
    setTime(new Date());
    setDays(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
    setEditing(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

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
            <Typography variant="h6">Medication Reminders</Typography>
          </Box>
        )}
        
        <Container maxWidth="md" sx={{ flexGrow: 1, py: 3, display: 'flex', flexDirection: 'column' }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {editing ? 'Edit Medication Reminder' : 'Add Medication Reminder'}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="medication-name"
                        label="Medication Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={errors.name}
                        helperText={errors.name ? 'Please enter medication name' : ''}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        id="dosage"
                        label="Dosage"
                        value={dosage}
                        onChange={(e) => setDosage(e.target.value)}
                        error={errors.dosage}
                        helperText={errors.dosage ? 'Please enter dosage' : ''}
                        required
                        placeholder="e.g., 10mg, 1 tablet"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel id="frequency-label">Frequency</InputLabel>
                        <Select
                          labelId="frequency-label"
                          id="frequency"
                          value={frequency}
                          label="Frequency"
                          onChange={handleFrequencyChange}
                        >
                          {frequencyOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TimePicker 
                        label="Reminder Time"
                        value={time}
                        onChange={(newValue) => setTime(newValue)}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: errors.time,
                            helperText: errors.time ? 'Please select a time' : '',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom sx={{ mt: 1 }}>
                        Days to Take
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {allDays.map((day) => (
                          <Chip
                            key={day}
                            label={day.substring(0, 3)}
                            color={days.includes(day) ? 'primary' : 'default'}
                            onClick={() => handleDayToggle(day)}
                            sx={{ 
                              borderRadius: '16px',
                              opacity: days.includes(day) ? 1 : 0.7,
                              transition: 'all 0.2s ease'
                            }}
                          />
                        ))}
                      </Box>
                      {errors.days && (
                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 1 }}>
                          Please select at least one day
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        {editing && (
                          <Button
                            variant="outlined"
                            color="inherit"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                        >
                          {editing ? 'Update Reminder' : 'Set Reminder'}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Your Medication Reminders
              </Typography>
              {medications.length === 0 ? (
                <Paper elevation={1} sx={{ p: 3, textAlign: 'center', borderRadius: 2, bgcolor: 'background.paper' }}>
                  <Typography variant="body1" color="text.secondary">
                    You don't have any medication reminders set up yet.
                  </Typography>
                </Paper>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {medications.map((medication) => (
                    <Paper
                      key={medication.id}
                      elevation={1}
                      sx={{ 
                        p: 2, 
                        mb: 2, 
                        borderRadius: 2,
                        opacity: medication.active ? 1 : 0.7,
                        borderLeft: '4px solid',
                        borderLeftColor: medication.active ? 'primary.main' : 'grey.400',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon sx={{ minWidth: 40 }}>
                          <Pills size={24} color={medication.active ? '#1976D2' : '#757575'} />
                        </ListItemIcon>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
                            {medication.name} - {medication.dosage}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <Clock size={14} color="#757575" />
                            <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                              {formatTime(medication.time)} - {medication.frequency}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                            {medication.days.map((day) => (
                              <Chip
                                key={day}
                                label={day.substring(0, 3)}
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  height: 24,
                                  fontSize: '0.75rem',
                                  color: medication.active ? 'text.primary' : 'text.disabled',
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Switch
                            edge="end"
                            checked={medication.active}
                            onChange={() => handleToggleActive(medication.id)}
                          />
                          <IconButton 
                            edge="end" 
                            aria-label="edit"
                            onClick={() => handleEdit(medication)}
                            sx={{ ml: 1 }}
                          >
                            <Edit size={18} />
                          </IconButton>
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleDelete(medication.id)}
                            sx={{ ml: 1 }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
        
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default MedicationReminder;