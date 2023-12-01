import axios from 'axios';
import bs58 from 'bs58';
import crypto from 'crypto';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig()
const TRON_NODE = publicRuntimeConfig.NEXT_PUBLIC_TRON_NODE_API;

async function main(blockId) {
  const transactionData = {};

  try {
    const [generalRes, evmRes, receiptRes] = await Promise.all([
      axios.post(`${TRON_NODE}/walletsolidity/getblockbynum`, { num: blockId }),
      axios.post(`${TRON_NODE}/jsonrpc`, {
        method: 'eth_getBlockByNumber',
        params: [blockId, true],
        id: 1,
        jsonrpc: '2.0',
      }),
      axios.post(`${TRON_NODE}/walletsolidity/gettransactioninfobyblocknum`, { num: blockId }),
    ]);

    if (!generalRes.data || !evmRes.data || !receiptRes.data) {
      return null;
    }

    const generateData = generalRes.data.transactions || [];
    const evmTransactionsData = evmRes.data.result.transactions;
    const receiptData = receiptRes.data;
    const blockTime = generalRes.data.block_header.raw_data.timestamp || '1529891469000';

    if (generateData.length !== receiptData.length || generateData.length !== evmTransactionsData.length) {
      throw new Error('Mismatch in transaction count');
    }

    for (let i = 0; i < generateData.length; i++) {
      if (
        receiptData.length > 0 &&
        generateData[i].txID !== receiptData[i].id &&
        generateData[i].txID != evmTransactionsData[i].hash.substring(2)
      ) {
        throw new Error('Mismatch in transaction order');
      }

      if (!generateData[i].raw_data.contract[0].parameter.value) {
        throw new Error(`Error in transaction ${generateData[i].txID} data: no raw_data.contract.parameter.value`);
      }

      if (!generateData[i].raw_data.contract.length > 1) {
        throw new Error(`Error in transaction ${generateData[i].txID} data: more than 1 raw_data.contract element`);
      }

      if (generateData[i].ret && generateData[i].ret.length > 1) { // found in block 9972983
        for (const ret of generateData[i].ret) {
          if (ret.contractRet) {
            generateData[i].ret = ret;
            break;
          }
        }
      }

      if (!generateData[i].raw_data.contract[0].type) {
        throw new Error(`Contract interaction type missing in ${generateData[i].txID}.`);
      }

      const data = generateData[i].raw_data.contract[0].parameter.value;
      const transactionType = generateData[i].raw_data.contract[0].type;

      switch (transactionType) {
        case 'AccountCreateContract': {
          transactionData[generateData[i].txID] = {
            from: addressToBase58(data.owner_address),
            to: addressToBase58(data.account_address),
            value: 0,
            contractAddress: null,
            fee: receiptData[i].fee || 0,
            status: (generateData[i].ret[0].contractRet || 'SUCCESS') != 'SUCCESS',
          };
          break;
        }
        case 'TransferContract': {
          transactionData[generateData[i].txID] = {
            from: addressToBase58(data.owner_address),
            to: addressToBase58(data.to_address),
            value: data.amount || 0,
            contractAddress: null,
            fee: receiptData[i].fee || 0,
            status: (generateData[i].ret[0].contractRet || 'SUCCESS') != 'SUCCESS',
          };
          break;
        }
        case 'DelegateResourceContract': {
          transactionData[generateData[i].txID] = {
            from: addressToBase58(data.owner_address),
            to: addressToBase58(data.receiver_address),
            value: data.balance,
            contractAddress: null,
            fee: receiptData[i].fee || 0,
            status: (generateData[i].ret[0].contractRet || 'SUCCESS') != 'SUCCESS',
          };
          break;
        }
        case 'UndelegateResourceContract': {
          transactionData[generateData[i].txID] = {
            from: addressToBase58(data.receiver_address),
            to: addressToBase58(data.owner_address),
            value: data.balance,
            contractAddress: null,
            fee: receiptData[i].fee || 0,
            status: (generateData[i].ret[0].contractRet || 'SUCCESS') != 'SUCCESS',
          };
          break;
        }
        default: {
          const from = addressToBase58(evmTransactionsData[i].from);
          const to = addressToBase58(evmTransactionsData[i].to);
          let value = hexToInt(evmTransactionsData[i].value);
          if (transactionType === 'TriggerSmartContract') {
            value = 0;
          }
          const fee = (receiptData[i].fee || 0) + (receiptData[i].shielded_transaction_fee || 0);
          transactionData[generateData[i].txID] = {
            from,
            to,
            value,
            contractAddress: null,
            fee,
            status: (generateData[i].ret[0].contractRet || 'SUCCESS') != 'SUCCESS',
          };
          break;
        }
      }
    }

    const processed = Object.keys(transactionData).length;
    const transactionCount = generateData.length;
    if (processed != transactionCount) {
      throw new Error(`Some transactions left unprocessed: ${processed}/${transactionCount}`);
    }

    let events = [];
    let ijk = 0;

    for (const [transactionHash, transaction] of Object.entries(transactionData)) {
      const burned = String(transaction.fee);
      if (burned !== '0') {
        events.push({
          transaction: transactionHash,
          address: transaction.from || transaction.to,
          sort_in_block: ijk,
          sort_in_transaction: 0,
          effect: `-${burned}`,
          failed: false,
        });
        events.push({
          transaction: transactionHash,
          address: 'the-void',
          sort_in_block: ijk,
          sort_in_transaction: 1,
          effect: burned,
          failed: false,
        });
      }

      const value = transaction.value < 0 ? Number(String(transaction.value).substring(1)) : transaction.value;
      events.push({
        transaction: transactionHash,
        address: transaction.from || 'the-void',
        sort_in_block: ijk,
        sort_in_transaction: 4,
        effect: `-${value}`,
        failed: transaction.status,
      });

      const recipient = transaction.to || transaction.contractAddress || 'the-void';
      events.push({
        transaction: transactionHash,
        address: recipient,
        sort_in_block: ijk++,
        sort_in_transaction: 5,
        effect: `${value}`,
        failed: transaction.status,
      });
    }

    events = events.map(event => ({
      ...event,
      block: blockId,
      time: new Date(blockTime),
    }));

    events = events.sort((a, b) => {
      if (a.sort_in_block === b.sort_in_block) {
        return a.sort_in_transaction - b.sort_in_transaction;
      } else {
        return a.sort_in_block - b.sort_in_block;
      }
    });
    
    let sortKey = 0;

    events = events.map(event => {
      event.sort_key = sortKey;
      sortKey++;
      delete event.sort_in_block;
      delete event.sort_in_transaction;
      return event;
    })

    const result = {
      block: {
        number: blockId,
        hash: evmRes.data.result.hash.replace('0x', ''),
        time: new Date(blockTime),
      },
      events,
    }

    return result;
  } catch (err) {
    console.log(err);
  }
}

const sha256 = (msg) => crypto.createHash('sha256').update(Buffer.from(msg, 'hex')).digest('hex')
function addressToBase58(address) {
  if (!address) {
    return address;
  }
  const addr = address?.startsWith('0x') ? `41${address.substring(2)}` : address;
  const doubleSha256 = sha256(sha256(addr))
  const checkSum = doubleSha256.substring(0, 8)
  const hex = Buffer.from(addr + checkSum, 'hex')
  const buffer = Buffer.from(hex, 'hex');
  return bs58.encode(buffer);
}

function hexToInt(hex) {
  return parseInt(hex, 16);
}

export default main;
