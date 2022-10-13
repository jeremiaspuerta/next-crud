import {
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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  BUTTON_OPEN_FORM,
  TITLE_MODAL_FORM,
} from "constants/strings";
import { useRouter } from "next/router";
import DataTable from "react-data-table-component";
import { HiPlusSm } from "react-icons/hi";
import { TypeAdmin, TypeStudent, TypeSubject, TypeTeacher } from "types/types";
import FormPerson from "components/FormPerson";
import { ReactElement } from "react";
import FormSubject from "./FormSubject";

type TypeModalFormSubject = {
  defaultData?: TypeTeacher;
  onReloadTable: () => void;
  entityType: string;
};

function ModalCreate({
  defaultData,
  onReloadTable,
  entityType,
}: TypeModalFormSubject) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={"green"}
        leftIcon={<HiPlusSm size={"24px"} />}
      >
        {BUTTON_OPEN_FORM(entityType)}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{TITLE_MODAL_FORM(entityType)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            
            {
              ['teacher','student','admin'].includes(entityType) ?             <FormPerson
              onClose={onClose}
              onCallback={() => onReloadTable()}
              defaultData={defaultData}
              typePerson={entityType}
            /> : <FormSubject onClose={onClose} />
            }

          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

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

type TypeColumnsName = {
  name: string;
  selector: any;
};

type TypeMainPage = {
  entityData: any;
  columnsName: Array<TypeColumnsName>;
  handleCallback: () => void;
};

const MainPage = ({
  entityData,
  columnsName,
  handleCallback,
}: TypeMainPage) => {
  const toast = useToast();
  const router = useRouter();

  return (
    <Container maxW={"container.xl"}>
      <Heading fontSize={"5xl"}>{router.pathname.replace("/", "")}</Heading>

      <Box bg={"gray.200"} rounded={"md"} p={5} mt={5}>
        <Flex flexDir={"column"} gap={5} alignItems={"flex-end"}>
          <ModalCreate
            onReloadTable={() => handleCallback()}
            entityType={router.pathname
              .replace("/", "")
              .toLowerCase()
              .slice(0, router.pathname.replace("/", "").length - 1)}
          />

          <DataTable
            columns={columnsName}
            data={entityData}
            striped={true}
            pagination={true}
            customStyles={customStyles}
          />
        </Flex>
      </Box>
    </Container>
  );
};

export default MainPage;
