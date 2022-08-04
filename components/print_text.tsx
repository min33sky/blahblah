import { Text } from '@chakra-ui/react';
import React from 'react';

function PrintText({ printText }: { printText: string }) {
  const textCount = printText.length;
  const usedText =
    textCount > 200 ? `${printText.substring(0, 199)} ...` : printText;

  return (
    <Text
      whiteSpace={'pre-line'}
      p="6"
      position={'absolute'}
      fontSize="32px"
      fontFamily={'Pretendard'}
    >
      {usedText}
    </Text>
  );
}

export default PrintText;
