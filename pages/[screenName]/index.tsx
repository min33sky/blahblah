import ServiceLayout from '@/components/containers/service_layout';
import { InAuthUser } from '@/types/in_auth_user';
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Textarea,
  useToast,
  VStack,
} from '@chakra-ui/react';
import ResizeTextarea from 'react-textarea-autosize';
import React, { useCallback, useEffect, useState } from 'react';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import { GetServerSideProps } from 'next';
import axios, { AxiosResponse } from 'axios';
import MessageItem from '@/components/messageItem';
import { InMessage } from '@/types/in_message';
import { TriangleDownIcon } from '@chakra-ui/icons';
import { useQuery } from 'react-query';

interface Props {
  userInfo: InAuthUser | null;
}

/**
 * 메세지 전송 핸들러
 * @param param0
 * @returns
 */
async function postMessage({
  message,
  uid,
  author,
}: {
  uid: string;
  message: string;
  author?: {
    displayName: string;
    photoURL?: string;
  };
}) {
  if (message.length === 0 || message.trim() === '') {
    return {
      result: false,
      message: '메시지를 입력해주세요',
    };
  }

  try {
    await fetch('/api/messages.add', {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        message,
        author,
      }),
    });
    return {
      result: true,
    };
  } catch (error) {
    console.error('error: ', error);
    return {
      result: false,
      message: '메시지 등록 실패',
    };
  }
}

/**
 * 사용자별 메인 페이지
 * @param userInfo 헤당 페이지 소유자의 정보
 * @returns
 */
