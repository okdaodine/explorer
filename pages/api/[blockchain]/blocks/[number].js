import Block from 'database/block';
import Event from 'database/event';

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
  const block = await Block.findOne({
    raw: true,
    attributes: { exclude: ['id', 'blockchain'] },
    where: {
      blockchain: req.query.blockchain,
      number: Number(req.query.number),
    }
  });
  const events = await Event.findAll({
    raw: true,
    attributes: { exclude: ['id', 'blockchain', 'block'] },
    where: {
      blockchain: req.query.blockchain,
      block: Number(req.query.number),
    },
    limit: Math.min(~~req.query.limit || 10, 100),
    offset: ~~req.query.offset || 0
  });
  res.status(200).json({
    block,
    events,
  });
}