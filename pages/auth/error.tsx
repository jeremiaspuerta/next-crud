import { getCsrfToken } from "next-auth/react";

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  useColorModeValue,
  FormHelperText,
} from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { REQUIRED_FIELD_ERROR } from "src/constants/messages";
import axios from "axios";

type TypeInputsForm = {
  csrfToken: string;
  email: string;
  password: string;
};

export default function Error({ csrfToken }: any) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TypeInputsForm>();

  const onSubmit: SubmitHandler<TypeInputsForm> = async (data) => {
    axios.post('/api/auth/callback/credentials',data)
    .then((res) => console.log(res))
    .catch((err) => console.error(err))
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('csrfToken')} type="hidden" defaultValue={csrfToken} />

      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  isInvalid={errors.email ? true : false}
                  {...register("email", {
                    required: REQUIRED_FIELD_ERROR,
                  })}
                />
                {errors.email && (
                  <FormHelperText color={"red"}>
                    {errors.email.message}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  isInvalid={errors.password ? true : false}
                  {...register("password", {
                    required: REQUIRED_FIELD_ERROR,
                  })}
                />
                {errors.password && (
                  <FormHelperText color={"red"}>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                >
                  {/* <Checkbox>Remember me</Checkbox>
                <Link color={"blue.400"}>Forgot password?</Link> */}
                </Stack>
                <Button
                  bg={"blue.400"}
                  color={"white"}
                  type="submit"
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </form>
  );
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
