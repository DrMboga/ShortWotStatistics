import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mastery',
})
export class MasteryPipe implements PipeTransform {
  transform(mastery: number): string {
    switch (mastery) {
      case 1:
        return './assets/account/class_icons_1_small.png';
      case 2:
        return './assets/account/class_icons_2_small.png';
      case 3:
        return './assets/account/class_icons_3_small.png';
      case 4:
        return './assets/account/class_icons_4_small.png';
    }
    return '';
  }
}
