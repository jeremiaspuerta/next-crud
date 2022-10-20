import { Stack, useToast } from "@chakra-ui/react";
import {
  TOAST_ERROR_DESCRIPTION,
  TOAST_ERROR_TITLE,
} from "src/constants/messages";
import axios from "axios";
import { useEffect, useState } from "react";
import { TypeStudent, TypeSubject, TypeTeacher } from "src/types/types";
import dayjs from "dayjs";
import { ModalEditDeleteActions } from "src/components/ModalEditDeleteActions";
import MainPage from "src/components/MainPage";
import { ModalShowDetails } from "src/components/ModalShowDetails";
import { useSession } from "next-auth/react";

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
  const { data: session }: any = useSession();

  useEffect(() => {
    if (session.user) {
      axios
        .get("/api/students?include=Subjects")
        .then(({ data }) => {
          setStudentData(
            data.map((student: TypeStudent) => ({
              ...student,
              actions: (
                <Stack direction="row" spacing={2} align="center">
                  {session.user.email.includes("admin") ? (
                    <ModalShowDetails
                      imageSeed={student.email}
                      title={student.name}
                      subtitle={student.email}
                      items={
                        student.Subjects.length > 0
                          ? student.Subjects.map((subject: TypeSubject) => ({
                              id: subject.id,
                              label: subject.topic,
                            }))
                          : []
                      }
                    />
                  ) : (
                    <></>
                  )}

                  {session.user.email.includes("teacher") ||
                  session.user.email.includes("admin") ? (
                    <ModalEditDeleteActions
                      entityData={student}
                      onCallback={() => setReloadTable(new Date())}
                      action="edit"
                      typeEntity="student"
                      recordTitle={`${student.lastname}, ${student.name}`}
                    />
                  ) : (
                    <></>
                  )}

                  {session.user.email.includes("admin") ? (
                    <ModalEditDeleteActions
                      entityData={student}
                      onCallback={() => setReloadTable(new Date())}
                      action="delete"
                      typeEntity="student"
                      recordTitle={`${student.lastname}, ${student.name}`}
                    />
                  ) : (
                    <></>
                  )}
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
    }
  }, [reloadTable, session]);

  return (
    <MainPage
      columnsName={columns}
      entityData={studentData}
      handleCallback={() => setReloadTable(new Date())}
    />
  );
};

export default Students;
