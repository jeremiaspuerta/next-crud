import { Stack, useToast } from "@chakra-ui/react";
import { TOAST_ERROR_DESCRIPTION, TOAST_ERROR_TITLE } from "constants/messages";
import axios from "axios";
import { useEffect, useState } from "react";
import { TypeStudent, TypeSubject, TypeTeacher } from "types/types";
import dayjs from "dayjs";
import { ModalEditDeleteActions } from "components/ModalEditDeleteActions";
import MainPage from "components/MainPage";
import { ModalShowDetails } from "components/ModalShowDetails";

const columns = [
  {
    name: "Actions",
    selector: (row: any) => row.actions,
  },
  {
    name: "Name",
    selector: (row: any) => row.name,
  },
  {
    name: "Lastname",
    selector: (row: any) => row.lastname,
  },
  {
    name: "Document number",
    selector: (row: any) => row.document_number,
  },
  {
    name: "Email",
    selector: (row: any) => row.email,
  },
  {
    name: "Created on",
    selector: (row: any) => dayjs(row.created_at).format("DD/MM/YYYY"),
  },
];

const Students = () => {
  const toast = useToast();
  const [studentData, setStudentData] = useState<Array<TypeStudent>>([]);
  const [reloadTable, setReloadTable] = useState<Date>(new Date());

  useEffect(() => {
    axios
      .get("/api/students?include=Subject")
      .then(({ data }) => {
        setStudentData(
          data.map((student: TypeStudent) => ({
            ...student,
            actions: (
              <Stack direction="row" spacing={2} align="center">
                <ModalShowDetails 
                    imageSeed={student.email}
                    title={student.name}
                    subtitle={student.email}
                    items={student.Subject.length > 0 ? student.Subject.map((subject: TypeSubject) =>({id: subject.id, label: subject.topic})) : []}
                />

                <ModalEditDeleteActions
                  entityData={student}
                  onCallback={() => setReloadTable(new Date())}
                  action="edit"
                  typeEntity="student"
                  recordTitle={`${student.lastname}, ${student.name}`}
                />

                <ModalEditDeleteActions
                  entityData={student}
                  onCallback={() => setReloadTable(new Date())}
                  action="delete"
                  typeEntity="student"
                  recordTitle={`${student.lastname}, ${student.name}`}
                />
              </Stack>
            ),
          }))
        );
      })
      .catch((error) =>
        toast({
          title: TOAST_ERROR_TITLE,
          description: TOAST_ERROR_DESCRIPTION,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        })
      );
  }, [reloadTable]);

  return (
    <MainPage
      columnsName={columns}
      entityData={studentData}
      handleCallback={() => setReloadTable(new Date())}
    />
  );
};

export default Students;
