import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import {
  INPUT_SELECT_DATA_EMPTY,
  REQUIRED_FIELD_ERROR,
  TOAST_ERROR_DESCRIPTION,
  TOAST_ERROR_TITLE,
  TOAST_SUCCESS_TITLE,
  TOAST_SUCCESS_UPDATED_TITLE,
} from "constants/messages";
import {
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_UPDATE,
  INPUT_PRICE_FORM_PAYMENT,
  INPUT_STUDENT_FORM_PAYMENT,
  INPUT_SUBJECT_FORM_PAYMENT,
} from "constants/strings";
import { useEffect, useState } from "react";
import { TypeStudent, TypeSubject, TypeTeacher } from "types/types";
import { SubmitHandler, useForm } from "react-hook-form";

type TypeFormPayment = {
  onClose: () => void;
  onCallback?: () => void;
  defaultData?: any;
  edit?: boolean;
};

type TypeInputsForm = {
  student_id: number | string;
  subject_id: number | string;
  price: number | string;
  created_at: Date | string;
};

export default function FormPayment({
  onClose,
  onCallback,
  defaultData,
  edit = false,
}: TypeFormPayment) {
  const [teachers, setTeachers] = useState<Array<TypeTeacher>>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TypeInputsForm>();

  const toast = useToast();
  const [submit, setSubmit] = useState(false);
  const [subjectsData, setSubjectsData] = useState<Array<any>>([]);
  const [studentsData, setStudentsData] = useState<Array<any>>([]);
  const [subjectFieldDisabled, setSubjectFieldDisabled] =
    useState<boolean>(true);
  const [priceFieldDisabled, setPriceFieldDisabled] = useState<boolean>(true);

  const onSubmit: SubmitHandler<TypeInputsForm> = async (data) => {
    setSubmit(!submit);

    if (data.student_id) data.student_id = parseInt(data.student_id as string);

    if (data.subject_id) data.subject_id = parseInt(data.subject_id as string);

    if (data.price) data.price = parseInt(data.price as string);

    if (edit) {
      axios
        .patch(`/api/payments/${defaultData.id}`, data)
        .then((response) => {
          onClose();
          toast({
            title: TOAST_SUCCESS_UPDATED_TITLE,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          if (onCallback) onCallback();
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
        .finally(() => setSubmit(false));
    } else {
      axios
        .post(`/api/payments`, data)
        .then((response) => {
          onClose();
          toast({
            title: TOAST_SUCCESS_TITLE,
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "top",
          });
          if (onCallback) onCallback();
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
        .finally(() => setSubmit(false));
    }
  };

  useEffect(() => {
    axios("/api/students")
      .then(({ data }) => setStudentsData(data))
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
  }, []);

  function handleChangeStudent(student_id: string){
    setValue('subject_id','');

    if (student_id) {

      axios(
        `/api/courses?where={ "student_id":{"$eq": ${student_id}} }&include=Subject`
      )
        .then(({ data }) => {
          const subjects = data.map(({Subject}: any) => ({id: Subject.id,value: Subject.topic}));

          setSubjectsData(subjects);
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
    }
  }

  function handleChangeSubject(subject_id: string){
    if(subject_id){
      axios(
        `/api/subjects/${subject_id}`
      )
        .then(({ data }) => {
          setValue('price',data.monthly_cost);

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
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex gap={7} flexDir={"column"}>
        {studentsData.length > 0 ? (
          <FormControl>
            <FormLabel>{INPUT_STUDENT_FORM_PAYMENT}</FormLabel>
            <Select
              placeholder="Select option"
              isInvalid={errors.student_id ? true : false}
              defaultValue={defaultData?.student_id}
              {...register("student_id", {
                required: REQUIRED_FIELD_ERROR,
              })}
              onChange={(event) => handleChangeStudent(event.currentTarget.value)}
            >
              {studentsData.map((student: TypeStudent) => (
                <option value={student.id} key={`${student.id}`}>
                  {student.lastname.toUpperCase()}, {student.name.toUpperCase()}
                </option>
              ))}
            </Select>
            {errors.student_id && (
              <FormHelperText color={"red"}>
                {errors.student_id.message}
              </FormHelperText>
            )}
          </FormControl>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Text>{INPUT_SELECT_DATA_EMPTY("student")}</Text>
          </Alert>
        )}

        {/* {subjectsData.length > 0 ? ( */}
          <FormControl>
            <FormLabel>{INPUT_SUBJECT_FORM_PAYMENT}</FormLabel>
            <Select
              placeholder="Select option"
              isInvalid={errors.subject_id ? true : false}
              defaultValue={defaultData?.subject_id}
              {...register("subject_id", {
                required: REQUIRED_FIELD_ERROR,
              })}
              onChange={(event) => handleChangeSubject(event.currentTarget.value)}
            >
              {subjectsData.map((subject: any) => (
                <option value={subject.id} key={`${subject.id}`}>
                  {subject.value.toUpperCase()}
                </option>
              ))}
            </Select>
            {errors.subject_id && (
              <FormHelperText color={"red"}>
                {errors.subject_id.message}
              </FormHelperText>
            )}
          </FormControl>
         {/* )
          : (
           <Alert status="info">
             <AlertIcon />
             <Text>{INPUT_SELECT_DATA_EMPTY("subject")}</Text>
           </Alert>
         )} */}

        <FormControl>
          <FormLabel>{INPUT_PRICE_FORM_PAYMENT}</FormLabel>
          <Input
            type="number"
            isInvalid={errors.price ? true : false}
            defaultValue={defaultData?.price}
            isReadOnly={true}
            {...register(INPUT_PRICE_FORM_PAYMENT, {
              required: REQUIRED_FIELD_ERROR,
            })}
          />
          {errors.price && (
            <FormHelperText color={"red"}>
              {errors.price.message}
            </FormHelperText>
          )}
        </FormControl>

        <Flex gap={2} flexDir={"row"} justifyContent={"flex-end"}>
          {!submit && (
            <Button variant="ghost" onClick={() => onClose()}>
              {BUTTON_CANCEL}
            </Button>
          )}
          <Button
            colorScheme="green"
            mr={3}
            type={"submit"}
            isLoading={submit}
            loadingText={edit ? "Updating..." : "Creating..."}
          >
            {edit ? BUTTON_UPDATE : BUTTON_ADD}
          </Button>
        </Flex>
      </Flex>
    </form>
  );
}
