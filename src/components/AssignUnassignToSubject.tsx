import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";
import { Tooltip } from "@chakra-ui/react";
import { TypeSubject } from "src/types/types";
import { BUTTON_CANCEL } from "src/constants/strings";
import { ASSIGN_UNASSIGN_SUBJECT_MODAL_DESCRIPTION } from "src/constants/stringsComponents";
import axios from "axios";
import { TOAST_ERROR_DESCRIPTION, TOAST_ERROR_TITLE, TOAST_SUCCESS_JOIN_ASSIGN_SUBJECT } from "src/constants/messages";

type TypeProps = {
  action: "assign" | "join" | "unassign";
  entityType: "teacher" | "student";
  entityId: number;
  subject: TypeSubject;
  callback: () => void;
};

export default function AssignUnassignToSubject({
  action,
  entityType,
  entityId,
  subject,
  callback,
}: TypeProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function handleAction() {
    if (entityType == "teacher") {
      axios
        .patch(`/api/subjects/${subject.id}`, {
          teacher_id: ["assign", "join"].includes(action) ? entityId : null,
        })
        .then((res) => {

          onClose();
          callback();
        })
        .catch((err) => console.error("error"));
    } else {
      if (action === "join") {
        axios
          .post(`/api/courses`, {
            student_id: entityId,
            subject_id: subject.id,
          })
          .then((res) => {
            toast({
              title: TOAST_SUCCESS_JOIN_ASSIGN_SUBJECT(subject.topic),
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top",
            }); 
            onClose();
            callback();
          })
          .catch((err) => {
            toast({
              title: TOAST_ERROR_TITLE,
              description: TOAST_ERROR_DESCRIPTION,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "top",
            })
            onClose();
            callback();
          });
      }
    }
  }

  return (
    <>
      <Tooltip textTransform={"capitalize"} label={action}>
        <Button
          onClick={onOpen}
          colorScheme={["assign", "join"].includes(action) ? "green" : "red"}
          variant="solid"
          size={"sm"}
        >
          {["assign", "join"].includes(action) ? (
            <FiUserPlus />
          ) : (
            <FiUserMinus />
          )}
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>
            {action} to {subject.topic}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={"center"}>
            {ASSIGN_UNASSIGN_SUBJECT_MODAL_DESCRIPTION(action, subject.topic)}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              {BUTTON_CANCEL}
            </Button>
            <Button
              colorScheme={
                ["assign", "join"].includes(action) ? "green" : "red"
              }
              ml={3}
              onClick={() => handleAction()}
            >
              {action}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
