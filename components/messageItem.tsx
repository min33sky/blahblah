import { InMessage } from '@/types/in_message';
import convertDateToString from '@/utils/convertDateToString';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import React, { useState } from 'react';
import MoreBtnIcon from './MoreBtnIcon';
import FirebaseAuthClient from '@/models/firebase_auth_client';
import { useRouter } from 'next/router';

interface Props {
  uid: string;
  displayName: string;
  screenName: string;
  photoURL: string;
  isOwner: boolean; //? 메시지 작성자만 댓글을 달 수 있다.
  item: InMessage;
  onSendComplete: () => void;
}

function MessageItem({
  uid,
  displayName,
  photoURL,
  isOwner,
  item,
  screenName,
  onSendComplete,
}: Props) {
  const [reply, setReply] = useState('');
  const router = useRouter();
  const toast = useToast();

  const postReply = async () => {
    const res = await fetch('/api/messages.add.reply', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid,
        messageId: item.id,
        reply,
      }),
    });

    setReply('');
    onSendComplete(); //? 답글을 단 메시지의 정보를 업데이트해서 화면에 보여준다.
  };

  const updateMessage = async ({ deny }: { deny: boolean }) => {
    const token =
      await FirebaseAuthClient.getInstance().Auth.currentUser?.getIdToken();
    if (token === undefined) {
      return toast({
        title: '로그인한 사용자만 사용할 수 있는 메뉴입니다.',
      });
    }

    const resp = await fetch('/api/messages.deny', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: token,
      },
      body: JSON.stringify({
        uid,
        messageId: item.id,
        deny,
      }),
    });

    if (resp.status < 300) {
      onSendComplete();
    }
  };

  const haveReply = item.reply !== undefined;

  return (
    <Box borderRadius={'md'} width="full" bg={'white'} boxShadow="md">
      <Box>
        <Flex pl={'2'} pt="2" alignItems={'center'}>
          <Avatar
            size={'xs'}
            src={
              item?.author
                ? item.author.phothURL ?? 'https://bit.ly/broken-link'
                : 'https://bit.ly/broken-link'
            }
          />
          <Text fontSize={'xx-small'} ml="1">
            {item?.author ? item.author.displayName : 'anonymous'}&nbsp;
          </Text>
          <Text whiteSpace={'pre-line'} fontSize="xx-small" color={'gray.500'}>
            {convertDateToString(item.createdAt)}
          </Text>
          <Spacer />
          {isOwner && (
            <Menu>
              <MenuButton
                as={IconButton}
                icon={<MoreBtnIcon />}
                width="24px"
                height="24px"
                borderRadius="full"
                size="xs"
                variant="link"
              />
              <MenuList>
                <MenuItem
                  onClick={() =>
                    updateMessage({ deny: item.deny ? false : true })
                  }
                >
                  {item.deny ? '비공개 처리 해제' : '비공개 처리'}
                </MenuItem>
                <MenuItem
                  onClick={() => router.push(`/${screenName}/${item.id}`)}
                >
                  메시지 상세 보기
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </Box>
      <Box p={'2'}>
        <Box borderRadius={'md'} borderWidth="1px" p="2">
          <Text whiteSpace={'pre-line'} fontSize="sm">
            {item?.message}
          </Text>
        </Box>

        {
          //* 댓글 보여주는 부분
          haveReply && (
            <Box pt="2">
              <Divider />

              <Box display={'flex'} mt="2">
                <Box pt={'2'}>
                  <Avatar size={'xs'} src={photoURL} mr="2" />
                </Box>

                <Box borderRadius={'md'} p="2" width={'full'} bg="gray.100">
                  <Flex alignItems={'center'}>
                    <Text fontSize={'xs'}>{displayName}&nbsp;</Text>
                    <Text whiteSpace={'pre-line'} fontSize="xs" color={'gray'}>
                      {convertDateToString(item.replyAt!)}
                    </Text>
                  </Flex>
                  <Text whiteSpace={'pre-line'} fontSize="xs">
                    {item.reply}
                  </Text>
                </Box>
              </Box>
            </Box>
          )
        }

        {
          //* 댓글 등록 폼
          haveReply === false && isOwner && (
            <Box pt={'2'}>
              <Divider />
              <Box display={'flex'} mt="2">
                <Box pt={'1'}>
                  <Avatar size={'xs'} src={photoURL} mr="2" />
                </Box>
                <Box borderRadius={'md'} width="full" bg="gray.100" mr="2">
                  <Textarea
                    border={'none'}
                    boxShadow="none !important"
                    resize={'none'}
                    minH="unset"
                    overflow={'hidden'}
                    fontSize="xs"
                    as={ResizeTextArea}
                    value={reply}
                    onChange={(e) => setReply(e.currentTarget.value)}
                    placeholder="댓글을 입력하세요..."
                  />
                </Box>
                <Button
                  disabled={reply.length === 0 || reply.trim() === ''}
                  onClick={postReply}
                  bgColor={'#FF75B5'}
                  colorScheme="pink"
                  variant={'solid'}
                  size="sm"
                >
                  등록
                </Button>
              </Box>
            </Box>
          )
        }
      </Box>
    </Box>
  );
}

export default React.memo(MessageItem);
