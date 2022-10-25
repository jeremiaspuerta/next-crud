import {  Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { PROFIT_PERCENTAGE } from "src/configs/settings";
import { TypeCardDashboard, TypeCourse } from "src/types/types";
import { Dashboard } from "./Dashboard";

type TypeUser = {
  name: string;
  id: string;
};

export const StudentDashboard = ({ name, id }: TypeUser) => {
  const [studentData, setstudentData] = useState<any>();
  const [cards, setCards] = useState<TypeCardDashboard[]>([]);

  useEffect(() => {
    axios
      .get(`/api/courses?where={"student_id":${id}}&include=Subject`)
      .then(({ data }) => {
        let totalPerMonth: number = 0;

        data.forEach((item: any) => {
          totalPerMonth = totalPerMonth + parseInt(item.Subject.monthly_cost as string);

        });

        data.totalPerMonth = totalPerMonth;

        setstudentData(data);
      })
      .catch((err) => console.error(err));
  }, []);


  useEffect(() => {
    const cardA: TypeCardDashboard = {
      colorA: "#D7003A",
      colorB: "#19087E",
      title: `${studentData?.length}`,
      description: "subjects",
      url: "subjects",
      topDetail: `$${studentData?.totalPerMonth}`,
    };

    setCards([cardA]);

  }, [studentData]);

  if (!studentData) {
    return <Text>Loading...</Text>;
  }

  return <Dashboard username={name} cards={cards}/>;

};