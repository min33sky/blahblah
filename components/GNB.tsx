import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from '@chakra-ui/react';
import router from 'next/router';
import React from 'react';
import MoreBtnIcon from './MoreBtnIcon';

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
    <Menu>
      <MenuButton
        as={IconButton}
        icon={
          <Avatar
            size="md"
            src={authUser?.photoURL ?? 'https://bit.ly/broken-link'}
          />
        }
        borderRadius="full"
      />
      <MenuList>
        <MenuItem
          onClick={() =>
            (window.location.href = `/${authUser?.email?.replace(
              '@gmail.com',
              ''
            )}`)
          }
        >
          사용자 홈으로 이동
        </MenuItem>
        <MenuItem onClick={signOut}>로그아웃</MenuItem>
      </MenuList>
    </Menu>
  );

  const authInitialized = loading || authUser === null;

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
