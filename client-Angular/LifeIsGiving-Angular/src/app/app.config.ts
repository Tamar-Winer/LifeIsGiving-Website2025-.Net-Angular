import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // ניהול אנימציות (PrimeNG צריכה את זה)
    provideNoopAnimations(),
    
    // ניהול ניתובים
    provideRouter(routes),
    
    // הגדרת ה-HTTP: כאן רשמנו שחובה להשתמש באינטרספטורים מבוססי Class
    provideHttpClient(withInterceptorsFromDi()),

    // חיבור ה-Interceptor שכתבת לרשימת ה-Providers
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, 
      multi: true 
    }, 
  ]
  
};