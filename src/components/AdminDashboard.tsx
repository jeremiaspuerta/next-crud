import { Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { TypeCardDashboard } from "src/types/types";
import { Dashboard } from "./Dashboard";

type TypeUser = {
  name: string;
  id: string;
};

export const AdminDashboard = ({ name, id }: TypeUser) => {
  const [studentsData, setstudentsData] = useState<any>();
  const [teachersData, setteachersData] = useState<any>();
  const [subjectsData, setsubjectsData] = useState<any>();
  const [cards, setCards] = useState<TypeCardDashboard[]>([]);

  useEffect(() => {
    axios
      .get(`/api/students`)
      .then(({ data }) => setstudentsData(data))
      .catch((err) => console.error(err));

    axios
      .get("/api/subjects")
      .then(({ data }) => setsubjectsData(data))
      .catch((err) => console.error(err));

    axios
      .get("/api/teachers")
      .then(({ data }) => setteachersData(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const cardA: TypeCardDashboard = {
      colorA: "#24CFC5",
      colorB: "#001C63",
      title: `${studentsData?.length}`,
      description: "students",
      url: "students",
    };

    const cardB: TypeCardDashboard = {
      colorA: "#4776E6",
      colorB: "#8E54E9",
      title: `${teachersData?.length}`,
      description: "teachers",
      url: "teachers",
    };

    const cardC: TypeCardDashboard = {
      colorA: "#A531DC",
      colorB: "#4300B1",
      title: `${subjectsData?.length}`,
      description: "subjects",
      url: "subjects",
    };

    setCards([cardA, cardB, cardC]);
  }, [studentsData, teachersData, subjectsData]);

  if (!studentsData) {
    return <Text>Loading...</Text>;
  }

  return <Dashboard username={name} cards={cards} />;
};
