import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import { GetServerSideProps } from "next";
import axios from "axios";
import { HiPlusSm } from "react-icons/hi";
import { TypeTeacher } from "types/types";
import { useRouter } from "next/router";
import {
  BUTTON_OPEN_FORM_SUBJECT,
  INPUT_COST_FORM_SUBJECT,
  INPUT_DESCRIPTION_FORM_SUBJECT,
  INPUT_TEACHER_FORM_SUBJECT,
  INPUT_TOPIC_FORM_SUBJECT,
  TITLE_MODAL_FORM_SUBJECT,
} from "constants/strings";
import { INPUT_TEACHER_DATA_EMPTY } from "constants/messages";

const columns = [
  {
    name: "Topic",
    selector: (row: any) => row.topic,
  },
  {
    name: "Description",
    selector: (row: any) => row.description,
  },
  {
    name: "Cost",
    selector: (row: any) => row.cost,
  },
];

type TypeFormSubject = {
  onClose: () => void;
  teachers_data: Array<TypeTeacher>;
};

function FormSubject({ onClose, teachers_data }: TypeFormSubject) {
  return (
    <Flex gap={7} flexDir={"column"}>
      <FormControl>
        <FormLabel>{INPUT_TOPIC_FORM_SUBJECT}</FormLabel>
        <Input type="text" name="topic" />
      </FormControl>

      <FormControl>
        <FormLabel>{INPUT_DESCRIPTION_FORM_SUBJECT}</FormLabel>
        <Input type="text" name="description" />
      </FormControl>

      <FormControl>
        <FormLabel>{INPUT_COST_FORM_SUBJECT}</FormLabel>
        <Input type="number" name="cost" />
      </FormControl>

      {teachers_data.length > 0 ? (
        <FormControl>
          <FormLabel>{INPUT_TEACHER_FORM_SUBJECT}</FormLabel>
          <Select placeholder="Select option" name="id">
            {teachers_data.map((teacher: TypeTeacher) => (
              <option value={`${teacher.id}`}>
                {teacher.lastname.toUpperCase()}, {teacher.name.toUpperCase()}
              </option>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Alert status="info">
          <AlertIcon />
          <Text>
            {INPUT_TEACHER_DATA_EMPTY}
          </Text>
        </Alert>
      )}

      <Flex gap={2} flexDir={"row"} justifyContent={"flex-end"}>
        <Button variant="ghost" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button colorScheme="blue" mr={3}>
          Add
        </Button>
      </Flex>
    </Flex>
  );
}

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
            <FormSubject onClose={onClose} teachers_data={teachers_data} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

type PropData = {
  subjects: Array<object>;
  teachers: Array<TypeTeacher>;
};

const Subjects = ({ subjects, teachers }: PropData) => {
  const router = useRouter();

  return (
    <Container maxW={"container.xl"}>
      <Heading fontSize={"5xl"}>{router.pathname.replace("/", "")}</Heading>

      <Box bg={"gray.200"} rounded={"md"} p={5} mt={5}>
        <Flex flexDir={"column"} gap={5} alignItems={"flex-end"}>
          <ModalFormSubject teachers_data={teachers} />

          <DataTable columns={columns} data={subjects} striped={true} />
        </Flex>
      </Box>
    </Container>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { data: subjects } = await axios.get(
    `${process.env.APP_URL}/api/subjects`
  ); // Subjects data fetched
  const { data: teachers } = await axios.get(
    `${process.env.APP_URL}/api/teachers`
  ); // Teachers data fetched

  return {
    props: {
      subjects: subjects,
      teachers: teachers,
    },
  };
};

export default Subjects;
