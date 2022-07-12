import { InMessage } from '@/types/in_message';
import convertDateToString from '@/utils/convertDateToString';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Text,
  Textarea,
} from '@chakra-ui/react';
import ResizeTextArea from 'react-textarea-autosize';
import React from 'react';

interface Props {
  uid: string;
  displayName: string;
  photoURL: string;
  isOwner: boolean; //? 메시지 작성자만 댓글을 달 수 있다.
  item: InMessage;
}

function MessageItem({ displayName, photoURL, isOwner, item }: Props) {
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
            1일
          </Text>
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
                    placeholder="댓글을 입력하세요..."
                  />
                </Box>
                <Button
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

export default MessageItem;
