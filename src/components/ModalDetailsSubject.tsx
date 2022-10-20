import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import { TypeSubject } from "src/types/types";
import { AiOutlineEye } from "react-icons/ai";

type TypeProps = {
  entityType: "teacher";
  subject: TypeSubject;
};

export default function ModalDetailsSubject({
  entityType,
  subject,
}: TypeProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  return (
    <>
      <Tooltip textTransform={"capitalize"} label={'details'}>
        <Button
          onClick={onOpen}
          colorScheme={"blue"}
          variant="solid"
          size={"sm"}
        >
          <AiOutlineEye />
        </Button>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>
            {subject.topic}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={"center"}>
          </ModalBody>

        </ModalContent>
      </Modal>
    </>
  );
}
