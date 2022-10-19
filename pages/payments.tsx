import { Stack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { TypePayment } from "src/types/types";
import MainPage from "src/components/MainPage";
import { useEffect, useState } from "react";
import { ModalEditDeleteActions } from "src/components/ModalEditDeleteActions";
import { TOAST_ERROR_DESCRIPTION, TOAST_ERROR_TITLE } from "src/constants/messages";
import dayjs from "dayjs";

const columns = [
  {
    name: "Actions",
    selector: (row: any) => row.actions,
  },
  {
    name: "#",
    selector: (row: any) => row.id,
  },
  {
    name: "Student",
    selector: (row: any) => row.Student.name,
  },
  {
    name: "Subject",
    selector: (row: any) => row.Subject.topic,
  },
  {
    name: "Price",
    selector: (row: any) => row.price,
  },
  {
    name: "Registration on",
    selector: (row: any) => dayjs(row.created_at).format("DD/MM/YYYY") ,
  },
];

const Payments = () => {
  const toast = useToast();
  const [paymentsData, setPaymentsData] = useState<Array<TypePayment>>([]);
  const [reloadTable, setReloadTable] = useState<Date>(new Date());

  useEffect(() => {
    axios
      .get("/api/payments?include=Student,Subject")
      .then(({ data }) => {
        setPaymentsData(
          data.map((payment: TypePayment) => ({
            ...payment,
            actions: (
              <Stack direction="row" spacing={2} align="center">
                {/* <ModalShowDetails 
                      imageSeed={subject.email}
                      title={subject.name}
                      subtitle={subject.email}
                      items={student.Subject.length > 0 ? student.Subject.map((subject: TypePayment) =>({id: subject.id, label: subject.topic})) : []}
                  /> */}

                <ModalEditDeleteActions
                  entityData={payment}
                  onCallback={() => setReloadTable(new Date())}
                  action="edit"
                  typeEntity="payment"
                  recordTitle={payment.id.toString()}
                />

                <ModalEditDeleteActions
                  entityData={payment}
                  onCallback={() => setReloadTable(new Date())}
                  action="delete"
                  typeEntity="payment"
                  recordTitle={`payment #${payment.id.toString()}`}
                />
              </Stack>
            ),
          }))
        );
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
  }, [reloadTable]);

  return (
    <MainPage
      columnsName={columns}
      entityData={paymentsData}
      handleCallback={() => setReloadTable(new Date())}
    />
  );
};

export default Payments;
