import { RouterModule, Routes } from '@angular/router';

import { PrizeList } from './components/prizes/prize-list/prize-list';
import { PrizeDetails } from './components/prizes/prize-details/prize-details';
import { About } from './components/about/about';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { DonorList } from './components/manager/donor-list/donor-list';
import { AddDonor } from './components/manager/add-donor/add-donor';
import { CartPage } from './components/cart/cart-page/cart-page';
import { PrizeEditForm } from './components/prizes/prize-edit-form/prize-edit-form';
import { PurchaseList } from './components/manager/purchase-list/purchase-list';
import { AdminReports } from './components/manager/admin-reports/admin-reports';

export const routes: Routes = [
  { path: '', redirectTo: 'prizes', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'prizes', component: PrizeList },
  { path: 'prizes/:id', component: PrizeDetails },
  { path: 'cart', component: CartPage },
  { path: 'about', component: About }, 
  { path: 'admin/donors', component: DonorList },
  { path: 'admin/addDonor', component: AddDonor },
  { path: 'admin/addPrize', component: PrizeEditForm },
  { path: 'admin/purchases', component: PurchaseList },
  { path: 'admin/reports', component: AdminReports },
  { path: '**', redirectTo: 'prizes' },  
];
