import { Box, BoxProps } from '@chakra-ui/react';
import Head from 'next/head';
import React from 'react';
import GNB from '../GNB';

interface Props {
  title?: string;
  children: React.ReactNode;
  boxProps?: BoxProps;
}

function ServiceLayout({ title = 'blah x2', children, boxProps }: Props) {
  return (
    <Box {...boxProps}>
      <Head>
        <title>{title}</title>
      </Head>
      <GNB />
      {children}
    </Box>
  );
}

export default ServiceLayout;
