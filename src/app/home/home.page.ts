import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('1500ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      transition(":leave", [
        animate('1500ms ease-out', style({ transform: 'translateX(-100%)' })),
      ])
    ])
  ]
})
export class HomePage {

  activeItem: number = 0;

  constructor() {

  }

  toggleTab(i: number) {
    this.activeItem = i;
  }

}
