import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { TypeStudent } from "src/types/types";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

type TypeProps = {
  course_id: string;
  student: TypeStudent;
  currentGrade: string;
  callback: () => void;
};

type Inputs = {
  grade: string;
};

export default function ModalChangeGrade({
  course_id,
  student,
  currentGrade,
  callback,
}: TypeProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) =>
    axios
      .patch(`/api/courses/${course_id}`, {
        grade: parseInt(data.grade),
      })
      .then((res) => {
        callback();
        onClose();
      })
      .catch((err) => console.error(err));

  return (
    <>
      <Link onClick={onOpen} color={"teal.400"} fontWeight={"bold"}>
        {currentGrade || "none"}
      </Link>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform={"capitalize"}>
            {`${student.name} ${student.lastname}`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl>
                <FormLabel>Grade</FormLabel>
                <Input
                  type="number"
                  defaultValue={currentGrade}
                  placeholder={"8.5"}
                  autoFocus={true}
                  {...register("grade", {
                    max: 10,
                    min: 1,
                  })}
                />

                {errors.grade && (
                  <FormHelperText color={"red"}>
                    The grade must be between 1 and 10
                  </FormHelperText>
                )}
              </FormControl>

              <Box textAlign={'end'}>
                <Button mt={7} colorScheme="teal" type="submit">
                  Update
                </Button>
              </Box>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
