import axios from 'axios';
import _ from 'lodash';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig()
const SOLANA_NODE = publicRuntimeConfig.NEXT_PUBLIC_SOLANA_NODE_API;

async function main(blockId) {

  try {
    const blockRes = await axios.post(SOLANA_NODE, {
      method: 'getBlock',
      params: [blockId, {
        transactionDetails: 'full',
        rewards: false,
        encoding: 'jsonParsed',
        maxSupportedTransactionVersion: 0,
      }],
      id: 0,
      jsonrpc: '2.0',
    });

    const block = blockRes.data.result;

    if (!block) {
      return null;
    }

    let events = [];
    let sort_key = 0;

    for (const transaction of block.transactions) {
      if (transaction.meta.err) {
        continue;
      }

      if (transaction.transaction.message.instructions.length === 1 && transaction.transaction.message.instructions[0].programId === 'Vote111111111111111111111111111111111111111') {
        continue;
      }

      transaction.meta.postBalances[0] += transaction.meta.fee;

      if (_.difference(transaction.meta.preBalances, transaction.meta.postBalances).length > 0) {
        for (const [key, value] of Object.entries(transaction.transaction.message.accountKeys)) {
          const delta = transaction.meta.postBalances[key] - transaction.meta.preBalances[key];
          if (key === '0' && !value.signer) {
            throw new Error('First account is not the signer');
          }
          if (delta) {
            events.push({
              transaction: transaction.transaction.signatures[0],
              address: value.pubkey,
              sort_key: sort_key++,
              effect: String(delta),
            });
          }
        }
      }
    }
    
    events = events.map(event => ({
      ...event,
      block: blockId,
      time: new Date(block.blockTime * 1000),
    }));

    const result = {
      block: {
        number: blockId,
        hash: block.blockhash,
        time: new Date(block.blockTime * 1000),
      },
      events,
    }

    return result;
  } catch (err) {
    console.log(err);
  }
}

export default main;
