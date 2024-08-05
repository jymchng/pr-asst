/**
 * Constants that are not derived.
 */
export const baseAppConstants = {
  backendServerPortNumber: 3690, // hardcore it for now
  defaultsQueryParameters: {
    exchange: "OKEX",
    symbol: "BTC-30DEC22",
    groupBy: "minute",
  },
  queryParameters: {
    groupBy: ["second", "minute", "hour", "day"],
    exchanges: ["OKEX", "BINANCE"],
  },
} as const;

/**
 * Constants that are derived.
 */
export const appConstants = {
  backendURL: `http://localhost:${baseAppConstants.backendServerPortNumber}`
} as const;