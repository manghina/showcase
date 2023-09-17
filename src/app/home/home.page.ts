import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../models/UserPhoto';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { IonMenu, IonSlides } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';
import { SessionStorageService } from 'ngx-storage-api';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage implements OnInit{
  currentIndex = 1;
  activeItem: number = 0;
  counter: number = 0;
  title = 'Home'
  pdf: any = {      
    title: '',
    timestamp : new Date(),
    success : 0,
    error : 0,
    images : []
  }
  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };
  photos : UserPhoto[] = [];

  showcases : any[] = [

  ]
  currentMenuItem :any = null
  @ViewChild(IonSlides) slides: IonSlides | undefined
  @ViewChild(IonModal) modal: IonModal | undefined;
  @ViewChild(IonMenu) menu: IonMenu | undefined;

  constructor(public photoService : PhotoService, private ref: ChangeDetectorRef, public httpClient: HttpClient, public storageService: SessionStorageService) {
    this.createDirectory();
    const data = this.storageService.getItem('pdf');
    if(data)
      this.showcases = JSON.parse(data)
  }
  
  ngOnInit () {
    this.ref.detectChanges();
  }

  debug() {
    debugger
  }

  openMenu(s: any) {
    this.currentMenuItem = s
    if(this.menu)
      this.menu.open()
  }
  async addPhotoToGallery(i:number) {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    this.pdf.images[i].src = capturedPhoto.webPath!

  }

  updateSlideIndex(e: any) {
    if(this.slides)
    this.slides.getActiveIndex().then((i:number) => {
      this.currentIndex = i + 1
    })
  }

  menuSetPdf(s: any) {
    this.currentMenuItem = s;
  }
  menuShowPdf() {
    
    const i =this.showcases.findIndex((item:any) => item.id == this.currentMenuItem.id)
    this.showPdf(i)
    this.menu?.close()
  }

  showPdf(ind: number) {
    this.pdf = this.showcases[ind]
    var el = document.getElementById("ex1-tab-2") 
    if(el)
      el.click() 
  }

  setSuccess(i: number, value:number) {
    this.pdf.images[i].success = value
  }

  getFoto(s:any) {
    return this.pdf.images.length
  }

  getSuccess(s:any) {
    return s.images.filter((s:any) => s.success).length
  }

  getErrors(s:any) {
    return s.images.filter((s:any) => s.success == 0).length
  }

  addSection() {
    this.pdf?.images.push({
      src : '',
      name : '',
      desc : '',
      success : 1
    })

      setTimeout(()=>{
        if(this.slides) {
          for(this.currentIndex; this.currentIndex < this.pdf.images.length; this.currentIndex++) {
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
    switch(i) {
      case 0:
        this.title = 'Home';
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

  delete() {
    let text = "Confermi di voler eliminare il report?";
    if (confirm(text) == true) {
      const i =this.showcases.findIndex((item:any) => item.id == this.currentMenuItem.id)
      this.showcases.splice(i,1)
      this.menu?.close()
      this.storageService.setItem('pdf', JSON.stringify(this.showcases))
    }
  }
  
  onPrevious() {
    this.counter--;
  }

  excerpt(s: any) {
    if(s)
      return s.desc.substr(0,97) + "..."
    return ""
  }

  newPdf() {
    this.currentIndex = 1;
    this.pdf = {      
      title: 'Nuovo pdf',
      timestamp : new Date(),
      success : 11,
      error : 12,
      images : []
    };
    this.addSection()
    var el =document.getElementById("ex1-tab-2") 
    if(el)
      el.click() 
    this.modal?.present();
  }

  back() {
    var el = document.getElementById("ex1-tab-1")
    if(el)
      el.click()
  }

  savePdf() {
    if(!this.pdf.id) {
      this.pdf.id = this.showcases.length + 1
      this.showcases.push(this.pdf)
    } else {
      const i = this.showcases.findIndex((i) => i.id == this.pdf.id)
      this.showcases[i] = this.pdf
    }
    this.storageService.setItem('pdf', JSON.stringify(this.showcases))
  }

  cancel() {
    if(this.modal)
      this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if(this.modal)
      this.modal.dismiss(null, 'cancel');
  }

  async createDirectory() {
    try {
      await Filesystem.mkdir({
        path: 'input',
        directory: FilesystemDirectory.Documents,
        recursive: false,
      });
    } catch (e) {
    }    
  }

}
