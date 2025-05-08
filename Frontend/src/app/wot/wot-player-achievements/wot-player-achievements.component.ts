import { Component, effect, inject, input } from '@angular/core';
import { AchievementsStore } from '../../store/achievement.store';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AchievementInfoPipe } from '../../pipes/achievement-info.pipe';

@Component({
  selector: 'app-wot-player-achievements',
  imports: [MatBadgeModule, MatTooltipModule, AchievementInfoPipe],
  templateUrl: './wot-player-achievements.component.html',
  styleUrl: './wot-player-achievements.component.css',
})
export class WotPlayerAchievementsComponent {
  readonly achievementsStore = inject(AchievementsStore);

  tanksCount = input<number>();
  mastersCount = input<number>();
}
