export type QueryDTO = {
  exchange?: string;
  symbol?: string;
  groupBy?: 'second' | 'minute' | 'hour' | 'day';
  startDate?: string;
  endDate?: string;
};
