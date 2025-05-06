import { Vehicle } from '../../../model/wargaming/vehicle';
import { VehicleData } from '../../../model/wargaming/vehicleStatistics';
import { TankTreeItem } from '../model/tank-tree-item';
import { AT_SPG, HEAVY_TANK, LIGHT_TANK, MEDIUM_TANK, SPG } from '../../../model/vehicle-types';

interface tankCell {
  tier: number;
  tankId: number;
}

interface tanksRow {
  row: number;
  cells: tankCell[];
}

export const buildTree = (vehicles: Vehicle[], playerTanks: VehicleData[]): TankTreeItem[] => {
  const result: TankTreeItem[] = [];
  const filteredTanks = vehicles.filter(
    v => !v.is_premium && ((v.next_tanks && v.tier < 10) || v.tier === 10),
  );
  if (filteredTanks.length === 0) {
    return [];
  }
  const allTens = getAllTopVehicleIds(filteredTanks);

  const tenSPGs = allTens.filter(t => t.type === SPG);
  const tenATs = allTens.filter(t => t.type === AT_SPG);
  const tenHeavies = allTens.filter(t => t.type === HEAVY_TANK);
  const tenMediums = allTens.filter(t => t.type === MEDIUM_TANK);
  const tenLights = allTens.filter(t => t.type === LIGHT_TANK);

  const tenIds = [
    ...tenSPGs.map(t => t.tank_id),
    ...tenATs.map(t => t.tank_id),
    ...tenHeavies.map(t => t.tank_id),
    ...tenMediums.map(t => t.tank_id),
    ...tenLights.map(t => t.tank_id),
  ];

  const sortedTenIds = sortTenTiersByBranches(tenIds, vehicles);

  // Build a tree
  const avgRowNumber = Math.round(sortedTenIds.length / 2);

  const tankRowsMap = new Map<number, number>();
  // assuming that there is always one tank of tier 1
  tankRowsMap.set(filteredTanks.find(v => v.tier === 1)!.tank_id, avgRowNumber);

  for (let tier = 1; tier < 11; tier++) {
    const tanksOfTheTier = filteredTanks.filter(v => v.tier === tier);

    for (const vehicle of tanksOfTheTier) {
      let currentTankRow = tankRowsMap.get(vehicle.tank_id);
      if (currentTankRow === null || currentTankRow === undefined) {
        console.warn(`Can not find row for tank ${vehicle.tank_id} (${vehicle.short_name})`);
        continue;
      }
      const currentTankCard = convertVehicleToTreeItem(vehicle, currentTankRow, playerTanks);

      // Calculating next rows
      if (!vehicle.next_tanks) {
        result.push(currentTankCard);
        continue;
      }
      const nextTanks = Object.keys(vehicle.next_tanks).map(i => +i);
      if (nextTanks.length === 1) {
        tankRowsMap.set(nextTanks[0], currentTankRow);
        currentTankCard.nextRows.push(currentTankRow);
      } else {
        // if vehicle has more than one nextTanks, calculate its row number, sorting them by its end ten tier row number
        const sortedNextTanks = sortByRowWeights(nextTanks, sortedTenIds, filteredTanks).sort(
          (a, b) => b.weight - a.weight,
        );

        for (let i = 0; i < sortedNextTanks.length; i++) {
          const sortedNextTank = sortedNextTanks[i];
          tankRowsMap.set(sortedNextTank.tankId, sortedNextTank.weight);
          currentTankCard.nextRows.push(sortedNextTank.weight);
        }
      }
      result.push(currentTankCard);
    }
  }

  return result;
};

/**
 * Reruns all vehicles tier 10 without outdated vehicles and sorted by types (SPG, AT, heavy, medium, light)
 */
const getAllTopVehicleIds = (vehicles: Vehicle[]): Vehicle[] => {
  // The outdated tanks have no relations between tiers.
  // So, here we are taking all tanks tier 9 and find all "nextTankId"
  // These Ids should be present in the tree
  const allReferencedTenTankIds = vehicles
    .filter(v => v.tier === 9)
    .flatMap(v => [...Object.keys(v.next_tanks)])
    .map(t => +t);
  return vehicles.filter(v => allReferencedTenTankIds.includes(v.tank_id));
};

/**
 * Builds a matrix of tanks, sorts rows to build branches close to each other and return top tank ids of sorted rows
 */
