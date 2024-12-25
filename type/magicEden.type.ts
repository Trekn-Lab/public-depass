export type MG_SOLANA_ITEM = {
  contract: string;
  image: string;
  symbol: string;
  name: string;
};

export type MG_SEARCH_ITEM = {
  solana: MG_SOLANA_ITEM[];
};
