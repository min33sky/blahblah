import ServiceLayout from '@/components/containers/service_layout';
import { InAuthUser } from '@/types/in_auth_user';
import {
  Avatar,
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import ResizeTextarea from 'react-textarea-autosize';
import React, { useState } from 'react';

const userInfo: InAuthUser = {
  uid: 'absdf',
  email: 'min33sky@naver.com',
  displayName: 'min33sky',
  photoURL:
    'https://lh3.googleusercontent.com/a-/AFdZucoeMxqbT6k2a1OeKepBrEaplZlsHlaVr_lMpw5gUg=s96-c',
};

function UserHomePage() {
  const [message, setMessage] = useState('');
  const toast = useToast();

  return (
    <ServiceLayout
      title="user home"
      boxProps={{ backgroundColor: 'gray.50', minH: '100vh' }}
    >
      <Box maxW={'md'} mx="auto" pt={'6'}>
        <Box
          borderWidth={'1px'}
          borderRadius="lg"
          overflow={'hidden'}
          mb="2"
          bg={'white'}
        >
          <Flex p={'6'}>
            <Avatar size={'lg'} src={userInfo.photoURL!} mr="2" />
            <Flex direction={'column'} justify="center">
              <Text>{userInfo.displayName}</Text>
              <Text>{userInfo.email}</Text>
            </Flex>
          </Flex>
        </Box>
        <Box
          borderWidth={'1px'}
          borderRadius="lg"
          overflow={'hidden'}
          mb="2"
          bg={'white'}
        >
          <Flex align={'center'} p="2">
            <Avatar size={'xs'} src="https://bit.ly/broken-link" mr={'2'} />
            <Textarea
              bg={'gray.100'}
              border="none"
              placeholder="무엇이 궁금한가요?"
              resize={'none'}
              minH="unset"
              overflow={'hidden'}
              fontSize="xs"
              mr={'2'}
              maxRows={7}
              value={message}
              onChange={(e) => {
                if (e.currentTarget.value) {
                  const lineCount =
                    (e.currentTarget.value.match(/[^\n]*\n[^\n]*/gi)?.length ??
                      1) + 1;
                  if (lineCount > 7) {
                    toast({
                      title: '최대 7줄까지 입력가능합니다.',
                      position: 'top-right',
                    });
                    return;
                  }
                }
                setMessage(e.currentTarget.value);
              }}
              as={ResizeTextarea}
            />
            <Button
              disabled={message.length === 0 || message.trim() === ''}
              bgColor={'#ffb86c'}
              color="white"
              colorScheme={'yellow'}
              variant="solid"
              size={'sm'}
            >
              등록
            </Button>
          </Flex>
        </Box>
      </Box>
    </ServiceLayout>
  );
}

export default UserHomePage;
