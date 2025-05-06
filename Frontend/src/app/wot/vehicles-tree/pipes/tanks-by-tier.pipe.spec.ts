import { TanksByTierPipe } from './tanks-by-tier.pipe';

describe('TanksByTierPipe', () => {
  it('create an instance', () => {
    const pipe = new TanksByTierPipe();
    expect(pipe).toBeTruthy();
  });
});
