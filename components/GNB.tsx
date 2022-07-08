import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import { Box, Button, Flex, Spacer } from '@chakra-ui/react';
import React from 'react';

function GNB() {
  const { authUser, loading, signOut, signInWithGoogle } = useFirebaseAuth();

  const loginBtn = (
    <Button
      fontSize={'sm'}
      fontWeight={600}
      color="white"
      bg="pink.400"
      _hover={{ bg: 'pink.300' }}
      onClick={signInWithGoogle}
    >
      로그인
    </Button>
  );
  const logoutBtn = (
    <Button as={'a'} fontWeight={400} variant="link" onClick={signOut}>
      로그아웃
    </Button>
  );

  const authInitialized = loading || authUser === null;
  console.log('ㅎㅎㅎㅎ: ', authUser, authInitialized);

  return (
    <Box
      borderBottom={1}
      borderStyle="solid"
      borderColor={'gray.200'}
      bg="white"
    >
      <Flex minH={'60px'} py={{ base: 2 }} px={{ base: 4 }} align="center">
        <Spacer />
        <Box flex={'1'}>
          <img src="/logo.svg" alt="로고" style={{ height: '40px' }} />
        </Box>
        <Box justifyContent="flex-end">
          {authInitialized ? loginBtn : logoutBtn}
        </Box>
      </Flex>
    </Box>
  );
}

export default GNB;
