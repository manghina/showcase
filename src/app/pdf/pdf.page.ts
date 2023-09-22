import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { HomePage } from '../home/home.page';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.page.html',
  styleUrls: ['./pdf.page.scss'],
})
export class PdfPage implements OnInit {
  loaded = false
  component = HomePage;
  
  constructor() {
    this.captureScreen()
   }

  ngOnInit() {

  }

  captureScreen() {
    debugger
    var data = document.getElementById('pdfContent') as any;
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      // @ts-ignore
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      const filename = 'Report_2023_09_30.pdf';
      pdf.save(filename); // Generated PDF  
      this.loaded = true
    });
  }
}
