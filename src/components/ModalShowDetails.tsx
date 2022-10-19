import {
  Avatar,
  Box,
  Button,
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
import axios from "axios";
import {
  TOAST_ERROR_DESCRIPTION,
  TOAST_ERROR_TITLE,
  TOAST_INFO_DELETE_TITLE,
} from "src/constants/messages";
import {
  BUTTON_CANCEL,
  BUTTON_DELETE,
  DELETE_MODAL_TITLE,
  EDIT_MODAL_TITLE,
} from "src/constants/strings";
import { DELETE_MODAL_DESCRIPTION } from "src/constants/stringsComponents";
import dayjs from "dayjs";
import { BsTrash } from "react-icons/bs";
import { FaPencilAlt, FaRegEye } from "react-icons/fa";
import { TypeAdmin, TypeCardProfile, TypeStudent, TypeSubject, TypeTeacher } from "src/types/types";
import FormTeacherStudent from "./FormTeacherStudent";
import uniqolor from "uniqolor";
import CardProfile from "./CardProfile";


export const ModalShowDetails = ({
  imageSeed,
  title,
  subtitle,
  description,
  items = [],
}: TypeCardProfile) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} colorScheme={"teal"} variant="solid" size={"sm"}>
        <FaRegEye />
      </Button>

      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={5}>
            <CardProfile
              imageSeed={imageSeed}
              title={title}
              subtitle={subtitle}
              description={description}
              items={items}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
