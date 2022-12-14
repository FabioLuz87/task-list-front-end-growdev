import React, { ReactElement, useEffect, useState } from 'react';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, Box, Typography, Modal, TextField, Chip, Avatar, Checkbox, FormGroup, FormControlLabel, LinearProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { respSignUp } from '../../service/api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface Column {
  id: 'id' | 'description' | 'detail' | 'actions' ;
  label: string;
  minWidth?: number;
  align?: 'right' | 'center' | undefined;
  format?: (value: number) => string;
}

const columns: Column[] = [
  { id: 'id', label: '#', minWidth: 170 },
  { id: 'description', label: 'Descrição', minWidth: 100 },
  {
    id: 'detail',
    label: 'Detalhamento',
    minWidth: 170,
    align: 'right',
  },
  {
    id: 'actions',
    label: 'Ações',
    minWidth: 170,
    align: 'center',
  },
];

interface Data {
  id: string;
  description: string;
  detail: string;
  isItArchived: boolean;
  actions: ReactElement;
}

export default function Task(): JSX.Element {
  const navigate = useNavigate();
  const itemLocalStorage = localStorage.getItem("currentUser");   
  const userId: respSignUp = itemLocalStorage ? JSON.parse(itemLocalStorage) : '';
  const userName = userId.name;
  const [inputDescription, setInputDescription] = React.useState('');
  const [inputDescriptionUpdate, setInputDescriptionUpdate] = React.useState('');
  const [inputDetail, setInputDetail] = React.useState('');
  const [inputDetailUpdate, setInputDetailUpdate] = React.useState('');
  const [uuidLocal, setUuidLocal] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = useState<Array<Data>>([]);
  const [refreshTable, setRefreshTable] = useState(true);
  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openLoading, setOpenLoading] = React.useState(false);

  const handleOpenUpdate = (uuid: string, description: string, detail: string) => {
    setOpenUpdate(true);
    setUuidLocal(uuid);
    setInputDescriptionUpdate(description);
    setInputDetailUpdate(detail);
  };

  const logOut = () => {
    localStorage.setItem("currentUser", "");
    navigate('/');
  }

  const handleCloseUpdate = () => setOpenUpdate(false);

  const handleOpenDelete = (uuid: string) => {
    setOpenDelete(true);
    setUuidLocal(uuid);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setUuidLocal('');
  };

  useEffect(() => {
    if (refreshTable) {
      setOpenLoading(true);
      setTimeout(() => {
        setRows([]);
        axios
        .get(process.env.REACT_APP_URL + `/users/${userId.id}/tasks`)
        .then((response) => {              
          loadList(response.data);
        })
        .catch((err) => {
          alert('Não foi possível listar suas tarefas/recados.');
          navigate("/");
        });
        setRefreshTable(false);
      },1100)       
    }
  }, [refreshTable]);

  const handleArchived = (taskId: string) => {
    axios
    .patch(process.env.REACT_APP_URL + `/users/${userId.id}/tasks/${taskId}`)
    .then((response) => {
      setRefreshTable(true);              
    })
    .catch((err) => {
      alert(err.msg);
      navigate("/");
    });;
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const loadList = (list: Data[]) => {
    list.forEach((item: Data) => {
      setRows((prev) => [...prev, item]);
    });
    setTimeout(() => {
      setOpenLoading(false);
    }, 1000);
  };

  const onSave = () => {
    const body = {
      description: inputDescription,
      detail: inputDetail,
    };
    axios
      .post(process.env.REACT_APP_URL + `/users/${userId.id}/tasks`, body)
      .then((response) => {
        setRefreshTable(true);
      })
      .catch((err) => {
        alert('Não foi possível salvar seu recado');
      });

    setInputDescription('');
    setInputDetail('');
  };

  const onDelete = (uuid: string) => {
    axios
      .delete(
        process.env.REACT_APP_URL + `/users/${userId}/tasks/${uuidLocal}`
      )
      .then((response) => {
        setRefreshTable(true);
      })
      .catch((err) => {
        alert('Não foi possível realizar a exclusão');
      });

    handleCloseDelete();
  };

  const onUpdate = () => {
    const bodyEditing = {
      description: inputDescriptionUpdate,
      detail: inputDetailUpdate,
    };
    axios
      .put(process.env.REACT_APP_URL + `/users/${userId.id}/tasks/${uuidLocal}`, bodyEditing)
      .then((response) => {
        setRefreshTable(true);
        handleCloseUpdate();
      })
      .catch((err) => {
        alert('Não foi possível atualizar seu recado.');

      });
  };

  return (
    <Box
      sx={{ width: '100%', height: '100%' }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
  
      <Paper sx={{ width: '100%' }}>
        <Box display="flex" justifyContent="center" alignItems="center" gap={2} paddingTop={2}>
        <Avatar alt="Remy Sharp" src="https://i.pravatar.cc/150" />
        <Chip label={userName.toUpperCase()} />
          <TextField
            id="descriptionInput"
            label="Descrição"
            value={inputDescription}
            onChange={(e) => setInputDescription(e.target.value)}
          />
          <TextField
            sx={{ width: '55%' }}
            id="detailInput"
            label="Detalhamento"
            value={inputDetail}
            onChange={(e) => setInputDetail(e.target.value)}
          />
          <Button
            disabled={!inputDetail || !inputDescription}
            sx={{ backgroundColor: 'lightblue' }}
            color="primary"
            variant="contained"
            onClick={() => onSave()}
          >
            Salvar Recado
          </Button>
          <Button
            variant="outlined"
            onClick={() => logOut()}
            color="error"
          >
            Log Out
          </Button>
        </Box>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ top: 57, minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {                 
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === 'id' ? index + 1 + page * rowsPerPage : value}
                            {(column.id === 'actions' && !row.isItArchived ) && (
                              <Box>
                                <FormControlLabel control={
                                <Checkbox 
                                onChange={() => handleArchived(row.id)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                />
                              } label="Arquivar" />
                                <Button
                                  onClick={() =>
                                    handleOpenUpdate(row.id, row.description, row.detail)
                                  }
                                  variant="outlined"
                                  color="primary"
                                >
                                  Editar
                                </Button>
                                <Button
                                  onClick={() => handleOpenDelete(row.id)}
                                  variant="outlined"
                                  startIcon={<DeleteIcon />}
                                  color="error"
                                >
                                  Apagar
                                </Button>
                              </Box>
                            )}
                            {(column.id === 'actions' && row.isItArchived ) && (
                              <Box>
                                <FormControlLabel control={
                                <Checkbox checked
                                onChange={() => handleArchived(row.id)}
                                inputProps={{ 'aria-label': 'controlled' }}
                                />
                              } label="Arquivar" />
                                <Button disabled
                                  onClick={() =>
                                    handleOpenUpdate(row.id, row.description, row.detail)
                                  }
                                  variant="outlined"
                                  color="primary"
                                >
                                  Editar
                                </Button>
                                <Button disabled
                                  onClick={() => handleOpenDelete(row.id)}
                                  variant="outlined"
                                  startIcon={<DeleteIcon />}
                                  color="error"
                                >
                                  Apagar
                                </Button>
                              </Box>
                            )}

                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Modal
        open={openLoading}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <LinearProgress />
        </Box>
      </Modal>
      <Modal
        open={openUpdate}
        onClose={handleCloseUpdate}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            id="descriptionInputUpdate"
            label="Descrição"
            value={inputDescriptionUpdate}
            onChange={(e) => setInputDescriptionUpdate(e.target.value)}
          />
          <TextField
            sx={{ marginY: '8px' }}
            fullWidth
            id="detailInputUpdate"
            label="Detalhamento"
            value={inputDetailUpdate}
            onChange={(e) => setInputDetailUpdate(e.target.value)}
          />
          <Box display="flex" gap={2}>
            <Button
              onClick={onUpdate}
              variant="outlined"
              disabled={!inputDescriptionUpdate || !inputDetailUpdate}
              color="primary"
            >
              Confirmar
            </Button>
            <Button onClick={handleCloseUpdate} variant="outlined" color="error">
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} gap={2}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Deseja mesmo apagar o item?
          </Typography>
          <Box display="flex" gap={2}>
            <Button onClick={() => onDelete(uuidLocal)} variant="outlined" color="success">
              Confirmar
            </Button>
            <Button onClick={handleCloseDelete} variant="outlined" color="error">
              Cancelar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}