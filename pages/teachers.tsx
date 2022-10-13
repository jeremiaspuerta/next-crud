import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  BUTTON_CANCEL,
  BUTTON_DELETE,
  BUTTON_OPEN_FORM_TEACHER,
  DELETE_MODAL_TITLE,
  EDIT_MODAL_TITLE,
  TITLE_MODAL_FORM_TEACHER,
} from "constants/strings";
import { useRouter } from "next/router";
import DataTable from "react-data-table-component";
import { HiPlusSm } from "react-icons/hi";
import {
  TOAST_ERROR_DESCRIPTION,
  TOAST_ERROR_TITLE,
  TOAST_INFO_DELETE_TITLE,
} from "constants/messages";
import axios from "axios";
import { useEffect, useState } from "react";
import { TypeSubject, TypeTeacher } from "types/types";
import { BsTrash } from "react-icons/bs";
import { FaRegEye, FaPencilAlt } from "react-icons/fa";
import { DELETE_MODAL_DESCRIPTION } from "constants/stringsComponents";
import dayjs from "dayjs";
import uniqolor from "uniqolor";
import FormPerson from "components/FormPerson";

type TypeModalFormSubject = {
  defaultData?: TypeTeacher;
  onReloadTable: () => void;
};

type TypeModalDelete = {
  teacherData: TypeTeacher;
  onReloadTable: () => void;
};

type TypeModalEdit = {
  teacherData: TypeTeacher;
  onReloadTable: () => void;
};

type TypeModalShow = {
  teacherData: TypeTeacher;
};

function ModalCreate({ defaultData, onReloadTable }: TypeModalFormSubject) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={"blue"}
        leftIcon={<HiPlusSm size={"24px"} />}
      >
        {BUTTON_OPEN_FORM_TEACHER}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{TITLE_MODAL_FORM_TEACHER}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormPerson
              onClose={onClose}
              onReloadTable={() => onReloadTable()}
              defaultData={defaultData}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

const ModalDelete = ({ teacherData, onReloadTable }: TypeModalDelete) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteRecord = () => {
    axios
      .delete(`/api/teachers/${teacherData.id}`)
      .then((response) => {
        toast({
          title: TOAST_INFO_DELETE_TITLE,
          status: "info",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
        onClose();
      })
      .catch((error) => {
        toast({
          title: TOAST_ERROR_TITLE,
          description: TOAST_ERROR_DESCRIPTION,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => onReloadTable());
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="red" size={"sm"}>
        <BsTrash />
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{DELETE_MODAL_TITLE}</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={"center"}>
            {DELETE_MODAL_DESCRIPTION(
              `${teacherData.name} ${teacherData.lastname}`
            )}

            <Stack
              mt={5}
              placeContent={"center"}
              direction="row"
              spacing={4}
              align="center"
            >
              <Button
                colorScheme="gray"
                variant="outline"
                size={"sm"}
                onClick={onClose}
              >
                {BUTTON_CANCEL}
              </Button>
              <Button
                colorScheme="red"
                variant="solid"
                size={"sm"}
                onClick={handleDeleteRecord}
              >
                {BUTTON_DELETE}
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const ModalEdit = ({ teacherData, onReloadTable }: TypeModalEdit) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" variant="solid" size={"sm"}>
        <FaPencilAlt />
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{EDIT_MODAL_TITLE}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormPerson
              onClose={onClose}
              onReloadTable={onReloadTable}
              defaultData={teacherData}
              edit={true}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const ModalShow = ({ teacherData }: TypeModalShow) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log(teacherData.Subject);

  return (
    <>
      <Button onClick={onOpen} colorScheme="teal" variant="solid" size={"sm"}>
        <FaRegEye />
      </Button>

      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody p={5}>
            <Box textAlign={'center'}>
              <Avatar
                size={"2xl"}
                src={`https://avatars.dicebear.com/api/bottts/${teacherData.email}.svg?r=50&scale=83`}
              />
            </Box>

            <Box textAlign='center'>
              <Text fontSize={'2xl'}  mt={5} fontWeight='bold'>{teacherData.name} {teacherData.lastname}</Text>
              <Text fontSize={'xs'} color={'gray.500'} mt={2}>{teacherData.email}</Text>

              <Stack spacing={2} direction={'row'} mt={5} justifyContent={'center'}>
                {teacherData.Subject.map((subject: TypeSubject) => <Tag style={{backgroundColor: uniqolor(subject.topic, {
                  lightness: 80
                }).color}} key={subject.id}>{subject.topic}</Tag>)}
              </Stack>

              <Tag mt={10} fontSize={'xs'}>Created on {dayjs(teacherData.created_at).format("DD/MM/YYYY")}</Tag>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

const customStyles = {
  rows: {
    style: {
      minHeight: "60px", // override the row height
    },
  },
  headCells: {
    style: {
      fontWeight: "bold",
      paddingTop: "40px",
      paddingBottom: "25px",
      textAlign: "center",
    },
  },
};

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
  const router = useRouter();
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
                <ModalShow teacherData={teacher} />

                <ModalEdit
                  teacherData={teacher}
                  onReloadTable={() => setReloadTable(new Date())}
                />

                <ModalDelete
                  teacherData={teacher}
                  onReloadTable={() => setReloadTable(new Date())}
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
    <Container maxW={"container.xl"}>
      <Heading fontSize={"5xl"}>{router.pathname.replace("/", "")}</Heading>

      <Box bg={"gray.200"} rounded={"md"} p={5} mt={5}>
        <Flex flexDir={"column"} gap={5} alignItems={"flex-end"}>
          <ModalCreate onReloadTable={() => setReloadTable(new Date())} />

          <DataTable
            columns={columns}
            data={teacherData}
            striped={true}
            pagination={true}
            customStyles={customStyles}
          />
        </Flex>
      </Box>
    </Container>
  );
};

export default Teachers;
