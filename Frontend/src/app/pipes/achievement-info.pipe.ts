import { Pipe, PipeTransform } from '@angular/core';
import { PlayerAchievement } from '../model/player-achievement';

@Pipe({
  name: 'achievementInfo',
})
export class AchievementInfoPipe implements PipeTransform {
  transform(achievement: PlayerAchievement): string {
    return `${achievement.localizedName}: ${achievement.description}`;
  }
}
