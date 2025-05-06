import { Pipe, PipeTransform } from '@angular/core';
import { TankTreeItem } from '../model/tank-tree-item';

const CardMargin = 20;
const HalfMargin = CardMargin / 2;
const QuarterMargin = CardMargin / 4;

const connectionPath = (
  rowStart: number,
  rowEnd: number,
  tierStart: number,
  cardWidth: number,
  cardHeight: number,
): string => {
  const horizontalMargin = 2 * CardMargin;
  const startXPoint = (tierStart - 1) * (cardWidth + horizontalMargin) + cardWidth + CardMargin;
  const startYPoint = rowStart * (cardHeight + CardMargin) + cardHeight / 2 + CardMargin;

  const path = `M ${startXPoint} ${startYPoint}`;
  if (rowStart == rowEnd) {
    return `${path} h ${horizontalMargin}`;
  }

  const stopYPoint = rowEnd * (cardHeight + CardMargin) + cardHeight / 2 + CardMargin;
  const verticalLineHeight = Math.abs(stopYPoint - startYPoint) - CardMargin;
  if (rowStart < rowEnd) {
    const leftDown = `c ${QuarterMargin} 0, ${HalfMargin} ${QuarterMargin}, ${HalfMargin} ${HalfMargin}`;
    const rightDown = `c 0 ${QuarterMargin}, ${QuarterMargin} ${HalfMargin}, ${HalfMargin} ${HalfMargin}`;
    return `${path} h ${HalfMargin} ${leftDown} v ${verticalLineHeight} ${rightDown} h ${HalfMargin}`;
  }

  const leftUp = `c ${QuarterMargin} 0, ${HalfMargin} -${QuarterMargin}, ${HalfMargin} -${HalfMargin}`;
  const rightUp = `c 0 -${QuarterMargin}, ${QuarterMargin} -${HalfMargin}, ${HalfMargin} -${HalfMargin}`;
  return `${path} h ${HalfMargin} ${leftUp} v -${verticalLineHeight} ${rightUp} h ${HalfMargin}`;
};

@Pipe({
  name: 'connectionPaths',
})
export class ConnectionPathsPipe implements PipeTransform {
  transform(tank: TankTreeItem, cardWidth: number, cardHeight: number): string[] {
    const result: string[] = [];
    for (const nextRow of tank.nextRows) {
      result.push(connectionPath(tank.row, nextRow, tank.tier, cardWidth, cardHeight));
    }
    return result;
  }
}
