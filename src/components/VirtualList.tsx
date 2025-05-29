import { useState, useEffect, useRef, useCallback } from "react";
import { FixedSizeList as List } from "react-window";
import type { LiveDataItem } from "../data/marketData";
import {
  generateInitialData,
  updateMarketData,
  formatters,
} from "../data/marketData";

const LiveDataVirtualList = () => {
  const [items, setItems] = useState<LiveDataItem[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "connecting" | "disconnected"
  >("connecting");
  const [totalUpdates, setTotalUpdates] = useState(0);

  const listRef = useRef<List>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const updateCounterRef = useRef(0);

  const itemHeight = 65;
  const totalItems = 1000;
  const containerHeight = 600;

  // Initialize data
  useEffect(() => {
    setItems(generateInitialData(totalItems));
    setConnectionStatus("connected");
  }, [totalItems]);

  // Simulate realistic WebSocket data stream
  useEffect(() => {
    const simulateWebSocketData = () => {
      setItems((currentItems) => {
        const newItems = updateMarketData(currentItems);

        // Update counters
        const updatedCount = newItems.filter(
          (item, i) => item.lastUpdate !== currentItems[i].lastUpdate
        ).length;
        updateCounterRef.current += updatedCount;
        setTotalUpdates(updateCounterRef.current);

        return newItems;
      });
    };

    // Simulate connection states
    const connectionInterval = setInterval(() => {
      if (Math.random() < 0.02) {
        // 2% chance of connection issue
        setConnectionStatus("disconnected");
        setTimeout(() => {
          setConnectionStatus("connecting");
          setTimeout(() => setConnectionStatus("connected"), 1000);
        }, 2000);
      }
    }, 5000);

    // Variable update frequency to simulate real network conditions
    let updateInterval: ReturnType<typeof setTimeout>;

    const scheduleNextUpdate = () => {
      // Adaptive frequency: faster when scrolling is idle, slower during scroll
      const baseDelay = isScrolling ? 200 : 50;
      const jitter = Math.random() * 100; // Add realistic network jitter
      const delay = baseDelay + jitter;

      updateInterval = setTimeout(() => {
        if (connectionStatus === "connected") {
          simulateWebSocketData();
        }
        scheduleNextUpdate();
      }, delay);
    };

    scheduleNextUpdate();

    return () => {
      clearInterval(connectionInterval);
      clearTimeout(updateInterval);
    };
  }, [isScrolling, connectionStatus, totalItems]);

  // Handle scroll events from react-window
  const handleScroll = useCallback(() => {
    setIsScrolling(true);

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 150);
  }, []);

  // ListItem component for react-window
  const ListItem = useCallback(
    ({
      index,
      style,
      data,
    }: {
      index: number;
      style: React.CSSProperties;
      data: LiveDataItem[];
    }) => {
      const item = data[index];
      if (!item) return null;

      const isPositive = item.change >= 0;
      const timeSinceUpdate = Date.now() - item.lastUpdate;
      const isRecentUpdate = timeSinceUpdate < 1000;

      return (
        <div
          style={style}
          className={`p-3 border-b border-slate-700/50 text-slate-200 transition-all duration-300 hover:bg-slate-700/30 ${
            isRecentUpdate ? "bg-slate-600/40" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-2 h-2 rounded-full ${formatters.statusColor(
                  item.status
                )}`}
              />
              <span className="font-bold text-slate-100 text-sm">
                {item.symbol}
              </span>
              <span className="text-xs text-slate-500">#{item.id}</span>
            </div>

            <div className="flex items-center space-x-4 text-sm">
              <div className="text-right">
                <div className="font-mono text-slate-100">
                  ${formatters.price(item.price)}
                </div>
                <div
                  className={`text-xs ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {item.changePercent.toFixed(2)}%
                </div>
              </div>

              <div className="text-right text-slate-400">
                <div className="text-xs">Vol</div>
                <div className="font-mono text-xs">
                  {formatters.volume(item.volume)}
                </div>
              </div>

              <div
                className={`w-6 h-6 rounded ${
                  isPositive ? "bg-green-500/20" : "bg-red-500/20"
                } flex items-center justify-center`}
              >
                <span
                  className={`text-xs ${
                    isPositive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {isPositive ? "↗" : "↘"}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    },
    []
  );

  return (
    <div className="p-6 bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-slate-100">
              Live Market Data Feed (react-window)
            </h1>
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  connectionStatus === "connected"
                    ? "bg-green-500"
                    : connectionStatus === "connecting"
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-red-500"
                }`}
              />
              <span className="text-slate-300 text-sm capitalize">
                {connectionStatus}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-400">
            <span>Total Instruments: {totalItems.toLocaleString()}</span>
            <span>Updates: {totalUpdates.toLocaleString()}</span>
            <span
              className={`${
                isScrolling ? "text-yellow-400" : "text-green-400"
              }`}
            >
              {isScrolling ? "Scrolling" : "Live Updates"}
            </span>
          </div>
        </div>

        <div className="relative bg-slate-800/50 rounded-lg border border-slate-700 shadow-xl">
          <List
            ref={listRef}
            height={containerHeight}
            itemCount={items.length}
            itemSize={itemHeight}
            itemData={items}
            onScroll={handleScroll}
            className="scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
            width={"100%"}
          >
            {ListItem}
          </List>

          {connectionStatus === "disconnected" && (
            <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="text-red-400 text-lg mb-2">Connection Lost</div>
                <div className="text-slate-400 text-sm">
                  Attempting to reconnect...
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-slate-500 text-center">
          Powered by react-window • Real-time market simulation • Optimized for
          1000+ items
        </div>
      </div>
    </div>
  );
};

export default LiveDataVirtualList;
