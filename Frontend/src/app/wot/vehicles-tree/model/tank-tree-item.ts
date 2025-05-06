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
  next: number[];
  nextRows: number[];
}
