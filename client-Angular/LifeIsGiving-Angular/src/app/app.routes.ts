import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrizeList } from './components/prizes/prize-list/prize-list';
import { PrizeDetails } from './components/prizes/prize-details/prize-details';

const routes: Routes = [
  { path: '', redirectTo: 'prizes', pathMatch: 'full' },
  { path: 'prizes', component: PrizeList },
  { path: 'prizes/:id', component: PrizeDetails }, // כאן נקבל פרס לפי id
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
