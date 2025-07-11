// ================================================================================>> Core Library
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withHashLocation,
  withInMemoryScrolling,
  withPreloading,
} from '@angular/router';

// ================================================================================>> Thrid Party Library
// Material
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

// ================================================================================>> Custom Library
// App
import { mockApiServices } from './mock-api';
import { appRoutes } from './app.routes';

// Core
import { provideAuth } from './core/auth/provider';
import { provideIcons } from 'app/core/icons/provider';
import { provideTransloco } from 'app/core/transloco/provider';

// Helper
import { provideHelpers } from 'helpers';
import { provideServiceWorker } from '@angular/service-worker';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD-MM-YYYY',
  },
  display: {
    dateInput: 'DD-MM-YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMM YYYY',
  },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules),
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withHashLocation()
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),

    // Material Date Adapter
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATE_FORMAT,
    },

    // Transloco Config
    provideTransloco(),

    // Helpers
    provideAuth(),
    provideIcons(),
    provideHelpers({
      mockApi: {
        delay: 0,
        services: mockApiServices,
      },
      helpers: {
        layout: 'dense',
        scheme: 'light',
        screens: {
          sm: '600px',
          md: '960px',
          lg: '1280px',
          xl: '1440px',
        },
        theme: 'theme-default',
        themes: [
          {
            id: 'theme-default',
            name: 'Default',
          },
          {
            id: 'theme-brand',
            name: 'Brand',
          },
          {
            id: 'theme-teal',
            name: 'Teal',
          },
          {
            id: 'theme-rose',
            name: 'Rose',
          },
          {
            id: 'theme-purple',
            name: 'Purple',
          },
          {
            id: 'theme-amber',
            name: 'Amber',
          },
        ],
      },
    }),
  ],
};
