import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { NgxEchartsModule } from 'ngx-echarts';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
        importProvidersFrom(
      NgxEchartsModule.forRoot({ echarts: () => import('echarts') })
    )
  ]
};
