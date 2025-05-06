import tankopediaGermany from '../../../dataExamples/tankopediaVehiclesGermany.json';
import tankopediaUsa from '../../../dataExamples/tankopediaVehiclesUsa.json';
import { Vehicle } from '../../../model/wargaming/vehicle';
import { buildTree } from './tree-helper';

const convertJsonToVehicles = (jsonData: any): Vehicle[] => {
  const dataObject = jsonData.data;
  if (!dataObject) {
    return [];
  }
  const keys = Object.keys(dataObject);
  const result: Vehicle[] = [];
  for (const tankId of keys) {
    result.push(dataObject[tankId] as Vehicle);
  }
  return result;
};

describe('tree helper', () => {
  let vehiclesGermany: Vehicle[];

  beforeEach(() => {
    vehiclesGermany = convertJsonToVehicles(tankopediaUsa);
  });

  it('should build a tree with appropriate row positions', () => {
    const tree = buildTree(vehiclesGermany, []);
    console.log('vehicles', JSON.stringify(tree));
  });
});
