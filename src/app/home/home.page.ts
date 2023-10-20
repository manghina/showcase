import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Camera } from '@capacitor/camera';
import { IonMenu, IonModal, IonSlides, NavController, ToastController } from '@ionic/angular';
import { SessionStorageService } from 'ngx-storage-api';
import { UserPhoto } from '../models/UserPhoto';
import { PhotoService } from '../services/photo.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage implements OnInit {
  currentIndex = 1;
  activeItem: number = 0;
  counter: number = 0;
  title = 'Home'
  pdf: any = {
    title: '',
    timestamp: new Date(),
    success: 0,
    error: 0,
    images: []
  }
  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };
  photos: UserPhoto[] = [];

  showcases: any[] = [

  ]
  menuType: string = 'overlay';

  printPdfItem = {
    col: "1",
    margin: "1",
    pdf: {
      title: '',
      timestamp: new Date(),
      success: 11,
      error: 12,
      rows: [],
      images: [{
        src: '',
        name: '',
        desc: '',
        success: 1
      }]
    }
  }
  currentMenuItem: any = {
    col: 3,
    margin: 'pdf_m1',
    pdf: {
      title: '',
      timestamp: new Date(),
      success: 11,
      error: 12,
      rows: [],
      images: [{
        src: '',
        name: '',
        desc: '',
        success: 1
      }]
    }
  }
  @ViewChild(IonSlides) slides: IonSlides | undefined
  @ViewChild(IonModal) modal: IonModal | undefined;
  @ViewChild('pdfActions') menu: IonMenu | undefined;
  @ViewChild('print') print: IonModal | undefined;

  constructor(private toastController: ToastController, public navCtrl: NavController, public photoService: PhotoService, private ref: ChangeDetectorRef, public httpClient: HttpClient, public storageService: SessionStorageService) {
    let data = this.storageService.getItem('pdf');
    if (!data && localStorage.getItem('pdf') != null) {
      // @ts-ignore
      data = localStorage.getItem('pdf')
    }
    if (data)
      this.showcases = JSON.parse(data)

  }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  debug() {
    debugger
  }


  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: 'middle',
    });

    await toast.present();
  }
  async getImage(i: number) {
    const image = await Camera.pickImages({
      quality: 90,
      limit: 1,
      height: 200,
      width: 200
    });
    this.pdf.images[i].src = image.photos[0].webPath
  }


  openMenu(s: any) {
    this.currentMenuItem = s
    if (this.menu)
      this.menu.open()
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  async addPhotoToGallery(i: number) {
    const photo = this.photoService.addNewToGallery();
    let c = (await photo)

    const response = await fetch(c.webviewPath!);
    const blob = await response.blob();

    let dataSrc = await this.convertBlobToBase64(blob) as string;
    this.pdf.images[i].src = dataSrc;

  }

  updateSlideIndex(e: any) {
    if (this.slides)
      this.slides.getActiveIndex().then((i: number) => {
        this.currentIndex = i + 1
      })
  }

  menuSetPdf(s: any) {
    this.currentMenuItem = s;
  }
  menuShowPdf() {

    const i = this.showcases.findIndex((item: any) => item.id == this.currentMenuItem.id)
    this.showPdf(i)
    this.menu?.close()
  }

  showPdf(ind: number) {
    this.pdf = this.showcases[ind]
    var el = document.getElementById("ex1-tab-2")
    if (el)
      el.click()
  }

  setSuccess(i: number, value: number) {
    this.pdf.images[i].success = value
  }

  getFoto(s: any) {
    return this.pdf.images.length
  }

  getSuccess(s: any) {
    return s.images.filter((s: any) => s.success).length
  }

  getErrors(s: any) {
    return s.images.filter((s: any) => s.success == 0).length
  }

  addSection() {
    this.pdf?.images.push({
      src: '',
      name: '',
      desc: '',
      success: 1
    });

    setTimeout(() => {
      if (this.slides) {
        for (this.currentIndex; this.currentIndex < this.pdf.images.length; this.currentIndex++) {
          this.slides.slideNext(300);
        }
      }
    }, 400);

  }

  toggleTab(i: number) {
    if (i > this.activeItem) {
      this.onNext();
    }
    else {
      this.onPrevious();
    }
    this.activeItem = i;
    switch (i) {
      case 0:
        this.title = 'Home';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;
      case 1:
        this.title = 'PDF';
        break;
      case 2:
        this.title = 'Galleria';
        break;
    }
  }

  onNext() {
    this.counter++;
  }

  printPdf() {
    this.printPdfItem.margin = "1";
    this.printPdfItem.col = "1";
    this.menu?.close()
    this.printPdfItem.pdf = this.currentMenuItem
    this.print?.present()
    this.redrawImages()
  }
  getCurrentPrintSize() {
    const j = parseInt(this.printPdfItem.col);
    switch (j) {
      case 1:
        return 'col-12';
      case 2:
        return 'col-6';
      case 3:
        return 'col-4';
      case 4:
        return 'col-3';
    }

    return 'col-12';
  }
  redrawImages() {
    const j = parseInt(this.printPdfItem.col);
    this.printPdfItem.pdf.rows = [];
    let row: any[] = []
    for (let i = 0; i < this.currentMenuItem.images.length; i++) {
      if (i % j == 0 && i >= j) {
        // @ts-ignore
        this.printPdfItem.pdf.rows.push(row)
        row = []
      }
      row.push(this.currentMenuItem.images[i])

    }
    if (row.length)
      // @ts-ignore
      this.printPdfItem.pdf.rows.push(row)

    return []
  }

  delete() {
    let text = "Confermi di voler eliminare il report?";
    if (confirm(text) == true) {
      const i = this.showcases.findIndex((item: any) => item.id == this.currentMenuItem.id)
      this.showcases.splice(i, 1)
      this.menu?.close()
      this.storageService.setItem('pdf', JSON.stringify(this.showcases))
      this.presentToast('Il report è stato eliminato')
    }
  }

  onPrevious() {
    this.counter--;
  }

  excerpt(s: any) {
    if (s)
      return s.desc.substr(0, 97) + "..."
    return ""
  }

  newPdf() {
    this.currentIndex = 1;
    this.pdf = {
      title: 'Nuovo pdf',
      timestamp: new Date(),
      success: 11,
      error: 12,
      images: []
    };
    this.addSection()
    var el = document.getElementById("ex1-tab-2")
    if (el)
      el.click()
    this.modal?.present();
  }

  back() {
    var el = document.getElementById("ex1-tab-1")
    if (el)
      el.click()
  }

  savePdf() {
    if (!this.pdf.id) {
      this.pdf.id = this.showcases.length + 1
      this.showcases.push(this.pdf)
      this.presentToast('Il report è stato creato')
    } else {
      const i = this.showcases.findIndex((i) => i.id == this.pdf.id)
      this.showcases[i] = this.pdf
      this.presentToast('Le modifiche sono state salvate')
    }
    this.storageService.setItem('pdf', JSON.stringify(this.showcases))
    localStorage.setItem('pdf', JSON.stringify(this.showcases))
  }

  cancel() {
    if (this.modal)
      this.modal.dismiss(null, 'cancel');
  }
  download() {
    this.captureScreen();
  }

  cancel2() {
    if (this.print)
      this.print.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.modal)
      this.modal.dismiss(null, 'cancel');
  }

  public captureScreen() {
    this.storageService.setItem('print', JSON.stringify(this.printPdfItem))
    if (this.print)
      this.print.dismiss(null, 'cancel');
    this.navCtrl.navigateRoot('/pdf');
  }

  goPrevSlide() {
    this.slides?.slidePrev();
  }

  goNextSlide() {
    this.slides?.slideNext();
  }
}
