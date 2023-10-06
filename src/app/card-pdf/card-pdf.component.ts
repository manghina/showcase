import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-pdf',
  templateUrl: './card-pdf.component.html',
  styleUrls: ['./card-pdf.component.scss'],
})
export class CardPdfComponent implements OnInit {
  @Input() item: any;
  constructor() { }

  ngOnInit() { }

}
