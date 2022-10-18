export { default } from "next-auth/middleware"

export const config = { matcher: ["/teacher","/students","/subjects","/admins","/payments"] }