import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Center,
  Spinner,
  HStack,
  VStack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Tag,
} from '@chakra-ui/react';
import useSWR from 'swr';
import Api from 'utils/api';
import formatDate from 'utils/formatDate';
import { useRouter } from 'next/router';
import CopyTag from 'components/CopyTag';

const Main = () => {
  const router = useRouter();
  const { blockchain, number } = router.query;

  if (!blockchain || !number) {
    return null;
  }

  return (
    <Box pt={8} px={10} pos={'relative'} mx={'auto'} maxW={'1100px'} boxSizing={'border-box'}>

      <Breadcrumb opacity={0.7} pb={5} fontSize={'14px'}>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => router.push(`/`)} opacity={0.6}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => router.push(`/`)} opacity={0.6}>{blockchain}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem opacity={0.6}>
          <BreadcrumbLink onClick={() => router.push(`/${blockchain}/blocks`)}>Blocks</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{number}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <BlockDetail blockchain={blockchain} number={number} />
    </Box>
  )
}

const BlockDetail = ({ blockchain, number }) => {
  const router = useRouter();
  const limit = 100;
  const offset = 0;
  const { data, error, isLoading } = useSWR(`Api.blocks.get.${blockchain}.${number}.limit=${limit}.offset=${offset}`, () => Api.blocks.get(blockchain, number, { limit, offset }));

  if (isLoading) return <Center py={'30vh'}><Spinner size={'sm'} color='teal.300' /></Center>;

  if (error) return <Box p={10} fontSize="sm">failed to load</Box>

  return (
    <Box pb={20}>
      <Box border={'1px'} borderColor={'gray.700'} rounded={'lg'}>
        <HStack spacing={0}>
          <VStack align={'flex-start'} width={'30%'} spacing={3} px={10} fontSize={'32px'}>
            <Box opacity={0.5} fontSize={'24px'}>Block id</Box>
            <CopyTag text={number} fontSize={'32px'} />
          </VStack>
          <VStack flex={1} borderLeftWidth={'1px'} borderColor={'gray.700'} >
            <VStack align={'flex-start'} w={'full'} height={'50%'} spacing={2} pt={4} pb={6} px={6} alignSelf={'flex-start'} borderBottomWidth={'1px'} borderColor={'gray.700'}>
              <Box opacity={0.5}>Blockchain</Box>
              <Box fontSize={'20px'}>{blockchain.toUpperCase()}</Box>
            </VStack>
            <VStack align={'flex-start'} w={'full'} height={'50%'} spacing={2} pt={4} pb={6} px={6} alignSelf={'flex-start'}>
              <Box opacity={0.5}>Block Hash</Box>
              <CopyTag text={data.block.hash} />
            </VStack>
          </VStack>
        </HStack>
      </Box>

      <Box pt={8}>
        <Box pb={4} fontSize={'26px'} fontWeight={'bold'} opacity={0.8}>Events</Box>
        <TableContainer>
          <Table size={'sm'} variant={'simple'}>
            <Thead>
              <Tr fontWeight={'bold'}>
                <Td>Transaction id</Td>
                <Td>Address</Td>
                <Td>Amount</Td>
                <Td>Status</Td>
                <Td>Time</Td>
              </Tr>
            </Thead>
            <Tbody>
              {data.events.map(item => {
                return (
                  <Tr key={item.id} _hover={{ bg: 'gray.800' }}>
                    <Td py={3}><CopyTag text={item.transaction} length={10} onClick={() => { router.push(`/${blockchain}/transactions/${item.transaction}`) }} /></Td>
                    <Td py={3}><CopyTag text={item.address} length={10} /></Td>
                    <Td py={3}>{item.effect}</Td>
                    <Td py={3}>{<Tag size={'sm'} fontWeight={'bold'} colorScheme={item.failed ? 'red' : 'green'}>{item.failed ? 'Failed' : 'Success'}</Tag>}</Td>
                    <Td py={3} opacity={0.8}>{formatDate(new Date(item.time))}</Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default Main;