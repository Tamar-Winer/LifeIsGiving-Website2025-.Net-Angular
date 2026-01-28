import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [CommonModule,RouterModule],
  standalone: true,
  templateUrl: './about.html',
 styleUrls: ['./about.scss'],

})
export class About {

}