const sortTenTiersByBranches = (tenIds: number[], vehicles: Vehicle[]): number[] => {
  let rows = tenIds.map(
    (tankId, index) => ({ row: index, cells: [{ tier: 10, tankId }] }) as tanksRow,
  );

  // For each top build the row until first tier and build the indexes matrix
  for (let tier = 9; tier > 0; tier--) {
    const allVehiclesByTier = vehicles
      .filter(v => !v.is_premium && v.next_tanks && v.tier === tier)
      .map(v => ({ tankId: v.tank_id, nextTanks: Object.keys(v.next_tanks).map(i => +i) }));

    const repeats = new Map<number, number[]>();

    for (let row = 0; row < rows.length; row++) {
      const refTankId = rows[row].cells.find(t => t.tier === tier + 1)?.tankId;
      if (!refTankId) {
        console.warn(`Could not find ref tank for tier ${tier} and row ${row}`);
        continue;
      }
      const currentTierTankId = allVehiclesByTier.find(t =>
        t.nextTanks.includes(refTankId),
      )?.tankId;
      if (currentTierTankId) {
        // Check repeats
        let repeatFound = false;
        for (let subRow = 0; subRow < row; subRow++) {
          const subRowTankId = rows[subRow].cells.find(c => c.tier === tier)?.tankId;
          if (subRowTankId && subRowTankId === currentTierTankId) {
            // We have a repeat!
            repeatFound = true;
            if (!repeats.has(currentTierTankId)) {
              repeats.set(currentTierTankId, [subRow]);
            } else {
              const repeatsArray = repeats.get(currentTierTankId);
              if (!repeatsArray?.includes(subRow)) {
                repeatsArray?.push(subRow);
              }
            }
          }
        }
        if (repeatFound) {
          repeats.get(currentTierTankId)?.push(row);
        }
        rows[row].cells.push({ tier, tankId: currentTierTankId });
      }
    }
    // Shake rows to put branching rows together
    repeats.forEach((value: number[], _: number) => {
      const gaps = findSequenceGaps(value);
      if (gaps.length > 0) {
        for (const gap of gaps) {
          // Swap row number
          const movingIndex = value[value.length - 1];
          const targetIndex = gap.missing;
          const movingRow = rows.find(r => r.row === movingIndex);
          const targetRow = rows.find(r => r.row === targetIndex);
          if (movingRow && targetRow) {
            movingRow.row = targetIndex;
            targetRow.row = movingIndex;
          }
          rows = rows.sort((a, b) => a.row - b.row);
          // console.log(
          //   `Tier ${tier}: Gaps for tank ${key}: moving row ${movingIndex} to position ${targetIndex}`,
          // );
        }
      }
    });
  }

  return rows.sort((a, b) => a.row - b.row).map(row => row.cells.find(c => c.tier === 10)!.tankId);
};

/**
 * Find gaps in array like [3, 5, 6] => returns that 4 is missing in the sequence
 */
function findSequenceGaps(arr: number[]): { missing: number; position: number }[] {
  const gaps: { missing: number; position: number }[] = [];

  // Sort the array to ensure it's in ascending order
  const sorted = [...arr].sort((a, b) => a - b);

  for (let i = 0; i < sorted.length - 1; i++) {
    const current = sorted[i];
    const next = sorted[i + 1];

    // If there's a gap (difference > 1), add missing numbers
    for (let missing = current + 1; missing < next; missing++) {
      gaps.push({
        missing,
        position: i + 1, // position in the *sorted* array where the gap is noticed
      });
    }
  }

  return gaps;
}

/**
 * Method takes tankIds list, finds a ten-tier tank indexes for each and returns the initial array sorted by the order of ten-tiered tanks
 */
const sortByRowWeights = (
  tankIds: number[],
  tenIds: number[],
  vehicles: Vehicle[],
): { tankId: number; weight: number }[] => {
  const tanksWithWeights: { tankId: number; weight: number }[] = [];
  for (const tankId of tankIds) {
    const topTanks = getTopTankIds(tankId, vehicles);
    let minIndex = tenIds.length;
    let maxIndex = 0;
    for (const topTank of topTanks) {
      const index = tenIds.indexOf(topTank);
      if (index > maxIndex) {
        maxIndex = index;
      }
      if (index < minIndex) {
        minIndex = index;
      }
    }
    const middleIndex = minIndex + Math.round((maxIndex - minIndex) / 2);
    tanksWithWeights.push({ tankId, weight: middleIndex });
  }
  return tanksWithWeights;
};

const getTopTankIds = (tankId: number, vehicles: Vehicle[]): number[] => {
  const vehicle = vehicles.find(v => v.tank_id === tankId)!;
  if (!vehicle.next_tanks) {
    return [vehicle.tank_id];
  }
  return Object.keys(vehicle.next_tanks)
    .map(i => +i)
    .flatMap(n => [...getTopTankIds(n, vehicles)]);
};

const convertVehicleToTreeItem = (
  vehicle: Vehicle,
  row: number,
  playerTanks: VehicleData[],
): TankTreeItem => {
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
    name: vehicle.short_name,
    priceCredit: vehicle.price_credit,

    row,
    isResearched: playerTank !== undefined,
    mastery: playerTank?.mark_of_mastery ?? 0,
    winRate,
    damage,
    battles,
    next: vehicle.next_tanks ? Object.keys(vehicle.next_tanks).map(k => +k) : [],
    nextRows: [],
  } as TankTreeItem;
};
