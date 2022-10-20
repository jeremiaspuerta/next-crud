import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TypeSubject, TypeTeacher } from "src/types/types";

type TypeUser = {
  name: string;
  id: string;
};

type TypeCard = {
  colorA: string;
  colorB: string;
  title: string;
  description?: string;
  url?: string;
  price?: string;
};

const Card = ({ title, description, url, colorA, colorB, price }: TypeCard) => {
  return (
    <Link href={`/${url}`}>
      <Box
        __css={{
          background: `linear-gradient(to left, ${colorA}, ${colorB})`,
        }}
        width={"100%"}
        color={"white"}
        p={5}
        rounded={"lg"}
        mt={10}
        transition={"0.3s"}
        cursor={"pointer"}
        _hover={{ boxShadow: "13px 16px 16px -5px #C2C2C2" }}
      >
        <Flex justifyContent={"space-between"}>
          <Box display={"flex"} alignItems={"end"} gap={"1ch"}>
            <Heading size={"4xl"}>{title}</Heading>
            <Heading
              fontWeight={"light"}
              size={"md"}
              mb={"7px"}
              textTransform={"lowercase"}
            >
              {description || ""}
            </Heading>
          </Box>

          {description == "subjects" && (
            <Text fontWeight={"bold"} fontSize={"xl"}>
              ${price}
            </Text>
          )}
        </Flex>
      </Box>
    </Link>
  );
};

type TypeTeacherDashboard = TypeSubject & {
  totalPerMonth: number;
};

export const TeacherDashboard = ({ name, id }: TypeUser) => {
  const [teacherData, setTeacherData] = useState<TypeTeacherDashboard[]>();

  useEffect(() => {
    axios
      .get(`/api/subjects?include=Students&where={"teacher_id":${id}}`)
      .then(({ data }) => {
        let totalPerMonth: number = 0;

        data.forEach((item: TypeSubject) => {
          totalPerMonth = totalPerMonth + parseInt(item.monthly_cost as string);
        });

        data.totalPerMonth = totalPerMonth;

        setTeacherData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!teacherData) {
    return <Text>Loading...</Text>;
  }

  return (
    <Container
      maxW="150vh"
      p={10}
      mt={10}
      bg={"blackAlpha.100"}
      rounded={"lg"}
      shadow={"lg"}
    >
      <Box textAlign={"start"} display={"flex"}>
        <Heading fontWeight={"normal"}>Welcome, </Heading>
        <Heading>{name}</Heading>
        <Heading fontWeight={"light"}>!</Heading>
      </Box>

      <Box textAlign={"start"} display={"flex"} gap={"5ch"}>
        <Card
          colorA="#3378FF"
          colorB="#9442FE"
          title={`${teacherData.length}`}
          description="subjects"
          url="subjects"
          price={teacherData.totalPerMonth}
        />
        <Card
          colorA="#8A2387"
          colorB="#E94057"
          title={`10`}
          description="students"
          url="students"
        />
      </Box>
    </Container>
  );
};
