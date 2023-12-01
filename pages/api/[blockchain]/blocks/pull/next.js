import Block from 'database/block';
import Event from 'database/event';
import pullTronBlock from 'utils/pull/tron';
import pullSolanaBlock from 'utils/pull/solana';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      await GET(req, res);
    } else {
      res.status(405).end();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

let cache = {};

async function GET(req, res) {
  const latestBlock = await Block.findOne({
    raw: true,
    where: {
      blockchain: req.query.blockchain,
    },
    attributes: ['number'],
    limit: 1,
    order: [['number', 'desc']],
  });

  if (!latestBlock) {
    return res.status(400).json({ message: 'No any blocks' });  
  }

  if (!cache[req.query.blockchain]) {
    cache[req.query.blockchain] = latestBlock.number + 1;
  }

  const blockNumber = Math.max(latestBlock.number + 1, cache[req.query.blockchain]);

  const result = req.query.blockchain === 'tron' ?
    await pullTronBlock(blockNumber) :
    await pullSolanaBlock(blockNumber);

  if (!result) {

    cache[req.query.blockchain] += 1;

    return res.status(200).json({
      message: 'Block not found.',
      data: {
        cur: cache[req.query.blockchain] - 1,
        next: cache[req.query.blockchain],
      }
    });  
  }

  cache[req.query.blockchain] = blockNumber;

  const { block, events } = result;

  const exists = await Block.findOne({
    where: {
      blockchain: req.query.blockchain,
      number: block.number,
    }
  });

  if (exists) {
    return res.status(400).json({ message: `Block exists.`, exists });  
  }
  
  await Block.create({
    blockchain: req.query.blockchain,
    number: block.number,
    hash: block.hash,
    time: block.time,
    eventCount: events.length,
  });

  await Event.bulkCreate(events.map(event => ({
    ...event,
    blockchain: req.query.blockchain,
  })));

  res.status(200).json({
    ok: true,
    data: {
      blockchain: req.query.blockchain,
      number: block.number,
    }
  });
}
