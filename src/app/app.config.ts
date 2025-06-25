import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeng/themes/nora';

import { routes } from './app.routes';


export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({
            eventCoalescing: true
        }),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Nora,
            }
        }),
        provideRouter(routes),
        provideHttpClient()
    ]
};
