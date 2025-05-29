import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FixedSizeList as List } from "react-window";

interface LiveDataItem {
  id: number;
  symbol: string;
  price: number;
  volume: number;
  change: number;
  changePercent: number;
  timestamp: number;
  status: "active" | "paused" | "error";
  lastUpdate: number;
}

// Simulate real stock/crypto symbols
const SYMBOLS = [
  "AAPL",
  "GOOGL",
  "MSFT",
  "AMZN",
  "TSLA",
  "META",
  "NVDA",
  "NFLX",
  "AMD",
  "INTC",
  "BTC",
  "ETH",
  "ADA",
  "SOL",
  "DOT",
  "LINK",
  "UNI",
  "AVAX",
  "MATIC",
  "ATOM",
  "JPM",
  "BAC",
  "WFC",
  "GS",
  "MS",
  "C",
  "USB",
  "PNC",
  "TFC",
  "COF",
  "JNJ",
  "PFE",
  "UNH",
  "MRK",
  "ABBV",
  "TMO",
  "DHR",
  "BMY",
  "AMGN",
  "GILD",
  "XOM",
  "CVX",
  "COP",
  "EOG",
  "SLB",
  "PXD",
  "MPC",
  "VLO",
  "PSX",
  "HES",
];

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
  const containerHeight = 600; // Fixed height for the list container

  // Generate initial realistic data
  const generateInitialData = useMemo(() => {
    return Array.from({ length: totalItems }, (_, index) => {
      const symbol =
        SYMBOLS[index % SYMBOLS.length] +
        (index >= SYMBOLS.length
          ? `_${Math.floor(index / SYMBOLS.length)}`
          : "");
      const basePrice = Math.random() * 1000 + 10;

      return {
        id: index,
        symbol,
        price: basePrice,
        volume: Math.floor(Math.random() * 1000000) + 10000,
        change: (Math.random() - 0.5) * basePrice * 0.1,
        changePercent: (Math.random() - 0.5) * 10,
        timestamp: Date.now(),
        status: "active" as const,
        lastUpdate: Date.now(),
      };
    });
  }, [totalItems]);

  // Initialize data
  useEffect(() => {
    setItems(generateInitialData);
    setConnectionStatus("connected");
  }, [generateInitialData]);

  // Simulate realistic WebSocket data stream
  useEffect(() => {
    const simulateWebSocketData = () => {
      // Simulate different update patterns
      const patterns = [
        // High frequency updates (like crypto)
        { probability: 0.3, updateCount: 5, volatility: 0.05 },
        // Medium frequency updates (like stocks)
        { probability: 0.5, updateCount: 2, volatility: 0.02 },
        // Low frequency updates (like bonds)
        { probability: 0.15, updateCount: 1, volatility: 0.01 },
        // Burst updates (news events)
        { probability: 0.05, updateCount: 15, volatility: 0.1 },
      ];

      const selectedPattern =
        patterns.find((p) => Math.random() < p.probability) || patterns[1];

      setItems((currentItems) => {
        const newItems = [...currentItems];
        const indicesToUpdate = new Set<number>();

        // Select items to update based on pattern
        for (let i = 0; i < selectedPattern.updateCount; i++) {
          const randomIndex = Math.floor(Math.random() * totalItems);
          indicesToUpdate.add(randomIndex);
        }

        indicesToUpdate.forEach((index) => {
          const item = newItems[index];
          if (!item) return;

          const now = Date.now();

          // Simulate realistic price movements
          const volatility = selectedPattern.volatility;
          const priceChange = (Math.random() - 0.5) * item.price * volatility;
          const newPrice = Math.max(0.01, item.price + priceChange);

          // Simulate volume changes
          const volumeMultiplier = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
          const newVolume = Math.floor(item.volume * volumeMultiplier);

          // Calculate change from previous
          const change = newPrice - item.price;
          const changePercent = (change / item.price) * 100;

          // Simulate occasional status changes
          let status = item.status;
          if (Math.random() < 0.001) {
            status = Math.random() < 0.7 ? "paused" : "error";
          } else if (item.status !== "active" && Math.random() < 0.1) {
            status = "active";
          }

          newItems[index] = {
            ...item,
            price: newPrice,
            volume: newVolume,
            change,
            changePercent,
            timestamp: now,
            status,
            lastUpdate: now,
          };
        });

        // Update counters
        updateCounterRef.current += indicesToUpdate.size;
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

  // Format price with appropriate decimals
  const formatPrice = (price: number) => {
    return price > 100 ? price.toFixed(2) : price.toFixed(4);
  };

  // Format volume with K/M suffix
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`;
    return volume.toString();
  };

  // Get status indicator color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

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
                className={`w-2 h-2 rounded-full ${getStatusColor(
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
                  ${formatPrice(item.price)}
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
                  {formatVolume(item.volume)}
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
            width={""}
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
