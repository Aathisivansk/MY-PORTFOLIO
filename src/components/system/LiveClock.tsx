
"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function LiveClock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!time) {
    return <div className="text-foreground font-medium text-sm w-24 text-center"></div>;
  }

  return (
    <div className="text-foreground font-medium text-sm w-24 text-center">
      {time ? format(time, 'h:mm:ss a') : ''}
    </div>
  );
}
