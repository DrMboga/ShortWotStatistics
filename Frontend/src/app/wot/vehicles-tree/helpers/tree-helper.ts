import { Vehicle } from '../../../model/wargaming/vehicle';
import { VehicleData } from '../../../model/wargaming/vehicleStatistics';
import { TankTreeItem } from '../model/tank-tree-item';
import { AT_SPG, HEAVY_TANK, LIGHT_TANK, MEDIUM_TANK, SPG } from '../../../model/vehicle-types';

export const buildTree = (vehicles: Vehicle[], playerTanks: VehicleData[]): TankTreeItem[] => {
  const result: TankTreeItem[] = [];
  const allTenIds = getAllTopVehicleIds(vehicles);
  console.log(JSON.stringify(allTenIds));

  return result;
};

/**
 * Reruns all vehicles tier 10 without outdated vehicles and sorted by types (SPG, AT, heavy, medium, light)
 */
const getAllTopVehicleIds = (vehicles: Vehicle[]): number[] => {
  // The outdated tanks have no relations between tiers.
  // So, here we are taking all tanks tier 9 and find all "nextTankId"
  // These Ids should be present in the tree
  const allReferencedTenTankIds = vehicles
    .filter(v => !v.is_premium && v.next_tanks && v.tier === 9)
    .flatMap(v => [...Object.keys(v.next_tanks)])
    .map(t => +t);
  const allTens = vehicles.filter(v => allReferencedTenTankIds.includes(v.tank_id));
  return [
    ...allTens.filter(t => t.type === SPG).map(v => v.tank_id),
    ...allTens.filter(t => t.type === AT_SPG).map(v => v.tank_id),
    ...allTens.filter(t => t.type === HEAVY_TANK).map(v => v.tank_id),
    ...allTens.filter(t => t.type === MEDIUM_TANK).map(v => v.tank_id),
    ...allTens.filter(t => t.type === LIGHT_TANK).map(v => v.tank_id),
  ];
};

const convertVehicleToTreeItem = (vehicle: Vehicle, playerTanks: VehicleData[]): TankTreeItem => {
  const playerTank = playerTanks.find(t => t.tank_id === vehicle.tank_id);
  const battles = playerTank?.all?.battles ?? 0;
  const winRate = battles === 0 ? 0 : (100 * (playerTank?.all?.wins ?? 0)) / battles;
  const damage = battles === 0 ? 0 : (playerTank?.all?.damage_dealt ?? 0) / battles;

  return {
    tankId: vehicle.tank_id,
    tier: vehicle.tier,
    tankType: vehicle.type,
    isPremium: vehicle.is_premium,
    image: vehicle.images.big_icon,
    name: vehicle.name,
    priceCredit: vehicle.price_credit,

    row: 0,
    isResearched: playerTank !== undefined,
    mastery: playerTank?.mark_of_mastery ?? 0,
    winRate,
    damage,
    battles,
  } as TankTreeItem;
};
