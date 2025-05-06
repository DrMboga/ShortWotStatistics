import { Pipe, PipeTransform } from '@angular/core';
import { TankTreeItem } from '../model/tank-tree-item';

@Pipe({
  name: 'frameHeight',
})
export class FrameHeightPipe implements PipeTransform {
  transform(vehicles: TankTreeItem[], cardHeight: number): number {
    const tensCount = vehicles.filter(v => v.tier === 10).length;
    return tensCount * (cardHeight + 20) + 20;
  }
}
