import {
  Center,
  Spinner,
  Box,
  HStack,
  Heading,
  VStack,
  Button,
  Tooltip,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import useSWR from 'swr';
import Api from 'utils/api';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { RiArrowRightUpLine } from "react-icons/ri";
import { useState, useEffect } from 'react';
import sleep from 'utils/sleep';
import Delay from 'components/Delay';

const Main = () => {
  const router = useRouter();

  return (
    <Box pt={8} pb={20} px={10} pos={'relative'} mx={'auto'} maxW={'1100px'} boxSizing={'border-box'}>
      <Summary blockchain={'tron'} description={'TRON 是 Tron 基金会于 2017 年推出的基于区块链技术的去中心化操作系统，旨在建立一个免费的全球数字内容娱乐系统。TRON 支持智能合约且兼容 EVM 的特性使开发者可以方便快捷地在 TRON 上部署智能合约和构建 DApp。'} showLoading />
      <Box mt={10} />
      <Summary blockchain={'solana'} description={'Solana 是一个高性能的区块链平台，旨在实现扩展性、安全性和去中心化。能够处理大规模交易，并具备低延迟和高吞吐量的特点。Solana 是当前区块链领域备受关注和广泛采用的项目之一。'} />
      <Delay duration={1000}>
        <HStack mt={12} justify={'center'} spacing={5}>
          <Button size='sm' colorScheme='teal' variant={'outline'} onClick={() => router.push('/database')}>Database</Button>
          <Button size='sm' colorScheme='teal' variant={'outline'} onClick={() => {
            if (typeof window !== 'undefined') {
              window.open('https://github.com/okdaodine/explorer');
            }
          }}>Source Code</Button>
        </HStack>
        <FAQ />
      </Delay>
    </Box>
  )
}

const Summary = ({
  blockchain,
  description,
  showLoading,
}) => {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(`Api.summary.get.${blockchain}`, () => Api.summary.get(blockchain), {
    refreshInterval: 2000,
  });
  const [pending, setPending] = useState(true);
  const highlight = useDisclosure();

  useEffect(() => {
    (async () => {
      if (pending) {
        await sleep(200);
        return setPending(false);
      }
      highlight.onOpen();
      await sleep(400);
      highlight.onClose();
    })();
  }, [data, pending])

  if (isLoading) return <Center py={'30vh'}>{showLoading ? <Spinner size={'sm'} color='teal.300' /> : null}</Center>;

  if (error) return <Box p={10} fontSize="sm">failed to load</Box>

  return (
    <Box w={'800px'} bg={'gray.800'} mx={'auto'}>
      <Box border={'1px'} borderColor={'gray.700'} rounded={'lg'}>
        <HStack borderBottomWidth={'1px'} borderColor={'gray.700'}>
          <HStack width={'50%'} spacing={3} py={12} px={10} borderRightWidth={'1px'} borderColor={'gray.700'}>
            <Box rounded={'full'}>
              <Image src={`/${blockchain}.png`} width={50} height={50} />
            </Box>
            <Heading fontSize='30px'>{blockchain.toUpperCase()} explorer</Heading>
          </HStack>

          <VStack align={'flex-start'} width={'50%'} spacing={2} p={4} px={6} alignSelf={'flex-start'}>
            <Box opacity={0.5}>Description</Box>
            <Box opacity={0.85} fontSize={'13px'}>{description}</Box>
          </VStack>
        </HStack>

        <HStack>
          <VStack _hover={{ color: 'teal.300' }} align={'flex-start'} width={'50%'} spacing={2} py={4} px={10} borderRightWidth={'1px'} borderColor={'gray.700'} cursor={'pointer'} onClick={() => { router.push(`/${blockchain}/blocks/${data.latestBlockNumber}`) }}>
            <HStack spacing={2}>
              <Text opacity={0.5}>Latest Block </Text>
              <Box color={'teal.300'} fontSize={'18px'} opacity={0.8}>
                <RiArrowRightUpLine />
              </Box>
            </HStack>
            <Box fontSize={'30px'} letterSpacing={'4px'} fontWeight={'medium'} color={highlight.isOpen ? 'teal.300' : 'gray.300'}>{data.latestBlockNumber}</Box>
          </VStack>
          <VStack _hover={{ color: 'teal.300' }} align={'flex-start'} width={'50%'} spacing={2} py={4} px={10} cursor={'pointer'} onClick={() => { router.push(`/${blockchain}/blocks`) }}>
            <HStack spacing={2}>
              <Text opacity={0.5}>Blocks</Text>
              <Box color={'teal.300'} fontSize={'18px'} opacity={0.8}>
                <RiArrowRightUpLine />
              </Box>
            </HStack>
            <Box fontSize={'30px'} letterSpacing={'4px'} fontWeight={'medium'} color={highlight.isOpen ? 'teal.300' : 'gray.300'}>{data.blockCount}</Box>
          </VStack>
        </HStack>
      </Box>
    </Box>
  )
}

const FAQ = () => {
  return (
    <Box pt={16} w={'600px'} mx={'auto'}>
      <Heading fontSize={'2xl'} pb={8} textAlign={'center'} opacity={0.8}>对于这个小作品，你可能需要知道以下几点哦 👇</Heading>
      <Box px={20}>
        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  (题目)具体是要做什么？
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              尝试用一套通用的格式，索引两条完全不同的链，比如 Tron 和 Solana
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  有同步全量的数据吗？
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              没有呢。全量数据非常非常大，而这只是一个 Demo，所以只同步最新的数据哦。
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  会处理哪些代币呢？
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              暂时只处理主网代币，比如 TRX 和 SOL。并不涉及 TRC20 这样的合约代币哦。
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        <Accordion allowToggle>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex='1' textAlign='left'>
                  这是可拓展的吗？还能继续支持更多功能吗？
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              可以的。只要继续投入时间去开发，可以支持更多的链，更多的代币。
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Box>
    </Box>
  )
}

export default Main;