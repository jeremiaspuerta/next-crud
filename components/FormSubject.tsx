import { Alert, AlertIcon, Button, Flex, FormControl, FormLabel, Input, Select, Text } from "@chakra-ui/react";
import axios from "axios";
import { INPUT_TEACHER_DATA_EMPTY } from "constants/messages";
import { INPUT_COST_FORM_SUBJECT, INPUT_DESCRIPTION_FORM_SUBJECT, INPUT_TEACHER_FORM_SUBJECT, INPUT_TOPIC_FORM_SUBJECT } from "constants/strings";
import { useEffect, useState } from "react";
import { TypeTeacher } from "types/types";

type TypeFormSubject = {
  onClose: () => void;
};

export default function FormSubject({ onClose }: TypeFormSubject) {
    const [teachers, setTeachers] = useState<Array<TypeTeacher>>([]);


   useEffect(() => {
    axios.get(
        `/api/teachers?include=Subject`
      )
    .then(({data}) => setTeachers(data))
    .catch((error) => console.error(error));
   }, [])
   

  return (
    <Flex gap={7} flexDir={"column"}>
      <FormControl>
        <FormLabel>{INPUT_TOPIC_FORM_SUBJECT}</FormLabel>
        <Input type="text" name="topic" />
      </FormControl>

      <FormControl>
        <FormLabel>{INPUT_DESCRIPTION_FORM_SUBJECT}</FormLabel>
        <Input type="text" name="description" />
      </FormControl>

      <FormControl>
        <FormLabel>{INPUT_COST_FORM_SUBJECT}</FormLabel>
        <Input type="number" name="cost" />
      </FormControl>

      {teachers.length > 0 ? (
        <FormControl>
          <FormLabel>{INPUT_TEACHER_FORM_SUBJECT}</FormLabel>
          <Select placeholder="Select option" name="id">
            {teachers.map((teacher: TypeTeacher) => (
              <option value={`${teacher.id}`} key={`${teacher.id}`}>
                {teacher.lastname.toUpperCase()}, {teacher.name.toUpperCase()}
              </option>
            ))}
          </Select>
        </FormControl>
      ) : (
        <Alert status="info">
          <AlertIcon />
          <Text>{INPUT_TEACHER_DATA_EMPTY}</Text>
        </Alert>
      )}

      <Flex gap={2} flexDir={"row"} justifyContent={"flex-end"}>
        <Button variant="ghost" onClick={() => onClose()}>
          Cancel
        </Button>
        <Button colorScheme="blue" mr={3}>
          Add
        </Button>
      </Flex>
    </Flex>
  );
}
