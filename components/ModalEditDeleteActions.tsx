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
import axios from "axios";
import {
  TOAST_ERROR_DESCRIPTION,
  TOAST_ERROR_TITLE,
  TOAST_INFO_DELETE_TITLE,
} from "constants/messages";
import {
  BUTTON_CANCEL,
  BUTTON_DELETE,
  DELETE_MODAL_TITLE,
  EDIT_MODAL_TITLE,
} from "constants/strings";
import { DELETE_MODAL_DESCRIPTION } from "constants/stringsComponents";
import { BsTrash } from "react-icons/bs";
import { FaPencilAlt } from "react-icons/fa";
import { TypeAdmin, TypePayment, TypeStudent, TypeSubject, TypeTeacher } from "types/types";
import FormPayment from "./FormPayment";
import FormTeacherStudent from "./FormTeacherStudent";
import FormSubject from "./FormSubject";

type TypeModalEditDeleteActions = {
  action: "edit" | "delete" | "read";
  entityData: TypeTeacher | TypeStudent | TypeAdmin | TypeSubject | TypePayment;
  typeEntity: string;
  onCallback?: () => void;
  recordTitle: string;
};

export const ModalEditDeleteActions = ({
  action,
  entityData,
  typeEntity,
  onCallback,
  recordTitle,
}: TypeModalEditDeleteActions) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteRecord = () => {
    axios
      .delete(`/api/${typeEntity}s/${entityData.id}`)
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
      .finally(() => onCallback && onCallback());
  };

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme={action == "delete" ? "red" : "blue"}
        variant="solid"
        size={"sm"}
      >
        {action == "edit" ? <FaPencilAlt /> : action == "delete" && <BsTrash />}
      </Button>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        isCentered={action == "delete" ? true : false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {action == "edit"
              ? EDIT_MODAL_TITLE
              : action == "delete" && DELETE_MODAL_TITLE}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={5} textAlign={action == "delete" ? "center" : "start"}>
            {action == "delete" ? (
              <>
                {DELETE_MODAL_DESCRIPTION(`${recordTitle}`)}

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
              </>
            ) : action == "edit" &&
              ["teacher", "student", "admin"].includes(typeEntity) ? (
              <FormTeacherStudent
                onClose={onClose}
                typePerson={typeEntity}
                defaultData={entityData}
                edit={true}
                onCallback={onCallback}
              />
            ) : typeEntity == 'subject' ? (
              <FormSubject
                onClose={onClose}
                defaultData={entityData}
                edit={true}
                onCallback={onCallback}
              />
            ) : <FormPayment onClose={onClose} defaultData={entityData} edit={true} onCallback={onCallback}/>}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
