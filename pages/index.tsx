import { ConnectWallet, useAddress, useContract, useContractRead, Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Box, Card, CardBody, Container, Flex, Heading, Input, SimpleGrid, Skeleton, Stack, Text, Image } from "@chakra-ui/react"
import { ethers } from "ethers";
import { useState } from "react";
import { FaDonate } from "react-icons/fa";

const Home: NextPage = () => {
  const address = useAddress();
  const contractAddress = "0x1CC968cc807fEb2E5f67E9a0B060d07c138452aB";

  const { contract } = useContract(contractAddress);

  const { data: totalDonations, isLoading: loadingTotalDonation } = useContractRead(contract, "getTotalDonation");
  const { data: recentDonation, isLoading: loadingRecentDonation } = useContractRead(contract, "getAllDonation");

  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event?.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };


  function clearValues() {
    setMessage("");
    setName("");
  }

  return (
    <Container maxW={"1200px"} w={"full"}>
      <Flex justifyContent={"space-between"} alignItems={"center"} py={"20px"} height={"80px"}>
        <Box>
          <Image src="/logo.png" alt="Logo" w="100px" />
          <Heading as="h1" fontSize="2xl" fontWeight="bold">Donate to the Charity</Heading>
        </Box>
        <ConnectWallet />
      </Flex>
      <SimpleGrid columns={2} spacing={10} mt={"40px"}>
        <Box>
          <Card>
            <CardBody>
              <Flex justifyContent={"space-between"} alignItems={"center"} mb={"20px"}>
                <Text>Total Donations:</Text>
                <Skeleton isLoaded={!loadingTotalDonation} width={"20px"} ml={"5px"}>
                  <Text fontSize={"xl"}>{totalDonations?.toString()}</Text>
                </Skeleton>
              </Flex>
              <Text fontSize={"2xl"} py={"10px"}>Name:</Text>
              <Input
                placeholder="John Doe"
                maxLength={16}
                value={name}
                onChange={handleNameChange}
              />
              <Text fontSize={"2xl"} mt={"10px"} py={"10px"}>Message: </Text>
              <Input
                placeholder="Hello"
                maxLength={80}
                value={message}
                onChange={handleMessageChange}
              />
              <Flex justifyContent={"center"} mt={"20px"}>
                {address ? (
                  <Web3Button
                    contractAddress={contractAddress}
                    action={(contract) => {
                      contract.call("sendDonation", [message, name], { value: ethers.utils.parseEther("0.01") })
                    }}
                    onSuccess={() => clearValues()}
                  >
                    <Flex alignItems="center">
                      <FaDonate size={16} />
                      <Text ml={2}>Donate 0.01 ETH</Text>
                    </Flex>
                  </Web3Button>
                ) : (
                  <Text>Please connect your wallet</Text>
                )}
              </Flex>
            </CardBody>
          </Card>

          </Box>
        <Box>
          <Card maxH={"60vh"} overflow={"scroll"}>
            <CardBody>
              <Text fontWeight={"bold"}>Recent Messages:</Text>
              {!loadingRecentDonation ? (
                <Box>
                  {recentDonation && recentDonation.map((donation: any, index: number) => {
                    return (
                      <Card key={index} my={"10px"}>
                        <CardBody>
                          <Flex justifyContent={"space-between"}>
                          <Text fontSize={"lg"} mt={"5px"}>{donation[1]}</Text>
                            <Text fontSize={"sm"}>{new Date(donation[3] * 1000).toLocaleString()}</Text>
                          </Flex>
                       
                          <Text mt={"5px"}>From: {donation[2]}</Text>
                        </CardBody>
                      </Card>
                    )
                  }).reverse()}
                </Box>
              ) : (
                <Stack>
                  <Skeleton height={"100px"} />
                  <Skeleton height={"100px"} />
                  <Skeleton height={"100px"} />
                </Stack>
              )}
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Home;
