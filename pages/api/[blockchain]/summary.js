import Block from 'database/block';

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
  const latestBlock = await Block.findOne({
    raw: true,
    attributes: ['number'],
    where: {
      blockchain: req.query.blockchain,
    },
    order: [['id', 'desc']],
  });
  const blockCount = await Block.count({
    where: {
      blockchain: req.query.blockchain,
    },
  });
  res.status(200).json({
    latestBlockNumber: latestBlock ? latestBlock.number : 0,
    blockCount,
  });
}