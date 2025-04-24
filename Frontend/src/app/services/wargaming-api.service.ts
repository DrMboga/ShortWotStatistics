import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, of } from 'rxjs';
import { CommonAccountInfoResponse } from '../model/wargaming/commonAccountInfoResponse';
import { WotPlayerPersonalData } from '../model/wargaming/wotPlayerPersonalData';
import { TankopediaAchievement } from '../model/wargaming/tankopedia-achievement';
import { VehicleData } from '../model/wargaming/vehicleStatistics';
import { Vehicle } from '../model/wargaming/vehicle';

@Injectable({
  providedIn: 'root',
})
export class WargamingApiService {
  private readonly http = inject(HttpClient);

  public getCommonAccountInfo(
    applicationId: string,
    accountId: string,
    accessToken: string,
    language: string = 'ru',
  ): Observable<CommonAccountInfoResponse> {
    const urlParams = this.buildQueryParams(applicationId, accountId, accessToken, language);
    const url = `https://api.worldoftanks.eu/wgn/account/info/?${urlParams}&fields=nickname%2Cgames%2Caccount_id`;
    return this.http.get(url).pipe(
      map((response: any) => {
        return response.data[accountId] as CommonAccountInfoResponse;
      }),
    );
  }

  public getPlayerPersonalData(
    applicationId: string,
    accountId: string,
    accessToken: string,
    blitz: boolean,
    language: string = 'ru',
  ): Observable<WotPlayerPersonalData> {
    const urlParams = this.buildQueryParams(applicationId, accountId, accessToken, language);
    // TODO: Remove json from assets
    let url: string = '';
    if (blitz) {
      url = '../assets/wotPlayerPersonalData.json';
      // url = `https://api.wotblitz.eu/wotb/account/info/?${urlParams}`;
    } else {
      url = '../assets/playerPersonalData.json';
      // url = `https://api.worldoftanks.eu/wot/account/info/?${urlParams}`;
    }

    return this.http.get(url).pipe(
      map((response: any) => {
        return response.data[accountId] as WotPlayerPersonalData;
      }),
    );
  }

  public getTankopediaAchievements(
    applicationId: string,
    language: string = 'ru',
  ): Observable<TankopediaAchievement[]> {
    // const url = `https://api.worldoftanks.eu/wot/encyclopedia/achievements/?application_id=${applicationId}&language=${language}`;
    const url = `../assets/tankopediaAchievements.json`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const result: TankopediaAchievement[] = [];
        const keys = Object.keys(response.data);
        for (const key of keys) {
          result.push(response.data[key]);
        }
        return result;
      }),
    );
  }

  public getPlayerAchievements(
    applicationId: string,
    accountId: string,
    language: string = 'ru',
  ): Observable<{ name: string; count: number }[]> {
    // const url = `https://api.worldoftanks.eu/wot/account/achievements/?application_id=${applicationId}&account_id=${accountId}&language=${language}`;
    const url = `../assets/playerAchievements.json`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const achievements = response?.data[accountId]?.['achievements'];
        if (!achievements) {
          return [];
        }
        const result: { name: string; count: number }[] = [];
        const keys = Object.keys(achievements);
        for (const key of keys) {
          result.push({ name: key, count: achievements[key] });
        }
        return result;
      }),
    );
  }

  public getTanksStatistics(
    applicationId: string,
    accountId: string,
    accessToken: string,
    language: string = 'ru',
  ): Observable<VehicleData[]> {
    const urlParams = this.buildQueryParams(applicationId, accountId, accessToken, language);
    console.log('getTanksStatistics', urlParams);
    // const url = `https://api.worldoftanks.eu/wot/tanks/stats/?${urlParams}`;
    const url = `../assets/playerVehicleStatistics.json`;
    return this.http.get(url).pipe(
      map((response: any) => {
        const data = response?.data[accountId];
        if (!data) {
          return [];
        }
        return data as VehicleData[];
      }),
    );
  }

  public getShortTanksInfo(
    applicationId: string,
    tankIds: number[],
    language: string = 'ru',
  ): Observable<Vehicle[]> {
    if (!tankIds.length) return of([]);

    const baseUrl = 'https://api.worldoftanks.eu/wot/encyclopedia/vehicles/';

    const chunkSize = 100;
    const tanksChunks = this.chunkArray(tankIds, chunkSize);

    const requests = tanksChunks.map(chunk => {
      const tankIdsParam = chunk.join(',');
      const url = `${baseUrl}?application_id=${applicationId}&tank_id=${tankIdsParam}&fields=is_premium%2Cimages%2Ctank_id%2Ctype%2Cshort_name%2Cnation%2Ctier%2Cname&language=${language}`;
      console.log(url);
      const urlMock = `../assets/tankopediaVehiclesShort.json`;
      return this.http.get(urlMock).pipe(
        map((response: any) => {
          const dataObject = response.data;
          if (!dataObject) {
            return [];
          }
          const keys = Object.keys(dataObject);
          const result: Vehicle[] = [];
          for (const tankId of keys) {
            result.push(dataObject[tankId] as Vehicle);
          }
          return result;
        }),
      );
    });

    return forkJoin(requests).pipe(map(responses => responses.flat()));
  }

  private buildQueryParams(
    applicationId: string,
    accountId: string,
    accessToken: string,
    language: string,
  ): string {
    return `application_id=${applicationId}&account_id=${accountId}&language=${language}&access_token=${accessToken}`;
  }

  private chunkArray<T>(array: T[], chunkSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }
}
