import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CommonAccountInfoResponse } from '../model/wargaming/commonAccountInfoResponse';

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

  private buildQueryParams(
    applicationId: string,
    accountId: string,
    accessToken: string,
    language: string,
  ): string {
    return `application_id=${applicationId}&account_id=${accountId}&language=${language}&access_token=${accessToken}`;
  }
}
