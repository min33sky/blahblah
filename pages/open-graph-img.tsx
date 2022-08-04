import PrintText from '@/components/print_text';
import { Box, Img } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

function OpenGraphImgPage() {
  const { query } = useRouter();
  const text = query.text ?? '';
  const printText = Array.isArray(text) ? text[0] : text;

  return (
    <Box width={'full'} bgColor="white" p="25px" pt="50px" borderRadius={'lg'}>
      <PrintText printText={printText} />
      <Img src="/screenshot_bg.svg" alt="frame" />
    </Box>
  );
}

export default OpenGraphImgPage;
