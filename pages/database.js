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
  Tooltip,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import useSWR from 'swr';
import Api from 'utils/api';
import formatDate from 'utils/formatDate';
import { useRouter } from 'next/router';
import CopyTag from 'components/CopyTag';

const Main = () => {
  const router = useRouter();

  return (
    <Box pt={8} px={10} pb={10} pos={'relative'} mx={'auto'} maxW={'1200px'} boxSizing={'border-box'}>

      <Breadcrumb opacity={0.7} pb={6} fontSize={'14px'}>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => router.push(`/`)} opacity={0.6}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink>Database</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Transactions />
    </Box>
  )
}

const Transactions = () => {
  const limit = 100;
  const offset = 0;
  const { data, error, isLoading } = useSWR(`Api.transactions.listAll.limit=${limit}&offset=${offset}`, () => Api.transactions.listAll({ limit, offset }), {
    refreshInterval: 2000
  });

  if (isLoading) return <Center py={'30vh'}><Spinner size={'sm'} color='teal.300' /></Center>;

  if (error) return <Box p={10} fontSize="sm">failed to load</Box>

  return (
    <Box>
      <TableContainer>
        <Table size={'sm'} variant={'simple'}>
          <Thead>
            <Tr fontWeight={'bold'}>
              <Td>Blockchain</Td>
              <Td>Block</Td>
              <Td>Transaction</Td>
              <Td>Address</Td>
              <Td>Effect</Td>
              <Td>Failed</Td>
              <Td>SortKey</Td>
              <Td>Time</Td>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(item => {
              return (
                <Tr key={item.id} cursor={'pointer'} _hover={{ bg: 'gray.800' }}>
                  <Td py={3}>{item.blockchain.toUpperCase()}</Td>
                  <Td py={3}>{item.block}</Td>
                  <Td py={3}><CopyTag text={item.transaction} length={6} /></Td>
                  <Td py={3}><CopyTag text={item.address} length={6} /></Td>
                  <Td py={3}>{item.effect}</Td>
                  <Td py={3}>{item.failed ? 'false' : 'true'}</Td>
                  <Td py={3}>{item.sort_key}</Td>
                  <Td py={3} opacity={0.8}>{formatDate(new Date(item.time))}</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Center py={10}>
        <Tooltip label={`暂未实现分页功能`} fontSize={'sm'} hasArrow placement='top' rounded={'lg'}>
          <Button size='sm' colorScheme='teal' variant={'outline'}>Load more</Button>
        </Tooltip>
      </Center>
    </Box>
  )
}

export default Main;