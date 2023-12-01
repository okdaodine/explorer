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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Tooltip,
} from '@chakra-ui/react';
import useSWR from 'swr';
import Api from 'utils/api';
import formatDate from 'utils/formatDate';
import { useRouter } from 'next/router';
import CopyTag from 'components/CopyTag';

const Main = () => {
  const router = useRouter();
  const { blockchain } = router.query;

  if (!blockchain) {
    return null;
  }

  return (
    <Box pt={4} px={10} pb={20} pos={'relative'} mx={'auto'} maxW={'1100px'} boxSizing={'border-box'}>

      <Breadcrumb opacity={0.7} pb={5} fontSize={'14px'}>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => router.push(`/`)} opacity={0.6}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => router.push(`/`)} opacity={0.6}>{blockchain}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Blocks</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Blocks blockchain={blockchain} />
    </Box>
  )
}

const Blocks = ({ blockchain }) => {
  const router = useRouter();
  const limit = 100;
  const offset = 0;
  const { data, error, isLoading } = useSWR(`Api.blocks.list.${blockchain}.limit=${limit}&offset=${offset}`, () => Api.blocks.list(blockchain, { limit, offset }), {
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
              <Td>Block id</Td>
              <Td>Block Hash</Td>
              <Td>Events</Td>
              <Td>Time</Td>
            </Tr>
          </Thead>
          <Tbody>
            {data.map(item => {
              return (
                <Tr key={item.id} _hover={{ bg: 'gray.800' }}>
                  <Td py={3} textDecoration={'underline'} textUnderlineOffset={'4px'}><CopyTag text={`${item.number}`} length={20} onClick={() => { router.push(`/${blockchain}/blocks/${item.number}`) }} /></Td>
                  <Td py={3}><CopyTag text={item.hash} length={20} onClick={() => { router.push(`/${blockchain}/blocks/${item.number}`) }} /></Td>
                  <Td py={3}>{item.eventCount}</Td>
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