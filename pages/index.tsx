import { Text } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { AdminDashboard } from "src/components/AdminDashboard";
import { StudentDashboard } from "src/components/StudentDashboard";
import { TeacherDashboard } from "src/components/TeacherDashboard";

export default function Index() {
    const { data: session }: any = useSession();

    if(!session){
        return <Text>Loading...</Text>
    }
    
    return (
        session.user.email.includes('teacher') ? <TeacherDashboard name={session.user.name} id={session.user.id}/> : 
        session.user.email.includes('student') ?
        <StudentDashboard name={session.user.name} id={session.user.id}/>
        : <AdminDashboard  name={session.user.name} id={session.user.id}/> 
    )
}