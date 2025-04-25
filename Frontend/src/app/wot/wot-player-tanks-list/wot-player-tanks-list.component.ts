import { Component, computed, inject, signal } from '@angular/core';
import { TanksStore } from '../../store/tanks.store';
import { NationFlagPipe } from '../../pipes/nation-flag.pipe';
import { VehicleTypePipe } from '../../pipes/vehicle-type.pipe';
import { VehicleLevelPipe } from '../../pipes/vehicle-level.pipe';
import { DecimalPipe } from '@angular/common';
import { ScaleColorPipe } from '../../pipes/scale-color.pipe';
import { MasteryPipe } from '../../pipes/mastery.pipe';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-wot-player-tanks-list',
  imports: [
    NationFlagPipe,
    VehicleTypePipe,
    VehicleLevelPipe,
    DecimalPipe,
    ScaleColorPipe,
    MasteryPipe,
    MatButton,
  ],
  templateUrl: './wot-player-tanks-list.component.html',
  styleUrl: './wot-player-tanks-list.component.css',
})
export class WotPlayerTanksListComponent {
  readonly tanksStore = inject(TanksStore);

  inGarageToggle = signal<boolean>(true);

  tanksList = computed(() => {
    let tanks = this.tanksStore.playerTanks();
    if (this.inGarageToggle()) {
      tanks = tanks.filter(t => t.in_garage);
    }
    return tanks.sort((a, b) => (b.vehicleInfo?.tier ?? 0) - (a.vehicleInfo?.tier ?? 0));
  });

  battlesSum = computed(() =>
    this.tanksList()
      .map(t => t.all.battles)
      .reduce((a, b) => a + b, 0),
  );

  avgWinRate = computed(() => {
    if (this.battlesSum() === 0) {
      return 0;
    }
    const wins = this.tanksList()
      .map(t => t.all.wins)
      .reduce((a, b) => a + b, 0);
    return (100 * wins) / this.battlesSum();
  });

  avgDamage = computed(() => {
    if (this.battlesSum() === 0) {
      return 0;
    }
    const dmg = this.tanksList()
      .map(t => t.all.damage_dealt)
      .reduce((a, b) => a + b, 0);
    return dmg / this.battlesSum();
  });

  avgXp = computed(() => {
    if (this.battlesSum() === 0) {
      return 0;
    }
    const xp = this.tanksList()
      .map(t => t.all.xp)
      .reduce((a, b) => a + b, 0);
    return xp / this.battlesSum();
  });
}
