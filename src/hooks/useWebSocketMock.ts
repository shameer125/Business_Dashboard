import { useState, useEffect } from 'react';

export interface LiveMetric {
  value: number;
  change: number;
}


export function useWebSocketMock() {
  const [metrics, setMetrics] = useState<Record<string, LiveMetric>>({
    revenue: { value: 45231.89, change: 20.1 },
    subscriptions: { value: 2350, change: 180.1 },
    activeNow: { value: 573, change: 201 },
    sales: { value: 12234, change: 19 },
  });

  
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) => {
        const activeNowChange = Math.floor(Math.random() * 21) - 10;
        const newActiveNow = Math.max(100, prev.activeNow.value + activeNowChange);
        
        return {
          ...prev,
          activeNow: { 
            value: newActiveNow, 
            change: activeNowChange 
          }
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}
