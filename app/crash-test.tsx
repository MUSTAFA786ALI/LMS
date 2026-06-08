import React, { useEffect, useState } from 'react';
import * as Sentry from '@sentry/react-native';

export default function CrashTest() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count === 0) {
      Sentry.captureException(
        new Error('Infinite Loop Simulation')
      );
    }

    setCount(count + 1);
  }, [count]);

  return null;
}