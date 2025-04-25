import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vehicleLevel',
})
export class VehicleLevelPipe implements PipeTransform {
  transform(tier: number): string {
    switch (tier) {
      case 1:
        return './assets/levels/level_1.png';
      case 2:
        return './assets/levels/level_2.png';
      case 3:
        return './assets/levels/level_3.png';
      case 4:
        return './assets/levels/level_4.png';
      case 5:
        return './assets/levels/level_5.png';
      case 6:
        return './assets/levels/level_6.png';
      case 7:
        return './assets/levels/level_7.png';
      case 8:
        return './assets/levels/level_8.png';
      case 9:
        return './assets/levels/level_9.png';
      case 10:
        return './assets/levels/level_10.png';
    }
    return '';
  }
}
