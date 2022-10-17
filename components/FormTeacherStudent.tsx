import { Button, Flex, FormControl, FormHelperText, FormLabel, Input, InputGroup, InputRightElement, useToast } from "@chakra-ui/react";
import axios from "axios";
import { EMAIL_FIELD_ERROR_PERSON, INPUT_MIN_LENGTH_ERROR, REQUIRED_FIELD_ERROR, TOAST_ERROR_DESCRIPTION, TOAST_ERROR_TITLE, TOAST_SUCCESS_TITLE, TOAST_SUCCESS_UPDATED_TITLE } from "constants/messages";
import { BUTTON_ADD, BUTTON_CANCEL, BUTTON_UPDATE, INPUT_DOCUMENT_NUMBER_FORM_PERSON, INPUT_EMAIL_FORM_PERSON, INPUT_LASTNAME_FORM_PERSON, INPUT_NAME_FORM_PERSON, INPUT_PASSWORD_FORM_PERSON, INPUT_SUBJECT_FORM_PERSON } from "constants/strings";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type TypeFormTeacherStudent = {
    defaultData?: any;
    onClose: () => void;
    onCallback?: () => void;
    edit?: boolean;
    typePerson: string;
}

type TypeInputsForm = {
    name: string;
    lastname: string;
    document_number: number;
    email: string;
    password?: string;
  };

export default function FormTeacherStudent({
    defaultData,
    onClose,
    onCallback,
    edit = false,
    typePerson,
  }: TypeFormTeacherStudent) {
    const toast = useToast();
    const [submit, setSubmit] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
  
    const handleShowPassword = () => setShowPassword(!showPassword);
  
    const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
    } = useForm<TypeInputsForm>();
  
    const onSubmit: SubmitHandler<TypeInputsForm> = async (data) => {
      setSubmit(!submit);
  
      if (edit && defaultData) {
        if (!data.password) {
          delete data.password;
        }
  
        axios
          .patch(`/api/${typePerson}s/${defaultData.id}`, data)
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
          .post(`/api/${typePerson}s`, data)
          .then((response) => {
            onClose();
            toast({
              title: TOAST_SUCCESS_TITLE,
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
      }
    };

    const regex = typePerson == 'teacher' ? /^[\w-\.]+@(teacher+\.)+[\w-]{2,4}$/g : typePerson == 'admin' ? /^[\w-\.]+@(admin+\.)+[\w-]{2,4}$/g : /^[\w-\.]+@(student+\.)+[\w-]{2,4}$/g;
  
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex gap={7} flexDir={"column"}>
          <FormControl>
            <FormLabel>{INPUT_NAME_FORM_PERSON}</FormLabel>
            <Input
              autoFocus={true}
              isInvalid={errors.name ? true : false}
              defaultValue={defaultData?.name}
              {...register(INPUT_NAME_FORM_PERSON, {
                required: REQUIRED_FIELD_ERROR,
              })}
              autoComplete={"false"}
            />
            {errors.name && (
              <FormHelperText color={"red"}>{errors.name.message}</FormHelperText>
            )}
          </FormControl>
  
          <FormControl>
            <FormLabel>{INPUT_LASTNAME_FORM_PERSON}</FormLabel>
            <Input
              defaultValue={defaultData?.lastname}
              isInvalid={errors.lastname ? true : false}
              {...register(INPUT_LASTNAME_FORM_PERSON, {
                required: REQUIRED_FIELD_ERROR,
              })}
              autoComplete={"off"}
            />
            {errors.lastname && (
              <FormHelperText color={"red"}>
                {errors.lastname.message}
              </FormHelperText>
            )}
          </FormControl>
  
          <FormControl>
            <FormLabel>{INPUT_DOCUMENT_NUMBER_FORM_PERSON}</FormLabel>
            <Input
              defaultValue={defaultData?.document_number}
              isInvalid={errors.document_number ? true : false}
              type={"number"}
              {...register("document_number", { required: REQUIRED_FIELD_ERROR })}
              autoComplete={"off"}
            />
            {errors.document_number && (
              <FormHelperText color={"red"}>
                {errors.document_number.message}
              </FormHelperText>
            )}
          </FormControl>


          {/* <FormControl>
            <FormLabel>{INPUT_SUBJECT_FORM_PERSON}</FormLabel>
            <Input
              defaultValue={defaultData?.document_number}
              isInvalid={errors.document_number ? true : false}
              type={"number"}
              {...register("subject_id", { required: REQUIRED_FIELD_ERROR })}
              autoComplete={"off"}
            />
            {errors.document_number && (
              <FormHelperText color={"red"}>
                {errors.document_number.message}
              </FormHelperText>
            )}
          </FormControl> */}
  
          <FormControl>
            <FormLabel>{INPUT_EMAIL_FORM_PERSON}</FormLabel>
            <Input
              defaultValue={defaultData?.email}
              isInvalid={errors.email ? true : false}
              {...register("email", {
                required: REQUIRED_FIELD_ERROR,
                pattern: {
                  value: regex,
                  message: EMAIL_FIELD_ERROR_PERSON(typePerson),
                },
              })}
              autoComplete={"off"}
            />
            {errors.email && (
              <FormHelperText color={"red"}>
                {errors.email.message}
              </FormHelperText>
            )}
          </FormControl>
  
          <FormControl>
            <FormLabel>{INPUT_PASSWORD_FORM_PERSON}</FormLabel>
            <InputGroup>
              <Input
                isInvalid={errors.password ? true : false}
                type={showPassword ? "text" : "password"}
                {...register(INPUT_PASSWORD_FORM_PERSON, {
                  required: edit ? false : REQUIRED_FIELD_ERROR,
                  minLength: { value: 8, message: INPUT_MIN_LENGTH_ERROR },
                })}
                autoComplete={"off"}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
                  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                </Button>
              </InputRightElement>
            </InputGroup>
  
            {edit && (
              <FormHelperText>
                Put a new password if you want to change it
              </FormHelperText>
            )}
  
            {errors.password && (
              <FormHelperText color={"red"}>
                {errors.password.message}
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