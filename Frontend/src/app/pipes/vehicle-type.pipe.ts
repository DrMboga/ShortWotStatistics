import { Pipe, PipeTransform } from '@angular/core';
import { AT_SPG, HEAVY_TANK, LIGHT_TANK, MEDIUM_TANK, SPG } from '../model/vehicle-types';

@Pipe({
  name: 'vehicleType',
})
export class VehicleTypePipe implements PipeTransform {
  transform(vehicleType: string, isPremium: boolean, size: 'small' | 'middle' = 'small'): string {
    switch (vehicleType) {
      case HEAVY_TANK:
        return `./assets/vehicleTypes/24x24/${isPremium ? 'heavyTank_elite' : 'heavyTank'}.png`;
      case AT_SPG:
        return `./assets/vehicleTypes/24x24/${isPremium ? 'AT-SPG_elite' : 'AT-SPG'}.png`;
      case MEDIUM_TANK:
        return `./assets/vehicleTypes/24x24/${isPremium ? 'heavyTank_elite' : 'mediumTank'}.png`;
      case LIGHT_TANK:
        return `./assets/vehicleTypes/24x24/${isPremium ? 'lightTank_elite' : 'lightTank'}.png`;
      case SPG:
        return `./assets/vehicleTypes/24x24/${isPremium ? 'SPG_elite' : 'SPG'}.png`;
    }
    return '';
  }
}
