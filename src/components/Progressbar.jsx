import { useState, useEffect } from "react";

export default function Progressbar({ timer }) {
  const [timeRemaining, setTimeRemaining] = useState(timer);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      console.log("Interval");
      setTimeRemaining((prevState) => prevState - 10);
    }, 10);

    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  return <progress value={timeRemaining} max={timer} />;
}
