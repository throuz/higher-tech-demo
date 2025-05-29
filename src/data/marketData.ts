export interface LiveDataItem {
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
export const SYMBOLS = [
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

export const generateInitialData = (totalItems: number): LiveDataItem[] => {
  return Array.from({ length: totalItems }, (_, index) => {
    const symbol =
      SYMBOLS[index % SYMBOLS.length] +
      (index >= SYMBOLS.length ? `_${Math.floor(index / SYMBOLS.length)}` : "");
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
};

export const updateMarketData = (items: LiveDataItem[]): LiveDataItem[] => {
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

  const newItems = [...items];
  const indicesToUpdate = new Set<number>();

  // Select items to update based on pattern
  for (let i = 0; i < selectedPattern.updateCount; i++) {
    const randomIndex = Math.floor(Math.random() * items.length);
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

  return newItems;
};

// Utility functions for formatting
export const formatters = {
  price: (price: number) => {
    return price > 100 ? price.toFixed(2) : price.toFixed(4);
  },

  volume: (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(0)}K`;
    return volume.toString();
  },

  statusColor: (status: string) => {
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
  },
};
