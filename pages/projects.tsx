import { NextPage } from "next"; 
import { Box, Container, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

interface Project {
  id: number;
  name: string;
  description: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "Project 1",
    description: "This is project 1",
  },
  {
    id: 2,
    name: "Project 2",
    description: "This is project 2",
  },
  {
    id: 3,
    name: "Project 3",
    description: "This is project 3",
  },
  {
    id: 4,
    name: "Project 4",
    description: "This is project 4",
  },
  {
    id: 5,
    name: "Project 5",
    description: "This is project 5",
  },
];

const Projects: NextPage = () => {
  const router = useRouter();

  const handleDonateClick = (id: number) => {
    router.push(`/donate/${id}`);
  };

  return (
    <Container maxW={"1200px"} w={"full"} mt={8}>
      <Heading as="h1" fontSize="3xl" mb={6}>
        Select a project to donate to:
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={10}>
        {projects.map((project) => (
          <Box key={project.id} borderWidth="1px" borderRadius="lg" p={6}>
            <Heading as="h2" fontSize="xl" mb={4}>
              {project.name}
            </Heading>
            <Text>{project.description}</Text>
            <Box
              mt={6}
              bg="teal.400"
              color="white"
              rounded="md"
              px={4}
              py={2}
              _hover={{ bg: "teal.500", cursor: "pointer" }}
              onClick={() => handleDonateClick(project.id)}
            >
              Donate to {project.name}
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default Projects;
