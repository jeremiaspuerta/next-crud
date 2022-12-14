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
import { BUTTON_OPEN_FORM, TITLE_MODAL_FORM } from "src/constants/strings";
import { useRouter } from "next/router";
import DataTable from "react-data-table-component";
import { HiPlusSm } from "react-icons/hi";
import {

  TypeTeacher,
} from "src/types/types";
import FormTeacherStudent from "src/components/FormTeacherStudent";
import FormSubject from "./FormSubject";
import FormPayment from "./FormPayment";
import { useSession } from "next-auth/react";
import { ReactElement } from "react";

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
  const { data: session } = useSession();

  return (
    <>
      {session?.user?.email && (session.user.email.includes("admin") || session.user.email.includes("student"))  ? (
        <Button
          onClick={onOpen}
          colorScheme={"green"}
          leftIcon={<HiPlusSm size={"24px"} />}
        >
          {BUTTON_OPEN_FORM(entityType)}
        </Button>
      ) : (
        false
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{TITLE_MODAL_FORM(entityType)}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {["teacher", "student", "admin"].includes(entityType) ? (
              <FormTeacherStudent
                onClose={onClose}
                onCallback={() => onReloadTable()}
                defaultData={defaultData}
                typePerson={entityType}
              />
            ) : entityType == "subject" ? (
              <FormSubject
                onClose={onClose}
                onCallback={() => onReloadTable()}
                defaultData={defaultData}
              />
            ) : (
              <FormPayment
                onClose={onClose}
                onCallback={() => onReloadTable()}
                defaultData={defaultData}
              />
            )}
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
  breadcrumb?: ReactElement;
  title?: string;
  handleCallback: () => void;
};

const MainPage = ({
  entityData,
  columnsName,
  breadcrumb,
  title,
  handleCallback,
}: TypeMainPage) => {
  const toast = useToast();
  const router = useRouter();

  if(!title && router){
    title = router.pathname.replace("/", "");
  }

  return (
    <Container maxW={"container.xl"} mt={5} >
      {
        breadcrumb && breadcrumb
      }

      <Heading fontSize={"5xl"} mt={10}>{title}</Heading>

      <Box bg={"gray.200"} rounded={"md"} p={5} mt={5} shadow={'xl'}>
        <Flex flexDir={"column"} gap={5} alignItems={"flex-end"}>
          <ModalCreate
            onReloadTable={() => handleCallback()}
            entityType={router.pathname
              .replace("/", "")
              .toLowerCase()
              .slice(0, title ? title.length - 1 : 1)}
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
