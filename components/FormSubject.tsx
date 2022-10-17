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
  INPUT_TEACHER_DATA_EMPTY,
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
  INPUT_COST_FORM_SUBJECT,
  INPUT_DESCRIPTION_FORM_SUBJECT,
  INPUT_DURATION_FORM_SUBJECT,
  INPUT_TEACHER_FORM_SUBJECT,
  INPUT_TOPIC_FORM_SUBJECT,
} from "constants/strings";
import { useEffect, useState } from "react";
import { TypeSubject, TypeTeacher } from "types/types";
import { SubmitHandler, useForm } from "react-hook-form";

type TypeFormSubject = {
  onClose: () => void;
  onCallback?: () => void;
  defaultData: any;
  edit?: boolean;
};

export default function FormSubject({
  onClose,
  onCallback,
  defaultData,
  edit = false
}: TypeFormSubject) {
  const [teachers, setTeachers] = useState<Array<TypeTeacher>>([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TypeSubject>();

  const toast = useToast();
  const [submit, setSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit: SubmitHandler<TypeSubject> = async (data) => {
    setSubmit(!submit);

    if (data.teacher_id) data.teacher_id = parseInt(data.teacher_id as string);

    if (data.monthly_cost) data.monthly_cost = parseInt(data.monthly_cost as string);

    if (data.duration_in_months) data.duration_in_months = parseInt(data.duration_in_months as string);

    if (edit) {
        axios
          .patch(`/api/subjects/${defaultData.id}`, data)
          .then((response) => {
            onClose();
            toast({
              title: TOAST_SUCCESS_UPDATED_TITLE,
              status: "success",
              duration: 5000,
              isClosable: true,
              position: "top",
            });
            if(onCallback)
                onCallback();
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
        .post(`/api/subjects`, data)
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
    axios
      .get(`/api/teachers?include=Subject`)
      .then(({ data }) => setTeachers(data))
      .catch((error) => console.error(error));
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex gap={7} flexDir={"column"}>
        <FormControl>
          <FormLabel>{INPUT_TOPIC_FORM_SUBJECT}</FormLabel>
          <Input
            type="text"
            isInvalid={errors.topic ? true : false}
            defaultValue={defaultData?.topic}

            {...register(INPUT_TOPIC_FORM_SUBJECT, {
              required: REQUIRED_FIELD_ERROR,
            })}
          />
          {errors.topic && (
            <FormHelperText color={"red"}>
              {errors.topic.message}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>{INPUT_DESCRIPTION_FORM_SUBJECT}</FormLabel>
          <Input
            type="text"
            isInvalid={errors.description ? true : false}
            defaultValue={defaultData?.description}
            {...register(INPUT_DESCRIPTION_FORM_SUBJECT, {
              required: REQUIRED_FIELD_ERROR,
            })}
          />
          {errors.description && (
            <FormHelperText color={"red"}>
              {errors.description.message}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>{INPUT_DURATION_FORM_SUBJECT}</FormLabel>
          <Input
            type="number"
            isInvalid={errors.duration_in_months ? true : false}
            defaultValue={defaultData?.duration_in_months}

            {...register('duration_in_months', {
              required: REQUIRED_FIELD_ERROR,
            })}
          />
          {errors.duration_in_months && (
            <FormHelperText color={"red"}>{errors.duration_in_months.message}</FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>{INPUT_COST_FORM_SUBJECT}</FormLabel>
          <Input
            type="number"
            isInvalid={errors.monthly_cost ? true : false}
            defaultValue={defaultData?.monthly_cost}

            {...register('monthly_cost', {
              required: REQUIRED_FIELD_ERROR,
            })}
          />
          {errors.monthly_cost && (
            <FormHelperText color={"red"}>{errors.monthly_cost.message}</FormHelperText>
          )}
        </FormControl>

        {teachers.length > 0 ? (
          <FormControl>
            <FormLabel>{INPUT_TEACHER_FORM_SUBJECT}</FormLabel>
            <Select
              placeholder="Select option"
              isInvalid={errors.teacher_id ? true : false}
              defaultValue={defaultData?.teacher_id}
              {...register("teacher_id", {
                required: REQUIRED_FIELD_ERROR,
              })}
            >
              {teachers.map((teacher: TypeTeacher) => (
                <option value={teacher.id} key={`${teacher.id}`} >
                  {teacher.lastname.toUpperCase()}, {teacher.name.toUpperCase()}
                </option>
              ))}
            </Select>
            {errors.teacher_id && (
              <FormHelperText color={"red"}>
                {errors.teacher_id.message}
              </FormHelperText>
            )}
          </FormControl>
        ) : (
          <Alert status="info">
            <AlertIcon />
            <Text>{INPUT_TEACHER_DATA_EMPTY}</Text>
          </Alert>
        )}

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
