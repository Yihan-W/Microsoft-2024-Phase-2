import React from "react";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowModel,
} from "@mui/x-data-grid";
import { Container, Typography, CircularProgress } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { Student } from "../Models/Students";
import { updateStudent, deleteStudent } from "../Services/StudentService";

interface StudentDataGridProps {
  students: Student[];
  loading: boolean;
  error: string | null;
}

const StudentDataGrid: React.FC<StudentDataGridProps> = ({
  students,
  loading,
  error,
}) => {
  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedStudent: Student = {
      id: newRow.id,
      firstName: newRow.firstName,
      lastName: newRow.lastName,
      email: newRow.email,
      university: newRow.university,
    };
    try {
      await updateStudent(newRow.id as number, updatedStudent);
      return updatedStudent;
    } catch (err) {
      throw new Error("Failed to update student");
    }
  };

  const handleProcessRowUpdateError = (error: any) => {
    console.error("Failed to update student:", error);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteStudent(id);
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
      editable: true,
    },
    { field: "lastName", headerName: "Last Name", width: 150, editable: true },
    { field: "email", headerName: "Email", width: 200, editable: true },
    {
      field: "university",
      headerName: "University",
      width: 200,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Delete />}
          label="Delete"
          onClick={() => handleDelete(params.id as number)}
        />,
      ],
    },
  ];

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Student List
      </Typography>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={students}
          columns={columns}
          paginationModel={{ page: 0, pageSize: 5 }}
          pageSizeOptions={[5, 10, 20]}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
        />
      </div>
    </Container>
  );
};

export default StudentDataGrid;
