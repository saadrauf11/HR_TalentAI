import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, MenuItem, Select, InputLabel, FormControl, Typography, SelectChangeEvent } from '@mui/material';

export interface CandidateFormValues {
  name: string;
  email: string;
  phone: string;
  jobId?: string; // Added jobId to the interface
}

interface CandidateFormProps {
  open: boolean;
  initialValues?: CandidateFormValues;
  onClose: () => void;
  onSubmit: (values: CandidateFormValues, cvFile: File | null) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ open, initialValues, onClose, onSubmit }) => {
  const [values, setValues] = useState<CandidateFormValues>(initialValues || { name: '', email: '', phone: '' });
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]); // Explicitly typed jobs
  const [selectedJob, setSelectedJob] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobFetchError, setJobFetchError] = useState<string | null>(null);

  useEffect(() => {
    setValues(initialValues || { name: '', email: '', phone: '' });
  }, [initialValues, open]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        console.log('Fetching jobs from API...'); // Debug log
        // console.log('API URL:', process.env.REACT_APP_API_URL); // Debug log to verify environment variable
        // const response = await fetch(`${process.env.REACT_APP_API_URL}/jobs`);
        const response = await fetch(`http://localhost:4000/api/jobs`);
        console.log('API Response:', response); // Debug log

        if (!response.ok) {
          const errorText = await response.text(); // Read the full response body
          console.error('Error Response Body:', errorText); // Debug log
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Jobs Data:', data); // Debug log

        // Validate the response structure
        if (Array.isArray(data) && data.every(job => job.id && job.title)) {
          setJobs(data);
        } else {
          throw new Error('Invalid job data format received from API');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error); // Debug log
        setJobFetchError('Unable to load jobs. Please try again later.');
      }
    };

    fetchJobs();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleJobChange = (event: SelectChangeEvent) => {
    setSelectedJob(event.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        if (file.size <= 5 * 1024 * 1024) { // Limit file size to 5MB
          setCvFile(file);
        } else {
          alert('File size must be less than 5MB.');
        }
      } else {
        alert('Only PDF files are allowed.');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...values, jobId: selectedJob }, cvFile);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{initialValues ? 'Edit Candidate' : 'Add Candidate'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              fullWidth
              type="email"
            />
            <TextField
              label="Phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="job-select-label">Job</InputLabel>
              <Select
                labelId="job-select-label"
                value={selectedJob}
                onChange={handleJobChange}
                required
              >
                {jobs.map((job) => (
                  <MenuItem key={job.id} value={job.id}>
                    {job.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {jobFetchError && <Typography color="error">{jobFetchError}</Typography>}
            <TextField
              type="file"
              inputProps={{ accept: 'application/pdf' }}
              onChange={handleFileChange}
              fullWidth
              helperText="Upload CV (PDF only, max 5MB, optional)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">{initialValues ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CandidateForm;
