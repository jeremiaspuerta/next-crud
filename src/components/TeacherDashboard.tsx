import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PROFIT_PERCENTAGE } from "src/configs/settings";
import { TypeCardDashboard, TypeCourse } from "src/types/types";
import { Dashboard } from "./Dashboard";

type TypeUser = {
  name: string;
  id: string;
};

export const TeacherDashboard = ({ name, id }: TypeUser) => {
  const [teacherData, setTeacherData] = useState<any>();
  const [cards, setCards] = useState<TypeCardDashboard[]>([]);

  useEffect(() => {
    axios
      .get(`/api/subjects?include=Students&where={"teacher_id":${id}}`)
      .then(({ data }) => {
        let totalPerMonth: number = 0;
        let totalStudents: number[] = [];

        data.forEach((item: any) => {
          totalPerMonth = totalPerMonth + parseInt(item.monthly_cost as string);

          if (item.Students) {
            item.Students.forEach((student: TypeCourse) => {
              if (!totalStudents.includes(student.student_id)) {
                totalStudents.push(student.student_id);
              }
            });
          }
        });

        data.totalStudents = totalStudents;
        data.totalPerMonth = totalPerMonth * PROFIT_PERCENTAGE;

        setTeacherData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const cardA: TypeCardDashboard = {
      colorA: "#3378FF",
      colorB: "#9442FE",
      title: teacherData?.length,
      description: "subjects",
      url: "subjects",
      topDetail: `$${teacherData?.totalPerMonth}`,
    };

    const cardB: TypeCardDashboard = {
      colorA: "#8A2387",
      colorB: "#E94057",
      title: teacherData?.totalStudents.length,
      description: "students",
      url: "students"
    };

    setCards([cardA,cardB]);

  }, [teacherData]);

  if (!teacherData) {
    return <Text>Loading...</Text>;
  }

  return <Dashboard username={name} cards={cards}/>;

};
