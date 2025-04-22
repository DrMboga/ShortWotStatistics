export interface PlayerAchievement {
  name: string;
  section: string;
  sectionOrder: number;
  order: number;
  count: number;
  localizedName: string;
  image: string;
  imageBig: string;
  description: string;
  condition?: string;
}
