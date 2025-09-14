import React, { useEffect, useState } from 'react';
import { Typography, Paper, Button, Stack, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CandidateForm, { CandidateFormValues } from '../components/CandidateForm';
import { useAuth } from '../AuthContext';

interface Candidate {
  id: string;
  tenantId: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

const baseColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
  { field: 'tenantId', headerName: 'Tenant', width: 120 },
  { field: 'createdAt', headerName: 'Created At', width: 180 },
];

const Candidates: React.FC = () => {
  const { tenantId } = useAuth(); // Fetch tenantId dynamically
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [candidateFormOpen, setCandidateFormOpen] = useState(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000/api'; // Fallback for undefined API URL
  console.log('API URL:', apiUrl); // Debug log

  const fetchCandidates = () => {
    setLoading(true);
    fetch('http://localhost:4000/api/candidates')
      .then((res) => res.json())
      .then((data) => setCandidates(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleAdd = () => {
    setEditCandidate(null);
    setCandidateFormOpen(true);
  };

  const handleEdit = (candidate: Candidate) => {
    setEditCandidate(candidate);
    setCandidateFormOpen(true);
  };

  const handleDelete = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setCandidateFormOpen(false);
    setEditCandidate(null);
  };

  const handleFormSubmit = async (values: CandidateFormValues, cvFile: File | null) => {
    const formData = new FormData();
    formData.append('tenantId', 'd76f0344-26f2-46d8-9630-b8fb35352c27'); // Hardcoded tenantId
    formData.append('name', values.name);
    formData.append('email', values.email);
    formData.append('phone', '1234567890'); // Updated phone number to a shorter, valid value for testing
    if (cvFile) {
      formData.append('cv', cvFile);
    }

    console.log('FormData contents:');
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    }); // Debug log

    const method = editCandidate ? 'PUT' : 'POST';
    const url = editCandidate ? `${apiUrl}/candidates/${editCandidate.id}` : `${apiUrl}/candidates`;

    try {
      const response = await fetch(url, {
        method,
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to submit candidate');
      }
      fetchCandidates();
      handleFormClose();
    } catch (error) {
      console.error('Failed to submit candidate:', error);
    }
  };

  const confirmDelete = () => {
    if (candidateToDelete) {
      fetch(`http://localhost:4000/api/candidates/${candidateToDelete.id}`, { method: 'DELETE' })
        .then(() => {
          fetchCandidates();
          setDeleteDialogOpen(false);
          setCandidateToDelete(null);
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
        <Typography variant="h4" gutterBottom>Candidates</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} sx={{ mb: 1 }}>
          Add Candidate
        </Button>
      </Stack>
      <Paper elevation={2} sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={candidates}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          pagination
          pageSizeOptions={[5, 10, 20]}
        />
      </Paper>
      <CandidateForm
        open={candidateFormOpen}
        initialValues={editCandidate ? { name: editCandidate.name || '', email: editCandidate.email || '', phone: editCandidate.phone || '' } : undefined}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Candidate</DialogTitle>
        <DialogContent>Are you sure you want to delete this candidate?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Candidates;
