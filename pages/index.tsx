import { Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { TeacherDashboard } from "src/components/TeacherDashboard";

export default function Index() {
    const { data: session }: any = useSession();

    if(!session){
        return <Text>Loading...</Text>
    }
    
    return (
        session.user.email.includes('teacher') ? <TeacherDashboard name={session.user.name} id={session.user.id}/> : <Text>Home page</Text>
    )
}