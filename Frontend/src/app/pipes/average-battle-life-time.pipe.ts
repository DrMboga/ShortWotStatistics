import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'averageBattleLifeTime',
})
export class AverageBattleLifeTimePipe implements PipeTransform {
  transform(lifetime: number, battles: number): string {
    if (battles === 0) {
      return "0' 00''";
    }
    const averageTimeSeconds = lifetime / battles;
    const minutes = Math.trunc(averageTimeSeconds / 60);
    const seconds = Math.round(averageTimeSeconds - minutes * 60);

    return `${minutes}' ${seconds.toString().padStart(2, '0')}''`;
  }
}
