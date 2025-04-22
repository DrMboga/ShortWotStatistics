import { Pipe, PipeTransform } from '@angular/core';
import {
  SCALE_AVERAGE_COLOR,
  SCALE_BAD_COLOR,
  SCALE_BELOW_AVERAGE_COLOR,
  SCALE_GOOD_COLOR,
  SCALE_GREAT_COLOR,
  SCALE_SUPER_UNICUM_COLOR,
  SCALE_UNICUM_COLOR,
  SCALE_VERY_BAD_COLOR,
  SCALE_VERY_GOOD_COLOR,
} from '../model/scale-colors';

@Pipe({
  name: 'scaleColor',
})
export class ScaleColorPipe implements PipeTransform {
  transform(winRate: number): string {
    if (winRate < 1) {
      winRate = winRate * 100;
    }
    if (winRate < 45) {
      return SCALE_VERY_BAD_COLOR;
    }
    if (winRate < 47) {
      return SCALE_BAD_COLOR;
    }
    if (winRate < 49) {
      return SCALE_BELOW_AVERAGE_COLOR;
    }
    if (winRate < 52) {
      return SCALE_AVERAGE_COLOR;
    }
    if (winRate < 54) {
      return SCALE_GOOD_COLOR;
    }
    if (winRate < 56) {
      return SCALE_VERY_GOOD_COLOR;
    }
    if (winRate < 60) {
      return SCALE_GREAT_COLOR;
    }
    if (winRate < 65) {
      return SCALE_UNICUM_COLOR;
    }
    return SCALE_SUPER_UNICUM_COLOR;
  }
}
