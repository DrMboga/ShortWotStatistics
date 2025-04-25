import { Component, inject } from '@angular/core';
import { TanksStore } from '../../store/tanks.store';

@Component({
  selector: 'app-wot-player-tanks-list',
  imports: [],
  templateUrl: './wot-player-tanks-list.component.html',
  styleUrl: './wot-player-tanks-list.component.css',
})
export class WotPlayerTanksListComponent {
  readonly tanksStore = inject(TanksStore);
}
