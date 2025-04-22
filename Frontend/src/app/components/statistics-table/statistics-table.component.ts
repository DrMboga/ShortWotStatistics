import { Component, input } from '@angular/core';
import { WotPlayerPersonalData } from '../../model/wargaming/wotPlayerPersonalData';
import { MatTableModule } from '@angular/material/table';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ScaleColorPipe } from '../../pipes/scale-color.pipe';
import { AverageBattleLifeTimePipe } from '../../pipes/average-battle-life-time.pipe';

@Component({
  selector: 'app-statistics-table',
  imports: [MatTableModule, DatePipe, DecimalPipe, ScaleColorPipe, AverageBattleLifeTimePipe],
  templateUrl: './statistics-table.component.html',
  styleUrl: './statistics-table.component.css',
})
export class StatisticsTableComponent {
  playerInfo = input<WotPlayerPersonalData>();
}
