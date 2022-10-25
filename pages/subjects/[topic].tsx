import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tag,
} from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import MainPage from "src/components/MainPage";
import ModalChangeGrade from "src/components/ModalChangeGrade";
import { TypeSubject } from "src/types/types";


const Subject = () => {
  const [subject, setSubject] = useState<TypeSubject>();
  const [reloadTable, setReloadTable] = useState<Date>(new Date());
  const [data, setData] = useState<unknown>();

  const router = useRouter();
  const { topic } = router.query;
  let s_topic = topic as string;

  const columns = [
    {
      name: "Document number",
      selector: (row: any) => row.Student.document_number,
      sortable: true
    },
    {
      name: "Name",
      selector: (row: any) => row.Student.name,
      sortable: true
    },
    {
      name: "Lastname",
      selector: (row: any) => row.Student.lastname,
      sortable: true
    },
    {
      name: "Grade",
      selector: (row: any) => <ModalChangeGrade currentGrade={row.grade} student={row.Student} course_id={row.id} callback={() => setReloadTable(new Date())}/>,
      sortable: true
    },
  ];

  const breadcrumb = (
    <Breadcrumb color={'blackAlpha.600'}>
      <BreadcrumbItem>
        <Link href="/subjects">
          <BreadcrumbLink >Subjects</BreadcrumbLink>
        </Link>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink fontWeight={'bold'}>{s_topic && s_topic.replaceAll("-", " ")}</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  );

  useEffect(() => {
    if (s_topic) {
      axios
        .get(`/api/subjects?where={"topic":"${s_topic.replaceAll("-", " ")}"}`)
        .then(({ data }) => setSubject(data[0]))
        .catch((err) => console.error(err));
    }
  }, [topic]);

  useEffect(() => {
    if (subject) {
      axios
        .get(
          `/api/courses?where={"subject_id":${subject.id}}&include=Subject,Student`
        )
        .then(({ data: resData }) => setData(resData))
        .catch((err) => console.error(err));
    }
  }, [subject, reloadTable]);

  return (
    <MainPage
      columnsName={columns}
      entityData={data}
      handleCallback={() => setReloadTable(new Date())}
      title={s_topic && s_topic.replaceAll("-", " ")}
      breadcrumb={breadcrumb}
    />
  );
};

export default Subject;
