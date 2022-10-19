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

const NavLink = ({ children }: { children: String }) => {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <Link href={`/${children.toLowerCase()}`}>
      <LinkTag
        px={2}
        py={1}
        rounded={"md"}
        fontWeight={
          router.pathname.includes(children.toLowerCase()) ? "bold" : "normal"
        }
        bg={
          router.pathname.includes(children.toLowerCase())
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

  console.log(session);

  const Links = [
    {
      name: "Subjects",
      show: session?.user?.email
        ? session.user.email.includes("teacher") ||
          session.user.email.includes("student") ||
          session.user.email.includes("admin")
        : false,
    },
    {
      name: "Teachers",
      show: session?.user?.email ? session.user.email.includes("admin") : false,
    },
    {
      name: "Students",
      show: session?.user?.email
        ? session.user.email.includes("teacher") || session.user.email.includes("admin") 
        : false,
    },
    {
      name: "Payments",
      show: session?.user?.email
        ? session.user.email.includes("student") ||
          session.user.email.includes("admin")
        : false,
    },
    {
      name: "Admins",
      show: session?.user?.email ? session.user.email.includes("admin") : false,
    },
  ];

  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
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
                  link.show && <NavLink key={link.name}>{link.name}</NavLink>
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
                  size={"sm"}
                  src={`https://avatars.dicebear.com/api/bottts/${session?.user?.email}.svg?r=50&scale=83`}
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
                  link.show && <NavLink key={link.name}>{link.name}</NavLink>
              )}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
