import { useState, useEffect, useRef } from "react";

interface ListItem {
  id: number;
  value: number;
}

const VirtualList = () => {
  const [items, setItems] = useState<ListItem[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 40; // height of each item in pixels
  const visibleItems = 10; // number of items visible at once
  const totalItems = 1000;
  const containerHeight = visibleItems * itemHeight;
  const totalHeight = totalItems * itemHeight;

  // Generate initial data
  useEffect(() => {
    const initialData = Array.from({ length: totalItems }, (_, index) => ({
      id: index,
      value: Math.random() * 100,
    }));
    setItems(initialData);
  }, []);

  // Live update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setItems((currentItems) => {
        const randomIndex = Math.floor(Math.random() * totalItems);
        const newItems = [...currentItems];
        newItems[randomIndex] = {
          ...newItems[randomIndex],
          value: Math.random() * 100,
        };
        return newItems;
      });
    }, 100); // Update every 100ms

    return () => clearInterval(interval);
  }, []);

  // Handle scroll
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const newStartIndex = Math.floor(scrollTop / itemHeight);
    setStartIndex(newStartIndex);
  };

  // Calculate visible items
  const visibleData = items.slice(startIndex, startIndex + visibleItems);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="overflow-auto relative bg-slate-800/50 rounded-lg"
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: startIndex * itemHeight,
            width: "100%",
          }}
        >
          {visibleData.map((item) => (
            <div
              key={item.id}
              className="p-2 border-b border-slate-700 text-slate-200 transition-colors hover:bg-slate-700/50"
              style={{ height: itemHeight }}
            >
              ID: {item.id} - Value: {item.value.toFixed(2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;
