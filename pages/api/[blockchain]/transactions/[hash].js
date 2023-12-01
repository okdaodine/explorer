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
  const events = await Event.findAll({
    raw: true,
    attributes: { exclude: ['id', 'blockchain'] },
    where: {
      blockchain: req.query.blockchain,
      transaction: req.query.hash,
    }
  });

  if (events.length === 0) {
    return res.status(404).json(null);
  }

  const block = await Block.findOne({
    raw: true,
    attributes: { exclude: ['id', 'blockchain'] },
    where: {
      blockchain: req.query.blockchain,
      number: events[0].block,
    }
  });

  res.status(200).json({
    block,
    events,
  });
}