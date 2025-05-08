import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'historyItemColor',
})
export class HistoryItemColorPipe implements PipeTransform {
  transform(historicalValue: number): string {
    return historicalValue > 0 ? 'green' : 'red';
  }
}
