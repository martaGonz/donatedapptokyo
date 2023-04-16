import {useAddress, useContract, useContractRead, Web3Button } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Box, Card, CardBody, Container, Flex, Heading, Input, SimpleGrid, Skeleton, Stack, Text, Image, Button } from "@chakra-ui/react"
import { ethers } from "ethers";
import { FaDonate } from "react-icons/fa";
import { useColorMode, IconButton } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { useEffect, useState } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import type { MetaMaskInpageProvider } from '@metamask/providers';
import { ExternalProvider } from '@ethersproject/providers';
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const address = useAddress();
  const contractAddress = "0x1CC968cc807fEb2E5f67E9a0B060d07c138452aB";

  const { contract } = useContract(contractAddress);

  const { data: totalDonations, isLoading: loadingTotalDonation } = useContractRead(contract, "getTotalDonation");
  const { data: recentDonation, isLoading: loadingRecentDonation } = useContractRead(contract, "getAllDonation");

  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");

  const [provider, setProvider] = useState<ExternalProvider | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const router = useRouter();
  const detectProvider = async () => {
    const detectedProvider = (await detectEthereumProvider()) as ExternalProvider;

    if (detectedProvider && typeof detectedProvider.request === 'function') {
      setProvider(detectedProvider);
    } else {
      console.error('MetaMask provider not found');
    }
  };

  useEffect(() => {
    detectProvider();
  }, [isConnected]);


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

  function shortenAddress(address: string, chars = 4): string {
    if (!address) return "";
    const prefix = address.slice(0, chars);
    const suffix = address.slice(-chars);
    return `${prefix}...${suffix}`;
  }
 

  const connectMetaMask = async () => {
    console.log('Attempting to connect MetaMask...');
  
    if (!provider || typeof provider.request !== 'function') {
      console.log('Provider not available or request method undefined');
      return;
    }
    if (isConnected) {
      // Handle disconnection
      setAccount('');
      setIsConnected(false);
    } else {
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsConnected(true);
        console.log('Accounts:', accounts); // Log accounts instead of isConnected
      } catch (error) {
        console.error('Error connecting to MetaMask:', error);
      }
    }
  };
  

  const disconnectMetaMask = () => {
    setAccount('');
    setIsConnected(false);
  };



  function DarkModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode();
    const isDark = colorMode === "dark";

    return (
      <IconButton
        size="md"
        fontSize="lg"
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        variant="ghost"
        color="current"
        marginLeft="2"
        onClick={toggleColorMode}
        icon={isDark ? <SunIcon /> : <MoonIcon />}
      />
    );
  }


  return (
    <Container maxW={"1200px"} w={"full"}>
      <Flex justifyContent={"space-between"} alignItems={"center"} px={6} py={4} borderBottomWidth={1} borderBottomColor="gray.200">
        <Flex alignItems={"center"}>
          <Image src="/logo.png" alt="Logo" w="50px" mr={2} />
          <Heading as="h1" fontSize="2xl" fontWeight="bold">Support Content Creator</Heading>
        </Flex>
        <Flex alignItems={"center"}>
          <Flex alignItems={"center"}>
            <DarkModeToggle />

            <Button onClick={isConnected ? disconnectMetaMask : connectMetaMask}>
              {isConnected ? `Disconnect (${shortenAddress(account)})` : "Connect MetaMask"}
            </Button>
            {account && (
              <Text ml={4} fontSize="sm">
              </Text>
            )}
<div>
      <button onClick={() => router.push("/projects")}>Support Other Projects</button>
    </div>
          </Flex>



        </Flex>

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
                placeholder="Logan Roy"
                maxLength={16}
                value={name}
                onChange={handleNameChange}
              />
              <Text fontSize={"2xl"} mt={"10px"} py={"10px"}>Message: </Text>
              <Input
                placeholder="This is my donation"
                maxLength={80}
                value={message}
                onChange={handleMessageChange}
              />
              
              <Flex justifyContent={"center"} mt={"20px"}>
                {isConnected ? (
                  <Button
                    contractAddress={contractAddress}
                    action={(contract) => {
                      contract.call("sendDonation", [message, name], { value: ethers.utils.parseEther("0.01") })
                    }}
                    onSuccess={() => clearValues()}
                  >
                    <Flex alignItems="center">
                     
                      <Text ml={2}>Donate 0.01 ETH</Text>
                    </Flex>
                  </Button>
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
 