function UserHomePage({ userInfo }: Props) {
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { authUser } = useFirebaseAuth();
  const [messageList, setMessageList] = useState<InMessage[]>([]);
  const [reFetchTrigger, setReFetchTrigger] = useState(false); //? 메시지 목록 리패치
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const toast = useToast();

  const messageListQueryKey = [
    'messageList',
    userInfo?.uid,
    page,
    reFetchTrigger,
  ];

  useQuery(
    messageListQueryKey,
    async () =>
      await axios.get<{
        totalElements: number;
        totalPages: number;
        page: number;
        size: number;
        content: InMessage[];
      }>(`/api/messages.list?uid=${userInfo?.uid}&page=${page}&size=10`),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        setTotalPages(data.data.totalPages);
        if (page === 1) {
          setMessageList([...data.data.content]);
          return;
        }
        setMessageList((prev) => [...prev, ...data.data.content]);
        console.log('totlaPages: ', data.data);
      },
    }
  );

  /**
   * 단일 메시지 정보를 가져오기
   * @param uid
   * @param messageId
   */
  const fetchMessageInfo = useCallback(
    (uid: string, messageId: string) => async () => {
      try {
        const res = await fetch(
          `/api/messages.info?uid=${uid}&messageId=${messageId}`
        );

        /**
         *? 메시지 정보를 가져오는데 성공할 경우
         *? 메시지목록에서 해당 메시지를 찾아 업데이트한다.
         */
        if (res.status < 300) {
          const data: InMessage = await res.json();

          setMessageList((prev) => {
            const findIndex = messageList.findIndex((fv) => fv.id === data.id);
            if (findIndex > -1) {
              const updateArr = [...prev];
              updateArr[findIndex] = data;
              return updateArr;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    [messageList]
  );

  // useEffect(() => {
  //   if (userInfo === null) return;

  //   const fetchMessageList = async (uid: string) => {
  //     try {
  //       const resp = await fetch(
  //         `/api/messages.list?uid=${uid}&page=${page}&size=3`
  //       );
  //       if (resp.status === 200) {
  //         const data: {
  //           totalElements: number;
  //           totalPages: number;
  //           page: number;
  //           size: number;
  //           content: InMessage[];
  //         } = await resp.json();

  //         setTotalPages(data.totalPages);
  //         if (page === 1) {
  //           setMessageList(data.content);
  //         } else {
  //           setMessageList((prev) => [...prev, ...data.content]);
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchMessageList(userInfo.uid);
  // }, [page, userInfo, reFetchTrigger]);

  if (!userInfo) {
    return <p>사용자가 없습니다.</p>;
  }

  //? 해당 사용자의 홈의 주인인지 확인 (댓글을 달수있는 사람)
  const isOwner = authUser !== null && userInfo.uid === authUser.uid;

  return (
    <ServiceLayout
      title={`${userInfo.displayName}의 홈`}
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
            <Avatar
              size={'lg'}
              src={userInfo.photoURL ?? 'https://bit.ly/broken-link'}
              mr="2"
            />
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
            <Avatar
              size={'xs'}
              src={
                isAnonymous
                  ? 'https://bit.ly/broken-link'
                  : authUser?.photoURL ?? 'https://bit.ly/broken-link'
              }
              mr={'2'}
            />
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
                  //? 개행문자의 수로 줄 수를 파악한다.
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
              onClick={async () => {
                const postData: {
                  message: string;
                  uid: string;
                  author?: { displayName: string; photoURL?: string };
                } = {
                  message,
                  uid: userInfo.uid,
                };

                if (isAnonymous === false) {
                  postData.author = {
                    photoURL:
                      authUser?.photoURL ?? 'https://bit.ly/broken-link',
                    displayName: authUser?.displayName ?? 'anonymous',
                  };
                }

                const messageResp = await postMessage(postData);
                if (messageResp.result === false) {
                  toast({ title: '메시지 등록 실패', position: 'top-right' });
                }

                //* 입력 폼 초기화 & 목록 다시 불러오기
                setMessage('');
                setPage(1);
                setTimeout(() => {
                  setReFetchTrigger((prev) => !prev);
                }, 50);
              }}
            >
              등록
            </Button>
          </Flex>

          <FormControl
            display={'flex'}
            alignItems="center"
            mt={'1'}
            mx="2"
            pb={'2'}
          >
            <Switch
              size={'sm'}
              colorScheme="orange"
              id="anonymous"
              mr={'1'}
              isChecked={isAnonymous}
              onChange={() => {
                if (authUser === null) {
                  toast({
                    title: '로그인이 필요합니다.',
                    position: 'top-right',
                  });
                }
                setIsAnonymous((prev) => !prev);
              }}
            />
            <FormLabel htmlFor="anonymous" mb={0} fontSize="xx-small">
              Anonymous
            </FormLabel>
          </FormControl>
        </Box>

        {/* 질문 메세지들 출력 영역 */}
        <VStack spacing={'12px'} mt="6">
          {messageList.map((item) => (
            <MessageItem
              key={`message-item-${item.id}`}
              uid={userInfo.uid}
              displayName={userInfo.displayName ?? ''}
              photoURL={userInfo.photoURL ?? 'https://bit.ly/broken-link'}
              isOwner={isOwner}
              item={item}
              onSendComplete={fetchMessageInfo(userInfo.uid, item.id)}
            />
          ))}
        </VStack>

        {/* 더보기 버튼 */}
        {totalPages > page && (
          <Button
            width={'full'}
            mt="2"
            fontSize={'sm'}
            leftIcon={<TriangleDownIcon />}
            onClick={() => setPage((prev) => prev + 1)}
          >
            더보기
          </Button>
        )}
      </Box>
    </ServiceLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { screenName } = query;

  if (screenName === undefined) {
    return {
      props: {
        userInfo: null,
      },
    };
  }

  try {
    /**
     *? 서버사이드에선 상대주소만으로는 API요청을 보낼수 없기때문에
     *? BaseURL을 설정해야한다.
     */
    const protocol = process.env.PROTOCOL || 'http';
    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || '3000';
    const baseURL = `${protocol}://${host}:${port}`;
    const userInfoResponse: AxiosResponse<InAuthUser> = await axios.get(
      `${baseURL}/api/user.info/${screenName}`
    );
    return {
      props: {
        userInfo: userInfoResponse.data ?? null,
      },
    };
  } catch (error) {
    console.error('error: ', error);
    return {
      props: {
        userInfo: null,
      },
    };
  }
};

export default UserHomePage;
