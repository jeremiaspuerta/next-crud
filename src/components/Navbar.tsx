import { ReactNode } from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Link as LinkTag,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

const NavLink = ({link, children }: { children: String,link: String }) => {
  const router = useRouter();

  return (
    <Link href={`/${link}`}>
      <LinkTag
        px={2}
        py={1}
        rounded={"md"}
        fontWeight={
          router.pathname == `/${link}` ? "bold" : "normal"
        }
        bg={
          router.pathname == `/${link}`
            ? "gray.200"
            : "gray.100"
        }
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
      >
        {children}
      </LinkTag>
    </Link>
  );
};

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  const Links = [
    {
      name: "Home",
      show: true,
      link: ''
    },
    {
      name: "Subjects",
      show: session?.user?.email
        ? session.user.email.includes("teacher") ||
          session.user.email.includes("student") ||
          session.user.email.includes("admin")
        : false,
        link: 'subjects'
    },
    {
      name: "Teachers",
      show: session?.user?.email ? session.user.email.includes("admin") : false,
      link: 'teachers'
    },
    {
      name: "Students",
      show: session?.user?.email
        ? session.user.email.includes("teacher") || session.user.email.includes("admin") 
        : false,
        link: 'students'
    },
    {
      name: "Payments",
      show: session?.user?.email
        ?
          session.user.email.includes("admin")
        : false,
        link: 'payments'
    },
    {
      name: "Admins",
      show: session?.user?.email ? session.user.email.includes("admin") : false,
      link: 'admins'
    },
  ];

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4} boxShadow="0px 15px 15px -4px rgb(0 0 0 / 7%)">
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map(
                (link) =>
                  link.show && <NavLink key={link.name} link={link.link}>{link.name}</NavLink>
              )}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Menu>
              <MenuButton
                as={Button}
                rounded={"full"}
                variant={"link"}
                cursor={"pointer"}
                minW={0}
              >
                <Avatar
                  height={'4vh'}
                  width={'auto'}
                  src={`https://avatars.dicebear.com/api/bottts/${session?.user?.email}.svg?r=50&scale=83`}
                  border={'2px solid #3BB273'}
                  backgroundColor={'white'}
                />
              </MenuButton>
              <MenuList>
                <MenuItem textAlign={'center'}>{`${session?.user?.name}` || `Mi perfil`}</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => signOut()}>Cerrar sesión</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {Links.map(
                (link) =>
                  link.show && <NavLink key={link.name} link={link.link}>{link.name}</NavLink>
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
