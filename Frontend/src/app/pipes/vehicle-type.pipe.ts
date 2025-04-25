import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleType',
})
export class VehicleTypePipe implements PipeTransform {
  transform(vehicleType: string, isPremium: boolean, size: 'small' | 'middle' = 'small'): string {
    switch (vehicleType) {
      case 'heavyTank':
        return `./assets/vehicleTypes/24x24/${isPremium ? 'heavyTank_elite' : 'heavyTank'}.png`;
      case 'AT-SPG':
        return `./assets/vehicleTypes/24x24/${isPremium ? 'AT-SPG_elite' : 'AT-SPG'}.png`;
      case 'mediumTank':
        return `./assets/vehicleTypes/24x24/${isPremium ? 'heavyTank_elite' : 'mediumTank'}.png`;
      case 'lightTank':
        return `./assets/vehicleTypes/24x24/${isPremium ? 'lightTank_elite' : 'lightTank'}.png`;
      case 'SPG':
        return `./assets/vehicleTypes/24x24/${isPremium ? 'SPG_elite' : 'SPG'}.png`;
    }
    return '';
  }
}
