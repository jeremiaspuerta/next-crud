import { Stack, useToast } from "@chakra-ui/react";
import { TOAST_ERROR_DESCRIPTION, TOAST_ERROR_TITLE } from "src/constants/messages";
import axios from "axios";
import { useEffect, useState } from "react";
import { TypeAdmin, TypeStudent, TypeTeacher } from "src/types/types";
import dayjs from "dayjs";
import { ModalEditDeleteActions } from "src/components/ModalEditDeleteActions";
import MainPage from "src/components/MainPage";
import { ModalShowDetails } from "src/components/ModalShowDetails";

const columns = [
  {
    name: "Actions",
    selector: (row: any) => row.actions,
    sortable: true
  },
  {
    name: "Name",
    selector: (row: any) => row.name,
    sortable: true
  },
  {
    name: "Lastname",
    selector: (row: any) => row.lastname,
    sortable: true
  },
  {
    name: "Document number",
    selector: (row: any) => row.document_number,
    sortable: true
  },
  {
    name: "Email",
    selector: (row: any) => row.email,
    sortable: true
  },
  {
    name: "Created on",
    selector: (row: any) => dayjs(row.created_at).format("DD/MM/YYYY"),
    sortable: true
  },
];

const Admins = () => {
  const toast = useToast();
  const [adminsData, setAdminsData] = useState<Array<TypeAdmin>>([]);
  const [reloadTable, setReloadTable] = useState<Date>(new Date());

  useEffect(() => {
    axios
      .get("/api/admins")
      .then(({ data }) => {
        setAdminsData(
          data.map((admin: TypeAdmin) => ({
            ...admin,
            actions: (
              <Stack direction="row" spacing={2} align="center">
                <ModalShowDetails
                    imageSeed={admin.email}
                    title={admin.name}
                    subtitle={admin.email}
                />

                <ModalEditDeleteActions
                  entityData={admin}
                  onCallback={() => setReloadTable(new Date())}
                  action="edit"
                  typeEntity="admin"
                  recordTitle={`${admin.lastname}, ${admin.name}`}
                />

                <ModalEditDeleteActions
                  entityData={admin}
                  onCallback={() => setReloadTable(new Date())}
                  action="delete"
                  typeEntity="admin"
                  recordTitle={`${admin.lastname}, ${admin.name}`}
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
      entityData={adminsData}
      handleCallback={() => setReloadTable(new Date())}
    />
  );
};

export default Admins;