import { useState } from 'react';
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Box,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

interface Tenant {
  id: string;
  code: string;
  legalName: string;
  tradeName?: string;
  status: string;
  email?: string;
  createdAt: string;
}

export default function TenantsPage() {
  const [open, setOpen] = useState(false);
  const [tenants] = useState<Tenant[]>([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'TRIAL': return 'info';
      case 'SUSPENDED': return 'warning';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tenants</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Nuevo Tenant
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Código</TableCell>
              <TableCell>Razón Social</TableCell>
              <TableCell>Nombre Comercial</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Creado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay tenants registrados. Crea el primero haciendo clic en "Nuevo Tenant".
                </TableCell>
              </TableRow>
            ) : (
              tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>{tenant.code}</TableCell>
                  <TableCell>{tenant.legalName}</TableCell>
                  <TableCell>{tenant.tradeName || '-'}</TableCell>
                  <TableCell>{tenant.email || '-'}</TableCell>
                  <TableCell>
                    <Chip label={tenant.status} color={getStatusColor(tenant.status) as any} size="small" />
                  </TableCell>
                  <TableCell>{new Date(tenant.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Nuevo Tenant</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Código" fullWidth variant="outlined" />
          <TextField margin="dense" label="Razón Social" fullWidth variant="outlined" />
          <TextField margin="dense" label="Nombre Comercial" fullWidth variant="outlined" />
          <TextField margin="dense" label="Email" fullWidth variant="outlined" />
          <TextField margin="dense" label="Teléfono" fullWidth variant="outlined" />
          <TextField margin="dense" label="País" fullWidth variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleClose}>Crear</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
