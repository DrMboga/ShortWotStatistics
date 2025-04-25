import { Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NationFlagPipe } from '../../pipes/nation-flag.pipe';

@Component({
  selector: 'app-vehicles-tree',
  imports: [MatButton, NationFlagPipe],
  templateUrl: './vehicles-tree.component.html',
  styleUrl: './vehicles-tree.component.css',
})
export class VehiclesTreeComponent {
  readonly nations = [
    'italy',
    'usa',
    'czech',
    'poland',
    'france',
    'sweden',
    'ussr',
    'china',
    'uk',
    'japan',
    'germany',
  ];

  currentNation = signal<string>(this.nations[0]);
}
