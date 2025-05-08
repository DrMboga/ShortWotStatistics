import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'historyItemSign',
})
export class HistoryItemSignPipe implements PipeTransform {
  transform(historicalValue: number): string {
    return historicalValue > 0 ? '+' : '';
  }
}
