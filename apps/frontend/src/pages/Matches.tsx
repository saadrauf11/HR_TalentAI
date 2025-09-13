
import React, { useEffect, useState } from 'react';
import { Typography, Paper } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Match {
  id: string;
  jobId: string;
  candidateId: string;
  score: number;
  reason?: string;
  createdAt: string;
}

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'jobId', headerName: 'Job ID', flex: 1 },
  { field: 'candidateId', headerName: 'Candidate ID', flex: 1 },
  { field: 'score', headerName: 'Score', width: 100 },
  { field: 'reason', headerName: 'Reason', flex: 2 },
  { field: 'createdAt', headerName: 'Created At', width: 180 },
];

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:4000/api/matches')
      .then((res) => res.json())
      .then((data) => setMatches(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Matches</Typography>
      <Paper elevation={2} sx={{ height: 400, width: '100%', mt: 2 }}>
        <DataGrid
          rows={matches}
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

export default Matches;
