import ServiceLayout from '@/components/containers/service_layout';
import { InAuthUser } from '@/types/in_auth_user';
import { Avatar, Box, Button, Flex, Text, useToast } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import useFirebaseAuth from '@/hooks/useFirebaseAuth';
import { GetServerSideProps } from 'next';
import axios, { AxiosResponse } from 'axios';
import MessageItem from '@/components/messageItem';
import { InMessage } from '@/types/in_message';
import { ChevronLeftIcon, TriangleDownIcon } from '@chakra-ui/icons';
import { useQuery } from 'react-query';
import { messaging } from 'firebase-admin';
import Link from 'next/link';

interface Props {
  userInfo: InAuthUser | null;
  messageData: InMessage | null;
  screenName: string;
}

/**
 * 사용자별 메인 페이지
 * @param userInfo 헤당 페이지 소유자의 정보
 * @returns
 */
function MessagePage({
  screenName,
  userInfo,
  messageData: initMessageData,
}: Props) {
  const [messageData, setMessageData] = useState<InMessage | null>(
    initMessageData
  );
  const { authUser } = useFirebaseAuth();
  const toast = useToast();

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
        if (res.status === 300) {
          const data: InMessage = await res.json();
          setMessageData(data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  if (!userInfo) {
    return <p>사용자가 없습니다.</p>;
  }

  if (!messageData) {
    return <p>메시지 정보가 없습니다.</p>;
  }

  //? 해당 사용자의 홈의 주인인지 확인 (댓글을 달수있는 사람)
  const isOwner = authUser !== null && userInfo.uid === authUser.uid;

  return (
    <ServiceLayout
      title={`${userInfo.displayName}의 홈`}
      boxProps={{ backgroundColor: 'gray.50', minH: '100vh' }}
    >
      <Box maxW={'md'} mx="auto" pt={'6'}>
        <Link href={`/${screenName}`}>
          <a>
            <Button leftIcon={<ChevronLeftIcon />} mb="2" fontSize="sm">
              {screenName} 홈으로
            </Button>
          </a>
        </Link>

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

        <MessageItem
          uid={userInfo.uid}
          displayName={userInfo.displayName ?? ''}
          photoURL={userInfo.photoURL ?? 'https://bit.ly/broken-link'}
          isOwner={isOwner}
          item={messageData}
          onSendComplete={fetchMessageInfo(userInfo.uid, messageData.id)}
        />
      </Box>
    </ServiceLayout>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  query,
}) => {
  const { screenName, messageId } = query;

  const checkScreenName = (name: any) => (Array.isArray(name) ? name[0] : name);

  if (screenName === undefined || messaging === undefined) {
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName,
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
    if (
      userInfoResponse.status !== 200 ||
      userInfoResponse.data === undefined ||
      userInfoResponse.data.uid === undefined
    ) {
      return {
        props: {
          userInfo: null,
          messageData: null,
          screenName: checkScreenName(screenName),
        },
      };
    }

    const messageInfoResponse: AxiosResponse<InMessage> = await axios.get(
      `${baseURL}/api/messages.info?uid=${userInfoResponse.data.uid}&messageId=${messageId}`
    );

    return {
      props: {
        userInfo: userInfoResponse.data,
        messageData:
          messageInfoResponse.status !== 200 ||
          messageInfoResponse.data === undefined
            ? null
            : messageInfoResponse.data,
        screenName: checkScreenName(screenName),
      },
    };
  } catch (error) {
    console.error('error: ', error);
    return {
      props: {
        userInfo: null,
        messageData: null,
        screenName,
      },
    };
  }
};

export default MessagePage;
