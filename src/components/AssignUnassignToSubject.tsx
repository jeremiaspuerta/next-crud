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
} from "@chakra-ui/react";
import { FiUserPlus, FiUserMinus } from "react-icons/fi";
import { Tooltip } from "@chakra-ui/react";
import { TypeSubject } from "src/types/types";
import { BUTTON_CANCEL } from "src/constants/strings";
import { ASSIGN_UNASSIGN_SUBJECT_MODAL_DESCRIPTION } from "src/constants/stringsComponents";
import axios from "axios";

type TypeProps = {
  action: "assign" | "join" | "unassign";
  entityType: "teacher" | "student";
  entityId: number;
  subject: TypeSubject;
  course_id?: number;
  callback: () => void;
};

export default function AssignUnassignToSubject({
  action,
  entityType,
  entityId,
  subject,
  callback,
  course_id
}: TypeProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  function handleAction() {
    if (entityType == "teacher") {
      axios
        .patch(`/api/subjects/${subject.id}`, {
          teacher_id: ["assign","join"].includes(action)  ? entityId : null,
        })
        .then((res) => {
          onClose();
          callback();
        })
        .catch((err) => console.error("error"));
    }else if(course_id){

      if(action === "join"){

      }else{
        axios
        .delete(`/api/course/${course_id}`)
        .then((res) => {
          onClose();
          callback();
        })
        .catch((err) => console.error("error"));
      }

    }
  }

  return (
    <>
      <Tooltip textTransform={"capitalize"} label={action}>
        <Button
          onClick={onOpen}
          colorScheme={["assign","join"].includes(action) ? "green" : "red"}
          variant="solid"
          size={"sm"}
        >
          {["assign","join"].includes(action) ? <FiUserPlus /> : <FiUserMinus />}
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
              colorScheme={["assign","join"].includes(action) ? "green" : "red"}
              mr={3}
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
