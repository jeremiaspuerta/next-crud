import {
  Heading,
  Avatar,
  Box,
  Center,
  Text,
  Stack,
  Button,
  Link,
  Badge,
  useColorModeValue,
} from "@chakra-ui/react";
import { TypeCardProfile } from "types/types";
import uniqolor from "uniqolor";

export default function CardProfile({
  imageSeed,
  title,
  subtitle,
  description,
  items,
}: TypeCardProfile) {
  return (
    <Center py={6}>
      <Box textAlign={"center"}>
        <Avatar
          size={"xl"}
          src={`https://avatars.dicebear.com/api/bottts/${imageSeed}.svg?r=50&scale=83`}
          mb={4}
          pos={"relative"}
        />
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {title}
        </Heading>
        <Text fontWeight={600} color={"gray.500"} mb={4}>
          {subtitle}
        </Text>
        {/* <Text
            textAlign={'center'}
            color={useColorModeValue('gray.700', 'gray.400')}
            px={3}>
            Actress, musician, songwriter and artist. PM for work inquires or{' '}
            <Link href={'#'} color={'blue.400'}>
              #tag
            </Link>{' '}
            me in your posts
          </Text> */}

        <Stack align={"center"} justify={"center"} direction={"row"} mt={6}>
          {items && items.length > 0 &&
            items.map((item) => (
              <Badge
                key={item.id}
                px={2}
                py={1}
                fontWeight={'bold'}
                bg={uniqolor(item.label, {
                  lightness: 80,
                }).color}
              >
                {item.label}
              </Badge>
            ))}

        </Stack>

        {/* <Stack mt={8} direction={"row"} spacing={4}>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            _focus={{
              bg: "gray.200",
            }}
          >
            Message
          </Button>
          <Button
            flex={1}
            fontSize={"sm"}
            rounded={"full"}
            bg={"blue.400"}
            color={"white"}
            boxShadow={
              "0px 1px 25px -5px rgb(66 153 225 / 48%), 0 10px 10px -5px rgb(66 153 225 / 43%)"
            }
            _hover={{
              bg: "blue.500",
            }}
            _focus={{
              bg: "blue.500",
            }}
          >
            Follow
          </Button>
        </Stack> */}
      </Box>
    </Center>
  );
}
