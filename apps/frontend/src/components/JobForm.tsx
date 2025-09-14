import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';

export interface JobFormValues {
  title: string;
  description: string;
}

interface JobFormProps {
  open: boolean;
  initialValues?: JobFormValues;
  onClose: () => void;
  onSubmit: (values: JobFormValues) => void;
}

const JobForm: React.FC<JobFormProps> = ({ open, initialValues, onClose, onSubmit }) => {
  const [values, setValues] = React.useState<JobFormValues>(initialValues || { title: '', description: '' });

  React.useEffect(() => {
    setValues(initialValues || { title: '', description: '' });
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
        <DialogTitle>{initialValues ? 'Edit Job' : 'Add Job'}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={values.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              minRows={3}
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

export default JobForm;
