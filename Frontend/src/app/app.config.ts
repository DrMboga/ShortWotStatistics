import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIndexedDb } from 'ngx-indexed-db';
import { dbConfig } from './indexedDb/db-config';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideIndexedDb(dbConfig),
    provideHttpClient(),
    provideCharts(withDefaultRegisterables()),
  ],
};
