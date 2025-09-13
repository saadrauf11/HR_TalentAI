
import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Candidate {
  id: string;
  tenantId: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
  { field: 'phone', headerName: 'Phone', flex: 1 },
  { field: 'tenantId', headerName: 'Tenant', width: 120 },
  { field: 'createdAt', headerName: 'Created At', width: 180 },
];

const Candidates: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/api/candidates')
      .then((res) => res.json())
      .then((data) => setCandidates(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Candidates</Typography>
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
    </div>
  );
};

export default Candidates;
