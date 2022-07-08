import { Box, Button } from '@chakra-ui/react';
import React from 'react';

function GoogleLoginButton({ onLogin }: { onLogin: () => void }) {
  return (
    <Box>
      <Button
        onClick={onLogin}
        size={'lg'}
        width={'full'}
        maxW="md"
        borderRadius={'full'}
        bgColor="#4285f4"
        color={'white'}
        colorScheme="blue"
        leftIcon={
          <img
            src="/google.svg"
            alt="google 로고"
            style={{ backgroundColor: 'white', padding: '8px' }}
          />
        }
      >
        Google 계정으로 시작하기
      </Button>
    </Box>
  );
}

export default GoogleLoginButton;
