import { RouterModule, Routes } from '@angular/router';

import { PrizeList } from './components/prizes/prize-list/prize-list';
import { PrizeDetails } from './components/prizes/prize-details/prize-details';
import { About } from './components/about/about';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'prizes', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'prizes', component: PrizeList },
  { path: 'prizes/:id', component: PrizeDetails },
  { path: 'about', component: About }, 
  { path: '**', redirectTo: 'prizes' },  
];
