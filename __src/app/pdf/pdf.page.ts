import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { HomePage } from '../home/home.page';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SessionStorageService } from 'ngx-storage-api';
import queryString from 'query-string';
import axios from 'axios';

import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.page.html',
  styleUrls: ['./pdf.page.scss'],
})
export class PdfPage implements OnInit {
  loaded = false
  component = HomePage;
  
  @ViewChild('pdfContent', { static: true }) map: ElementRef | undefined
  link : any = ''
  pdfData = JSON.parse(this.storageService.getItem('pdf'));
  
  constructor(private http: HttpClient, public navCtrl: NavController, public storageService: SessionStorageService) {
    
  }

  ngOnInit() {

  }

  captureScreen() {
    
    var data = document.getElementById('pdfContent') as any;
    debugger
    var html = data.outerHTML 
    

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');


    const formData = {html: html};
    const encodedData = queryString.stringify(formData);

    axios({
      method: 'post', // or 'put', 'get', 'delete', etc.
      url: 'https://www.lineavitacarnia.com/pdf/1.php',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded',
      },
      data: encodedData,
    })
      .then((response) => {
        console.log('Response:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // this.http.post("https://www.lineavitacarnia.com/pdf/1.php", { headers:headers,encodedData, observe: 'response' })
    //   .subscribe(response => {
    //     console.log(response);
    //   }, error => {

    //     console.log(error);
    //   });

  //   this.http.post('https://lineavitacarnia.com/pdf/1.php',
  //    {html: html},
  //    {headers: {
  //     'Content-Type':'multipart/form-data',
  //     'Access-Control-Allow-Origin':'*'
  //   }}).subscribe(
  //     (link:any) => {
  //      this.link = link.url
  //   },
  //   error => {
  //     alert(error.message)
  //     console.log(error)
  //  }
  //   )
    

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

  goHome() {
    this.navCtrl.navigateRoot('/');
  }
}
