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
} from "src/constants/messages";
import {
  BUTTON_ADD,
  BUTTON_CANCEL,
  BUTTON_UPDATE,
  INPUT_COST_FORM_SUBJECT,
  INPUT_DESCRIPTION_FORM_SUBJECT,
  INPUT_PERIOD_FORM_SUBJECT,
  INPUT_TEACHER_FORM_SUBJECT,
  INPUT_TOPIC_FORM_SUBJECT,
} from "src/constants/strings";
import { useEffect, useState } from "react";
import { TypeSubject, TypeTeacher } from "src/types/types";
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
  edit = false,
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

  const onSubmit: SubmitHandler<TypeSubject> = async (data) => {
    setSubmit(!submit);

    if (data.teacher_id) {
      data.teacher_id = parseInt(data.teacher_id as string);
    }else{
      delete data.teacher_id;
    }

    if (data.monthly_cost)
      data.monthly_cost = parseInt(data.monthly_cost as string);

    if (data.period)
      data.period = data.period.replaceAll(' ','_');

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
            {...register("topic", {
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
          <FormLabel>{INPUT_PERIOD_FORM_SUBJECT}</FormLabel>
          {/* <Input
            type="text"
            isInvalid={errors.period ? true : false}
            defaultValue={defaultData?.period}

            {...register('period', {
              required: REQUIRED_FIELD_ERROR,
            })}
          /> */}

          <Select
            placeholder="Select option"
            isInvalid={errors.period ? true : false}
            defaultValue={defaultData?.period && defaultData.period.replaceAll(' ','_')}
            {...register('period', {
              required: REQUIRED_FIELD_ERROR,
            })}
          >
            {['first semester','second semester','annually'].map((period: string) => (
              <option value={period.replaceAll(' ','_')} key={period}>
                {period.toUpperCase()}
              </option>
            ))}
          </Select>

          {errors.period && (
            <FormHelperText color={"red"}>
              {errors.period.message}
            </FormHelperText>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>{INPUT_COST_FORM_SUBJECT}</FormLabel>
          <Input
            type="number"
            isInvalid={errors.monthly_cost ? true : false}
            defaultValue={defaultData?.monthly_cost}
            {...register("monthly_cost", {
              required: REQUIRED_FIELD_ERROR,
            })}
          />
          {errors.monthly_cost && (
            <FormHelperText color={"red"}>
              {errors.monthly_cost.message}
            </FormHelperText>
          )}
        </FormControl>

        {teachers.length > 0 ? (
          <FormControl>
            <FormLabel>{INPUT_TEACHER_FORM_SUBJECT}</FormLabel>
            <Select
              placeholder="Select option"
              isInvalid={errors.teacher_id ? true : false}
              defaultValue={defaultData?.teacher_id}
              {...register("teacher_id")}
            >
              {teachers.map((teacher: TypeTeacher) => (
                <option value={teacher.id} key={`${teacher.id}`}>
                  {teacher.lastname.toUpperCase()}, {teacher.name.toUpperCase()}
                </option>
              ))}
            </Select>
            {/* {errors.teacher_id && (
              <FormHelperText color={"red"}>
                {errors.teacher_id.message}
              </FormHelperText>
            )} */}
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
