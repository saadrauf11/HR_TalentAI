import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

export interface CandidateFormValues {
  name: string;
  email: string;
  phone: string;
}

interface CandidateFormProps {
  open: boolean;
  initialValues?: CandidateFormValues;
  onClose: () => void;
  onSubmit: (values: CandidateFormValues) => void;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ open, initialValues, onClose, onSubmit }) => {
  const [values, setValues] = React.useState<CandidateFormValues>(initialValues || { name: '', email: '', phone: '' });

  React.useEffect(() => {
    setValues(initialValues || { name: '', email: '', phone: '' });
  }, [initialValues, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
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
