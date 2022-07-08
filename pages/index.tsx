import ServiceLayout from '@/components/containers/service_layout';
import GoogleLoginButton from '@/components/google_login_button';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import { Box, Center, Flex, Heading } from '@chakra-ui/react';
import type { NextPage } from 'next';

const Home: NextPage = () => {
  const { signInWithGoogle, authUser } = useFirebaseAuth();
  console.info('authUser: ', authUser);

  return (
    <ServiceLayout
      title="text"
      boxProps={{ backgroundColor: 'gray.50', minH: '100vh' }}
    >
      <Box maxW={'md'} mx="auto" pt={'10'}>
        <img src="/main_logo.svg" alt="메인로고" />
        <Flex justify={'center'}>
          <Heading>#BlahBlah</Heading>
        </Flex>
      </Box>
      <Center>
        <GoogleLoginButton onLogin={signInWithGoogle} />
      </Center>
    </ServiceLayout>
  );
};

export default Home;
