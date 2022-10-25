import { Stack, Tag, useToast, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { TypeSubject, TypeTeacher } from "src/types/types";
import MainPage from "src/components/MainPage";
import { useEffect, useState } from "react";
import { ModalEditDeleteActions } from "src/components/ModalEditDeleteActions";
import {
  TOAST_ERROR_DESCRIPTION,
  TOAST_ERROR_TITLE,
} from "src/constants/messages";
import { useSession } from "next-auth/react";
import AssignUnassignToSubject from "src/components/AssignUnassignToSubject";
import ModalDetailsSubject from "src/components/ModalDetailsSubject";
import Link from "next/link";
import slugify from "slugify";

type PropData = {
  subjects: Array<TypeSubject>;
  teachers: Array<TypeTeacher>;
};

const Subjects = ({ subjects, teachers }: PropData) => {
  const toast = useToast();
  const [subjectData, setSubjectData] = useState<Array<TypeSubject>>([]);
  const [reloadTable, setReloadTable] = useState<Date>(new Date());
  const [columns, setColumns] = useState<any[]>([
    {
      name: "Actions",
      selector: (row: any) => row.actions,
    },
    {
      name: "Topic",
      selector: (row: any) =>
        session?.user?.email.includes("teacher") ? (
          <Link href={`/subjects/${slugify(row.topic, { lower: false })}`}>
            <a>{row.topic}</a>
          </Link>
        ) : (
          <Text>{row.topic}</Text>
        ),
        sortable: true
    },
    {
      name: "Description",
      selector: (row: any) => row.description,
      sortable: true
    },
    {
      name: "Teacher",
      selector: (row: any) =>
        row.Teacher ? (
          `${row.Teacher.lastname.toUpperCase()}, ${row.Teacher.name.toUpperCase()}`
        ) : (
          <Tag>Not Selected</Tag>
        ),
        sortable: true
    },
    {
      name: "Period",
      selector: (row: any) => row.period.replace("_", " "),
      sortable: true
    },
    {
      name: "Cost (per month)",
      selector: (row: any) => `$${row.monthly_cost}`,
      sortable: true
    },
  ]);

  const { data: session }: any = useSession();


  useEffect(() => {
    if (session?.user) {
      let studentSubjectsId: number[] = [];

      if (session.user.email.includes("student")) {

        const { id: student_id } = session.user;

        axios
          .get(
            `/api/students?include=Subjects&where={"id":{"$eq":${student_id}}}`
          )
          .then(async({ data }) => {
            const { Subjects } = data[0];

            if (Subjects.length > 0) {
              studentSubjectsId = Subjects.map((item: any) => item.subject_id);
            }

            let showSubjectsGrade = [];
            try {
              const { data } = await axios.get(
                `/api/courses?where={"student_id":${student_id}}`
              );

              showSubjectsGrade = data;
            } catch (error) {
              console.error(error);
            }

            fetchAndSetSubjects([], studentSubjectsId,showSubjectsGrade);
          })
          .catch((err) => console.error(err));
      } else {
        fetchAndSetSubjects();
      }
    }
  }, [reloadTable, session]);

  function fetchAndSetSubjects(
    enableSubjectsToAssign: number[] = [],
    disableSubjectsToAssign: number[] = [],
    subjectsGrade: any[] = []
  ) {
    axios
      .get("/api/subjects?include=Teacher")
      .then(({ data }) => {
        setSubjectData(
          data.map((subject: TypeSubject) => ({
            ...subject,
            actions: (
              <Stack direction="row" spacing={2} align="center">
                {session.user.email.includes("teacher") && (
                  <ModalDetailsSubject
                    entityType={"teacher"}
                    subject={subject}
                  />
                )}

                {session.user.email.includes("teacher") &&
                session.user.id === subject.teacher_id ? (
                  <AssignUnassignToSubject
                    action={"unassign"}
                    entityType={
                      session.user.email.includes("teacher")
                        ? "teacher"
                        : "student"
                    }
                    entityId={session.user.id}
                    subject={subject}
                    callback={() => setReloadTable(new Date())}
                  />
                ) : (
                  <></>
                )}

                {(session.user.email.includes("teacher") &&
                  subject.teacher_id === null) ||
                (session.user.email.includes("student") &&
                  !disableSubjectsToAssign.includes(subject.id)) ? (
                  <AssignUnassignToSubject
                    action={
                      session.user.email.includes("teacher") ? "assign" : "join"
                    }
                    entityType={
                      session.user.email.includes("teacher")
                        ? "teacher"
                        : "student"
                    }
                    entityId={session.user.id}
                    subject={subject}
                    callback={() => setReloadTable(new Date())}
                  />
                ) : (
                  <></>
                )}

                {session?.user?.email.includes("admin") ? (
                  <>
                    <ModalEditDeleteActions
                      entityData={subject}
                      onCallback={() => setReloadTable(new Date())}
                      action="edit"
                      typeEntity="subject"
                      recordTitle={subject.topic}
                    />
                    <ModalEditDeleteActions
                      entityData={subject}
                      onCallback={() => setReloadTable(new Date())}
                      action="delete"
                      typeEntity="subject"
                      recordTitle={subject.topic}
                    />
                  </>
                ) : (
                  <></>
                )}
              </Stack>
            ),
            grade: '10'
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

  useEffect(() => {
    console.log(subjectData)
  }, [subjectData])
  

  return (
    <MainPage
      columnsName={columns}
      entityData={subjectData}
      handleCallback={() => setReloadTable(new Date())}
    />
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: teachers } = await axios.get(
    `${process.env.APP_URL}/api/teachers`
  ); // Teachers data fetched

  return {
    props: {
      teachers: teachers,
    },
  };
};

export default Subjects;
