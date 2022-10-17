import {
  Stack,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { TypeSubject, TypeTeacher } from "types/types";
import MainPage from "components/MainPage";
import { useEffect, useState } from "react";
import { ModalEditDeleteActions } from "components/ModalEditDeleteActions";
import { TOAST_ERROR_DESCRIPTION, TOAST_ERROR_TITLE } from "constants/messages";

const columns = [
  {
    name: "Actions",
    selector: (row: any) => row.actions,
  },
  {
    name: "Topic",
    selector: (row: any) => row.topic,
  },
  {
    name: "Description",
    selector: (row: any) => row.description,
  },
  {
    name: "Teacher",
    selector: (row: any) => row.Teacher ? `${row.Teacher.lastname.toUpperCase()}, ${row.Teacher.name.toUpperCase()}` : <Tag>Not Selected</Tag>,
  },
  {
    name: "Duration",
    selector: (row: any) => `${row.duration_in_months} months`,
  },
  {
    name: "Cost (per month)",
    selector: (row: any) => `$${row.monthly_cost}`,
  },
];


type PropData = {
  subjects: Array<TypeSubject>;
  teachers: Array<TypeTeacher>;
};

const Subjects = ({ subjects, teachers }: PropData) => {
  const toast = useToast();
  const [subjectData, setSubjectData] = useState<Array<TypeSubject>>([]);
  const [reloadTable, setReloadTable] = useState<Date>(new Date());

  useEffect(() => {
    axios
      .get("/api/subjects?include=Teacher")
      .then(({ data }) => {
        setSubjectData(
          data.map((subject: TypeSubject) => ({
            ...subject,
            actions: (
              <Stack direction="row" spacing={2} align="center">
                {/* <ModalShowDetails 
                    imageSeed={subject.email}
                    title={subject.name}
                    subtitle={subject.email}
                    items={student.Subject.length > 0 ? student.Subject.map((subject: TypeSubject) =>({id: subject.id, label: subject.topic})) : []}
                /> */}

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
