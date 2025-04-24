export interface VehicleImage {
  small_icon: string;
  contour_icon: string;
  big_icon: string;
}

export interface VehicleCrewInfo {
  roles: object;
  member_id: string;
}

export interface Vehicle {
  tank_id: number;
  is_gift: boolean;
  is_wheeled: boolean;
  price_gold: number;
  type: string;
  next_tanks: object;
  short_name: string;
  name: string;
  nation: string;
  is_premium: boolean;
  images: VehicleImage;
  tag: string;
  price_credit: number;
  tier: number;
  crew: VehicleCrewInfo[];
  prices_xp: object;
  description: string;
}
