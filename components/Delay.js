import { useEffect, useState } from "react";

const Delay = ({ children, duration }) => {
  const [pending, setPending] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setPending(false);
    }, duration);
  }, []);

  if (pending) return null;

  return children;
}

export default Delay;