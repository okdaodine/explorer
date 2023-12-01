export default async function handler(req, res) {
  console.log(req.body);
  res.end(JSON.stringify({ result: 'pong' }));
}
