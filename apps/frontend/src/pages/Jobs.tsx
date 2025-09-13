
import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Job {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  createdById: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'title', headerName: 'Title', flex: 1 },
  { field: 'description', headerName: 'Description', flex: 2 },
  { field: 'tenantId', headerName: 'Tenant', width: 120 },
  { field: 'createdById', headerName: 'Created By', width: 120 },
];

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/api/jobs')
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Jobs</Typography>
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
    </div>
  );
};

export default Jobs;
