import {
  Box,
  Tooltip,
  useClipboard,
  useToast,
  HStack,
} from '@chakra-ui/react';
import { BiCopy } from 'react-icons/bi';

const CopyTag = ({ value, text = '', length = 999, onClick, fontSize }) => {
  const { onCopy } = useClipboard(value || text);
  const toast = useToast();

  return (
    <HStack>
      <Tooltip label={`${value || text}`} fontSize={'sm'} hasArrow placement='top' rounded={'lg'} openDelay={500}>
        <Box
          onClick={() => {
            if (onClick) {
              onClick();
            }
          }}
          cursor={onClick ? 'pointer' : 'auto'}
          _hover={{ color: 'teal.300' }}
          fontSize={fontSize || '14px'}
        >
          {text.length <= length && <Box>{text}</Box>}
          {text.length > length && (
            <Box>{`${text.slice(0, length,)}......${text.slice(-length)}`}</Box>
          )}
        </Box>
      </Tooltip>
      <Tooltip label={`Copy`} fontSize={'sm'} hasArrow placement='top' rounded={'lg'}>
        <Box color='teal.300' cursor={'pointer'} onClick={(e) => {
          onCopy();
          toast({
            title: 'Copied',
            status: 'success',
            duration: 2000,
          });
          e.stopPropagation();
        }}>
          <BiCopy />
        </Box>
      </Tooltip>
    </HStack>
  )
}

export default CopyTag;