
import React, { useEffect, useState } from 'react';
import { Typography, Paper, Button, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import JobForm, { JobFormValues } from '../components/JobForm';

interface Job {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  createdById: string;
}


const baseColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 2 },
  { field: 'tenantId', headerName: 'Tenant', width: 120 },
  { field: 'createdById', headerName: 'Created By', width: 120 },
];


const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [jobFormOpen, setJobFormOpen] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);

  const fetchJobs = () => {
    setLoading(true);
    fetch('http://localhost:4000/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleAdd = () => {
    setEditJob(null);
    setJobFormOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditJob(job);
    setJobFormOpen(true);
  };

  const handleDelete = (job: Job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setJobFormOpen(false);
    setEditJob(null);
  };

  const handleFormSubmit = (values: JobFormValues) => {
    const method = editJob ? 'PUT' : 'POST';
    const url = editJob ? `http://localhost:4000/api/jobs/${editJob.id}` : 'http://localhost:4000/api/jobs';
    // Hardcoded for demo; replace with real user/tenant context in production
    const tenantId = 'd76f0344-26f2-46d8-9630-b8fb35352c27'; // DemoCorp
    const createdById = '8b7717df-e40d-43a5-8277-2d773b878446'; // admin@democorp.local
    const payload = editJob
      ? { ...values, tenantId: editJob.tenantId, createdById: editJob.createdById }
      : { ...values, tenantId, createdById };
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(() => {
        fetchJobs();
        handleFormClose();
      });
  };

  const confirmDelete = () => {
    if (jobToDelete) {
      fetch(`http://localhost:4000/api/jobs/${jobToDelete.id}`, { method: 'DELETE' })
        .then(() => {
          fetchJobs();
          setDeleteDialogOpen(false);
          setJobToDelete(null);
        });
    }
  };

  const columns: GridColDef[] = [
    ...baseColumns,
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <>
          <IconButton aria-label="edit" onClick={() => handleEdit(params.row)} size="small">
            <EditIcon fontSize="inherit" />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => handleDelete(params.row)} size="small" color="error">
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>Jobs</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} sx={{ mb: 1 }}>
          Add Job
        </Button>
      </Stack>
      <Paper elevation={2} sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={jobs}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          pagination
          pageSizeOptions={[5, 10, 20]}
        />
      </Paper>
      <JobForm
        open={jobFormOpen}
        initialValues={editJob ? { title: editJob.title, description: editJob.description } : undefined}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Job</DialogTitle>
        <DialogContent>Are you sure you want to delete this job?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Jobs;
