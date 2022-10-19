import { Stack, useToast } from "@chakra-ui/react";
import { TOAST_ERROR_DESCRIPTION, TOAST_ERROR_TITLE } from "src/constants/messages";
import axios from "axios";
import { useEffect, useState } from "react";
import { TypeSubject, TypeTeacher } from "src/types/types";
import dayjs from "dayjs";
import { ModalEditDeleteActions } from "src/components/ModalEditDeleteActions";
import MainPage from "src/components/MainPage";
import { ModalShowDetails } from "src/components/ModalShowDetails";

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

const Teachers = () => {
  const toast = useToast();
  const [teacherData, setTeacherData] = useState<Array<TypeTeacher>>([]);
  const [reloadTable, setReloadTable] = useState<Date>(new Date());

  
  useEffect(() => {
    axios
      .get("/api/teachers?include=Subject")
      .then(({ data }) => {
        setTeacherData(
          data.map((teacher: TypeTeacher) => ({
            ...teacher,
            actions: (
              <Stack direction="row" spacing={2} align="center">
                <ModalShowDetails 
                    imageSeed={teacher.email}
                    title={teacher.name}
                    subtitle={teacher.email}
                    items={teacher.Subject.length > 0 ? teacher.Subject.map((subject: TypeSubject) => ({id: subject.id,label: subject.topic})) : []}
                />

                <ModalEditDeleteActions
                  entityData={teacher}
                  onCallback={() => setReloadTable(new Date())}
                  action="edit"
                  typeEntity="teacher"
                  recordTitle={`${teacher.lastname}, ${teacher.name}`}
                />

                <ModalEditDeleteActions
                  entityData={teacher}
                  onCallback={() => setReloadTable(new Date())}
                  action="delete"
                  typeEntity="teacher"
                  recordTitle={`${teacher.lastname}, ${teacher.name}`}
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
      entityData={teacherData}
      handleCallback={() => setReloadTable(new Date())}
    />
  );
};

export default Teachers;
