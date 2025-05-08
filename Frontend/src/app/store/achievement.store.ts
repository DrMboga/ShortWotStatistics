import { TankopediaAchievement } from '../model/wargaming/tankopedia-achievement';
import { PlayerAchievement } from '../model/player-achievement';
import { patchState, signalStore, withHooks, withState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { WargamingApiService } from '../services/wargaming-api.service';
import { IndexedDBService } from '../indexedDb/indexed-db.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, mergeMap, of, switchMap } from 'rxjs';

type AchievementState = {
  wotPlayerAchievements: PlayerAchievement[];
};

const initialState: AchievementState = {
  wotPlayerAchievements: [],
};

export const AchievementsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withHooks({
    onInit(store, indexedDb = inject(IndexedDBService), wotApi = inject(WargamingApiService)) {
      indexedDb
        .getAccountsAuthInfo()
        .pipe(
          takeUntilDestroyed(),
          switchMap(accountAuthInfo => {
            if (
              accountAuthInfo.length > 0 &&
              accountAuthInfo[0].applicationId &&
              accountAuthInfo[0].accountId
            ) {
              return wotApi.getTankopediaAchievements(accountAuthInfo[0].applicationId).pipe(
                mergeMap(tankopedia => {
                  return wotApi
                    .getPlayerAchievements(
                      accountAuthInfo[0].applicationId!,
                      accountAuthInfo[0].accountId!,
                    )
                    .pipe(
                      map(playerAchievements => {
                        return mapPlayerAchievements(playerAchievements, tankopedia);
                      }),
                    );
                }),
              );
            }
            return of(undefined);
          }),
        )
        .subscribe(wotPlayerAchievements => patchState(store, () => ({ wotPlayerAchievements })));
    },
  }),
);

const mapPlayerAchievements = (
  playerAchievements: { name: string; count: number }[],
  tankopedia: TankopediaAchievement[],
): PlayerAchievement[] => {
  const result: PlayerAchievement[] = [];
  for (const playerAchievement of playerAchievements) {
    const achievementInfo = tankopedia.find(t => t.name === playerAchievement.name);
    if (achievementInfo) {
      result.push({
        name: achievementInfo.name,
        count: playerAchievement.count,
        section: achievementInfo.section,
        sectionOrder: achievementInfo.section_order,
        order: achievementInfo.order,
        localizedName: achievementInfo.name_i18n,
        image: achievementInfo.image,
        imageBig: achievementInfo.image_big,
        description: achievementInfo.description,
        condition: achievementInfo.condition,
      } as PlayerAchievement);
    }
  }

  const epic = result.filter(a => a.section === 'epic').sort((a, b) => a.order - b.order);
  const battle = result.filter(a => a.section === 'battle').sort((a, b) => a.order - b.order);
  const group = result.filter(a => a.section === 'group').sort((a, b) => a.order - b.order);
  const special = result.filter(a => a.section === 'special').sort((a, b) => a.order - b.order);

  return [...epic, ...battle, ...group, ...special];
};
