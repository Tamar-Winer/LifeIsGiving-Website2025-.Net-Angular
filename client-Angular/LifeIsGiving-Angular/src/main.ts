import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, Routes } from '@angular/router'; // <-- חייבים לייבא גם Routes
import { PrizeList } from './app/components/prizes/prize-list/prize-list';
import { PrizeDetails } from './app/components/prizes/prize-details/prize-details';

// הגדרת הנתיבים
const routes: Routes = [
  { path: '', redirectTo: 'prizes', pathMatch: 'full' },
  { path: 'prizes', component: PrizeList },
  { path: 'prizes/:id', component: PrizeDetails }
];

// bootstrap של האפליקציה
bootstrapApplication(App, {
  providers: [
    provideRouter(routes) // כאן Angular מזהה את routes
  ]
}).catch(err => console.error(err));
