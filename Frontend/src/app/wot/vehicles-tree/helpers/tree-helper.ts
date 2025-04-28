import { Vehicle } from '../../../model/wargaming/vehicle';
import { VehicleData } from '../../../model/wargaming/vehicleStatistics';
import { TankTreeItem } from '../model/tank-tree-item';

export const buildTree = (vehicles: Vehicle[], playerTanks: VehicleData[]): TankTreeItem[] => {
  const result: TankTreeItem[] = [];

  for (let tier = 1; tier < 11; tier++) {
    const vehiclesByTier = vehicles.filter(v => v.tier === tier && !v.is_premium);
    for (const vehicle of vehiclesByTier) {
      const treeItem = convertVehicleToTreeItem(vehicle, playerTanks);
      // TODO: next tanks and treeItem.row
      result.push(treeItem);
    }
  }

  return result;
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
