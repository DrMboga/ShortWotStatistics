export interface TankTreeItem {
  tankId: number;
  tier: number;
  row: number;
  tankType: string;
  isPremium: boolean;
  isResearched: boolean;
  image: string;
  name: string;
  mastery: number;
  winRate: number;
  damage: number;
  battles: number;
  priceCredit: number;
  priceXp: number;
  next: number[];
  nextRows: number[];
  sameLevelRows: number[]; // Only for one case in the USA tree
}
