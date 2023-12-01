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

async function GET(req, res) {
  const result = req.query.blockchain === 'tron' ? await pullTronBlock(Number(req.query.number)) : await pullSolanaBlock(Number(req.query.number));

  if (!result) {
    return res.status(404).json({ message: 'Block not found.' });  
  }

  const { block, events } = result;

  const exists = await Block.findOne({
    where: {
      blockchain: req.query.blockchain,
      number: Number(req.query.number),
    }
  });

  if (exists) {
    return res.status(400).json({ message: `Block exists.`, exists });  
  }
  
  await Block.create({
    blockchain: req.query.blockchain,
    number: Number(req.query.number),
    hash: block.hash,
    time: block.time,
    eventCount: events.length,
  });

  await Event.bulkCreate(events.map(event => ({
    ...event,
    blockchain: req.query.blockchain,
  })));

  res.status(200).json({ ok: true });
}