import { Box, Container, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import { TypeCardDashboard } from "src/types/types";



const Card = ({ title, description, url, colorA, colorB, topDetail }: TypeCardDashboard) => {
  return (
    <Link href={`/${url}`}>
      <Box
        __css={{
          background: `linear-gradient(to left, ${colorA}, ${colorB})`,
        }}
        width={"100%"}
        color={"white"}
        p={5}
        rounded={"lg"}
        mt={10}
        transition={"0.3s"}
        cursor={"pointer"}
        _hover={{ boxShadow: "13px 16px 16px -5px #C2C2C2" }}
      >
        <Flex justifyContent={"space-between"}>
          <Box display={"flex"} alignItems={"end"} gap={"1ch"}>
            <Heading size={"4xl"}>{title}</Heading>
            <Heading
              fontWeight={"light"}
              size={"md"}
              mb={"7px"}
              textTransform={"lowercase"}
            >
              {description || ""}
            </Heading>
          </Box>

          {topDetail && (
            <Text fontWeight={"bold"} fontSize={"xl"}>
              {topDetail}
            </Text>
          )}
        </Flex>
      </Box>
    </Link>
  );
};

type TypeDashboard = {
    username: string;
    cards: TypeCardDashboard[];
  };

export const Dashboard = ({ username,cards }: TypeDashboard) => {

  return (
    <Container
      maxW="150vh"
      p={10}
      mt={10}
      bg={"blackAlpha.100"}
      rounded={"lg"}
      shadow={"lg"}
    >
      <Box textAlign={"start"} display={"flex"}>
        <Heading fontWeight={"normal"}>Welcome,&nbsp;</Heading>
        <Heading>{username}</Heading>
        <Heading fontWeight={"light"}>!</Heading>
      </Box>

      <Box textAlign={"start"} display={"flex"} gap={"5ch"}>
        
        {
            cards.map((card:TypeCardDashboard) => 
                <Card
                key={card.url}
                colorA={card.colorA}
                colorB={card.colorB}
                title={card.title}
                description={card.description}
                url={card.url}
                topDetail={card.topDetail}
              />
            )
        }

      </Box>
    </Container>
  );
};
