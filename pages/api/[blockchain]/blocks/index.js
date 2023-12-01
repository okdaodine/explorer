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
  const blocks = await Block.findAll({
    raw: true,
    attributes: { exclude: ['id', 'blockchain'] },
    where: {
      blockchain: req.query.blockchain,
    },
    order: [['id', 'desc']],
    limit: Math.min(~~req.query.limit || 10, 100),
    offset: ~~req.query.offset || 0
  });
  res.status(200).json(blocks);
}