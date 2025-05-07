import { Pipe, PipeTransform } from '@angular/core';
import { TankTreeItem } from '../model/tank-tree-item';

const CardMargin = 20;
const HalfMargin = CardMargin / 2;
const QuarterMargin = CardMargin / 4;

const connectionPath = (
  rowStart: number,
  rowEnd: number,
  tierStart: number,
  tierEnd: number,
  cardWidth: number,
  cardHeight: number,
): string => {
  if (tierStart === tierEnd) {
    return drawVerticalLine(tierStart, rowStart, rowEnd, cardWidth, cardHeight);
  }

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

const drawVerticalLine = (
  tier: number,
  rowStart: number,
  rowEnd: number,
  cardWidth: number,
  cardHeight: number,
): string => {
  const directionDown = rowEnd - rowStart < 0;
  const horizontalMargin = 2 * CardMargin;
  const startXPoint = (tier - 1) * (cardWidth + horizontalMargin) + cardWidth / 2 + CardMargin;
  const startYPoint =
    rowStart * (cardHeight + CardMargin) + CardMargin + (directionDown ? 0 : cardHeight);
  const height = Math.abs(rowEnd - rowStart) * horizontalMargin + 2 * horizontalMargin;
  return `M ${startXPoint} ${startYPoint} v ${directionDown ? '-' : ''}${height}`;
};

@Pipe({
  name: 'connectionPaths',
})
export class ConnectionPathsPipe implements PipeTransform {
  transform(tank: TankTreeItem, cardWidth: number, cardHeight: number): string[] {
    const result: string[] = [];
    for (const nextRow of tank.nextRows) {
      const tierEnd = tank.sameLevelRows.includes(nextRow) ? tank.tier : tank.tier + 1;
      result.push(connectionPath(tank.row, nextRow, tank.tier, tierEnd, cardWidth, cardHeight));
    }
    return result;
  }
}
