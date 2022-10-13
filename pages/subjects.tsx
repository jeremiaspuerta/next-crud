import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import axios from "axios";
import { HiPlusSm } from "react-icons/hi";
import { TypeSubject, TypeTeacher } from "types/types";
import {
  BUTTON_OPEN_FORM_SUBJECT,
  TITLE_MODAL_FORM_SUBJECT,
} from "constants/strings";
import FormSubject from "components/FormSubject";
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
    selector: (row: any) => `${row.Teacher.lastname.toUpperCase()}, ${row.Teacher.name.toUpperCase()}`,
  },
  {
    name: "Cost",
    selector: (row: any) => row.cost,
  },
];

type TypeModalFormSubject = {
  teachers_data: Array<TypeTeacher>;
};

function ModalFormSubject({ teachers_data }: TypeModalFormSubject) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={"blue"}
        leftIcon={<HiPlusSm size={"24px"} />}
      >
        {BUTTON_OPEN_FORM_SUBJECT}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>
            {TITLE_MODAL_FORM_SUBJECT}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormSubject onClose={onClose} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

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
    // <Container maxW={"container.xl"}>
    //   <Heading fontSize={"5xl"}>{router.pathname.replace("/", "")}</Heading>

    //   <Box bg={"gray.200"} rounded={"md"} p={5} mt={5}>
    //     <Flex flexDir={"column"} gap={5} alignItems={"flex-end"}>
    //       <ModalFormSubject teachers_data={teachers} />

    //       <DataTable columns={columns} data={subjects} striped={true} />
    //     </Flex>
    //   </Box>
    // </Container>
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
