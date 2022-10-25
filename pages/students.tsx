import { Stack, useToast } from "@chakra-ui/react";
import {
  TOAST_ERROR_DESCRIPTION,
  TOAST_ERROR_TITLE,
} from "src/constants/messages";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  TypeCourse,
  TypeStudent,
  TypeSubject,
  TypeTeacher,
} from "src/types/types";
import dayjs from "dayjs";
import { ModalEditDeleteActions } from "src/components/ModalEditDeleteActions";
import MainPage from "src/components/MainPage";
import { ModalShowDetails } from "src/components/ModalShowDetails";
import { useSession } from "next-auth/react";

const Students = () => {
  const toast = useToast();
  const [studentData, setStudentData] = useState<Array<TypeStudent>>([]);
  const [reloadTable, setReloadTable] = useState<Date>(new Date());
  const { data: session }: any = useSession();

  const columns = [
    {
      name: "Actions",
      selector: (row: any) => (
        <Stack direction="row" spacing={2} align="center">
          {session.user.email.includes("admin") ? (
            <ModalShowDetails
              imageSeed={row.email}
              title={row.name}
              subtitle={row.email}
              items={
                row.Subjects.length > 0
                  ? row.Subjects.map((subject: TypeSubject) => ({
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
              entityData={row}
              onCallback={() => setReloadTable(new Date())}
              action="edit"
              typeEntity="student"
              recordTitle={`${row.lastname}, ${row.name}`}
            />
          ) : (
            <></>
          )}

          {session.user.email.includes("admin") ? (
            <ModalEditDeleteActions
              entityData={row}
              onCallback={() => setReloadTable(new Date())}
              action="delete"
              typeEntity="student"
              recordTitle={`${row.lastname}, ${row.name}`}
            />
          ) : (
            <></>
          )}
        </Stack>
      ),
      sortable: true
    },
    {
      name: "Name",
      selector: (row: any) => row.name,
      sortable: true
    },
    {
      name: "Lastname",
      selector: (row: any) => row.lastname,
      sortable: true
    },
    {
      name: "Document number",
      selector: (row: any) => row.document_number,
      sortable: true
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true
    },
    {
      name: "Created on",
      selector: (row: any) => dayjs(row.created_at).format("DD/MM/YYYY"),
      sortable: true
    },
  ];

  async function fetchTeacherStudents(teacher_id: number) {
    let subjects_id: number[] = [];
    let students_id: number[] = [];

    try {
      const { data: subjectsData } = await axios.get(
        `/api/subjects?where={"teacher_id":${teacher_id}}`
      );

      subjects_id = subjectsData.map((item: TypeSubject) => item.id);

      const { data: coursesData } = await axios.get(
        `/api/courses?where={"subject_id":{"$in":[${subjects_id.toString()}]}}`
      );

      coursesData.forEach((item: any) => {
        if (!students_id.includes(item.student_id)) {
          students_id.push(item.student_id);
        }
      });

      const { data: studentsData } = await axios.get(
        `/api/students?where={"id":{"$in":[${students_id.toString()}]}}`
      );

      setStudentData(studentsData);
    } catch (error) {
      console.error(error);
    }

  }

  useEffect(() => {
    if (session?.user) {
      if (session.user.email.includes("teacher")) {
        fetchTeacherStudents(session.user.id);
      } else {
        axios
          .get("/api/students?include=Subjects")
          .then(({ data }) => {
            setStudentData(data);
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
