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
} from '@chakra-ui/react';
import useSWR from 'swr';
import Api from 'utils/api';
import { useRouter } from 'next/router';
import CopyTag from 'components/CopyTag';

const Main = () => {
  const router = useRouter();
  const { blockchain, hash } = router.query;

  if (!blockchain || !hash) {
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
          <BreadcrumbLink>Transactions</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>{hash}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <TransactionDetail blockchain={blockchain} hash={hash} />
    </Box>
  )
}

const TransactionDetail = ({ blockchain, hash }) => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`Api.transactions.get.${blockchain}.${hash}`, () => Api.transactions.get(blockchain, hash));

  if (isLoading) return <Center py={'30vh'}><Spinner size={'sm'} color='teal.300' /></Center>;

  if (error) return <Box p={10} fontSize="sm">failed to load</Box>

  return (
    <Box pt={2} pb={20}>

      <Box border={'1px'} borderColor={'gray.700'} rounded={'lg'}>
        <VStack w={'full'} align={'flex-start'} spacing={2} pt={4} pb={6} px={6} borderBottomWidth={'1px'} borderColor={'gray.700'}>
          <Box opacity={0.5}>Transaction id</Box>
          <CopyTag text={hash} fontSize={'16px'} />
        </VStack>
        <HStack flex={1} borderBottomWidth={'1px'} borderColor={'gray.700'} spacing={0}>
          <VStack align={'flex-start'} width={'50%'} spacing={2} pt={4} pb={6} px={6} alignSelf={'flex-start'} borderRightWidth={'1px'} borderColor={'gray.700'}>
            <Box opacity={0.5}>In block</Box>
            <Box textDecoration={'underline'} textUnderlineOffset={'4px'}>
              <CopyTag text={`${data.block.number}`} length={10} fontSize={'20px'} onClick={() => router.push(`/${blockchain}/blocks/${data.block.number}`)} />
            </Box>
          </VStack>
          <VStack align={'flex-start'} width={'50%'} height={'50%'} spacing={2} pt={4} pb={6} px={6} alignSelf={'flex-start'} borderRightWidth={'1px'} borderColor={'gray.700'}>
            <Box opacity={0.5}>Blockchain</Box>
            <Box fontSize={'20px'}>{blockchain.toUpperCase()}</Box>
          </VStack>
        </HStack>
      </Box>

      <Box pt={10}>
        <TableContainer>
          <Table size={'sm'} variant={'simple'}>
            <Thead>
              <Tr fontWeight={'bold'}>
                <Td py={3}>Senders</Td>
                <Td py={3}>Recipients</Td>
                <Td py={3}>Amount transferred</Td>
              </Tr>
            </Thead>
            <Tbody>
              <Tr hover={{ bg: 'gray.800' }}>
                <Td py={5}><CopyTag text={data.events.find(item => item.effect.startsWith('-'))?.address} /></Td>
                <Td py={5}><CopyTag text={data.events.find(item => !item.effect.startsWith('-') && item.address.length > 10)?.address} /></Td>
                <Td py={5}>{data.events.find(item => Number(item.effect) > 0)?.effect || '0'}</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
}

export default Main;