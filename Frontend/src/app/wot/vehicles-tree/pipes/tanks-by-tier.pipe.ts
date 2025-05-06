import { Pipe, PipeTransform } from '@angular/core';
import { TankTreeItem } from '../model/tank-tree-item';

@Pipe({
  name: 'tanksByTier',
})
export class TanksByTierPipe implements PipeTransform {
  transform(vehicles: TankTreeItem[], tier: number): TankTreeItem[] {
    return vehicles.filter(v => v.tier === tier).sort((a, b) => a.row - b.row);
  }
}
