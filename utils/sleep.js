export default function sleep (duration) {
  return new Promise(r => setTimeout(r, duration));
}