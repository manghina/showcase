import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import axios from 'axios';
import html2canvas from 'html2canvas';
import {jsPDF} from 'jspdf';
import {File} from '@ionic-native/file/ngx';

import {SessionStorageService} from 'ngx-storage-api';
import {HomePage} from '../home/home.page';

import {ActivatedRoute} from '@angular/router';
import {NavController} from '@ionic/angular';
import {Directory, Filesystem, FilesystemDirectory} from "@capacitor/filesystem";

@Component({
  selector: 'app-pdf',
  templateUrl: './pdf.page.html',
  styleUrls: ['./pdf.page.scss'],
})
export class PdfPage implements AfterViewInit {
  loaded = false
  component = HomePage;

  @ViewChild('pdfContent', { static: true }) map: ElementRef | undefined
  link: any = ''
  pdfData = JSON.parse(this.storageService.getItem('pdf'));
  row = 0;
  col = 0;
  data: any = {}
  downloadPdfName!: string;
  public isLoading!: boolean;

  constructor(private http: HttpClient, public navCtrl: NavController, public file: File,
              public storageService: SessionStorageService, private route: ActivatedRoute) {
    this.isLoading = false;
    const data = this.storageService.getItem('print');
    if (data)
      this.data = JSON.parse(data)
  }
  ngAfterViewInit(): void {
    //this.captureScreen();
  }


  back() {
    this.navCtrl.navigateRoot('/');
  }
  captureScreen() {
    this.isLoading = true;
    var data = document.getElementById('pdfContent') as any;
    var html = data.outerHTML;

    var headers = new HttpHeaders();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Access-Control-Allow-Origin', '*');


    const formData = { html: html };
    const encodedData = JSON.stringify(formData);

    axios({
      method: 'post',
      url: 'https://www.lineavitacarnia.com/pdf/1.php',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: encodedData,
    })
      .then((response) => {
        this.downloadPdfName = response.data.url;
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // html2canvas(data).then(canvas => {
    //   // Few necessary setting options
    //   var imgWidth = 208;
    //   var pageHeight = 295;
    //   var imgHeight = canvas.height * imgWidth / canvas.width;
    //   var heightLeft = imgHeight;
    //
    //   const contentDataURL = canvas.toDataURL('image/png')
    //   // @ts-ignore
    //   let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
    //   var position = 0;
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
    //   const filename = 'Report_2023_09_30.pdf';
    //   pdf.save(filename); // Generated PDF
    //   this.loaded = true;
    // });

    html2canvas(data).then(async canvas =>  {
      //Initialize JSPDF
      var doc = new jsPDF("p","mm","a4");
      //Converting canvas to Image
      let imgData = canvas.toDataURL("image/PNG");

      var imgWidth = 208;
      var position = 0;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      //Add image Canvas to PDF
      // @ts-ignore
      doc.addImage(imgData, 'PNG',  0, position, imgWidth,imgHeight );

      let pdfOutput = doc.output('blob');

      const base64 = await this.convertBlobToBase64(pdfOutput) as string;

      await Filesystem.writeFile({
        path: this.downloadPdfName,
        data: base64,
        directory: Directory.Documents
      });

      this.isLoading = false;
      window.alert("Successfully downloaded");
    });
  }

  private convertBlobToBase64 = (blob :Blob)=> new Promise ((resolve,reject) =>{
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () =>{
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  goHome() {
    this.navCtrl.navigateRoot('/');
  }
}
