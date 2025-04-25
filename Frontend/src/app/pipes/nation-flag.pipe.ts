import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nationFlag',
})
export class NationFlagPipe implements PipeTransform {
  transform(nation: string, flagSize: 'small' | 'middle' = 'small'): string {
    switch (nation) {
      case 'italy':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/italy.png`;
      case 'usa':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/usa.png`;
      case 'czech':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/czech.png`;
      case 'poland':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/poland.png`;
      case 'france':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/france.png`;
      case 'sweden':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/sweden.png`;
      case 'ussr':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/ussr.png`;
      case 'china':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/china.png`;
      case 'uk':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/uk.png`;
      case 'japan':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/japan.png`;
      case 'germany':
        return `./assets/flags/${flagSize === 'small' ? '25x16' : '160x102'}/germany.png`;
    }
    return '';
  }
}
