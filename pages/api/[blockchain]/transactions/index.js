import Events from 'database/event';

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
  const events = await Events.findAll({
    raw: true,
    attributes: { exclude: ['id'] },
    where: {
      blockchain: req.query.blockchain,
    },
    limit: Math.min(~~req.query.limit || 10, 100),
    offset: ~~req.query.offset || 0
  });
  res.status(200).json(events);
}