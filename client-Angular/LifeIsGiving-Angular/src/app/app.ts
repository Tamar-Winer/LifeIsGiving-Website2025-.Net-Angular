import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Navbar } from './components/navbar/navbar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ToastModule,Navbar],
  template: `<app-navbar></app-navbar><router-outlet></router-outlet>`,
  styleUrls: ['./app.scss']
})
export class App {
   constructor(router: Router) {
    console.log('ROUTER CONFIG:', router.config.map(r => r.path));
  }
  protected readonly title = signal('LifeIsGiving-Angular');
}
