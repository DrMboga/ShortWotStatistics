import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nationFlag',
})
export class NationFlagPipe implements PipeTransform {
  transform(nation: string, flagSize: 'small' | 'middle' = 'small'): string {
    switch (nation) {
      case 'italy':
        return './assets/flags/25x16/italy.png';
      case 'usa':
        return './assets/flags/25x16/usa.png';
      case 'czech':
        return './assets/flags/25x16/czech.png';
      case 'poland':
        return './assets/flags/25x16/poland.png';
      case 'france':
        return './assets/flags/25x16/france.png';
      case 'sweden':
        return './assets/flags/25x16/sweden.png';
      case 'ussr':
        return './assets/flags/25x16/ussr.png';
      case 'china':
        return './assets/flags/25x16/china.png';
      case 'uk':
        return './assets/flags/25x16/uk.png';
      case 'japan':
        return './assets/flags/25x16/japan.png';
      case 'germany':
        return './assets/flags/25x16/germany.png';
    }
    return '';
  }
}
