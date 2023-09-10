import { animate, group, query, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserPhoto } from '../models/UserPhoto';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { IonSlides } from '@ionic/angular';
import { IonModal } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Filesystem, FilesystemDirectory } from '@capacitor/filesystem';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],

})
export class HomePage implements AfterViewInit{
  currentIndex = 1;
  activeItem: number = 0;
  counter: number = 0;
  title = 'La mia lista'
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
  showcase : any = null;

  @ViewChild(IonSlides) slides: IonSlides | undefined
  @ViewChild(IonModal) modal: IonModal | undefined;

  constructor(public photoService : PhotoService,  public httpClient: HttpClient) {
    this.addSection();

    this.httpClient.post("http://localhost/api.php", {action : 'get-pdfs'}).subscribe((data: any)=>{
      this.showcases = data
    })
  }

  ngAfterViewInit() {

  }

  addPhotoToGallery(i:number) {
    this.addNewToGallery().then((response) => {
      const src = "data:image/jpeg;base64," + response.base64String
      this.pdf.images[i].src = src
    });

  }

  updateSlideIndex(e: any) {
    if(this.slides)
    this.slides.getActiveIndex().then((i:number) => {
      this.currentIndex = i + 1
    })
  }

  showPdf(id: number) {
    this.httpClient.post("http://localhost/api.php", {action : 'get-pdf', id : id}).subscribe((data: any)=>{
      this.showcase = data
      var el = document.getElementById("ex1-tab-2")
      if(el)
        el.click()
    })
  }

  

  public async addNewToGallery() {

    return await Camera.getPhoto({
      source: CameraSource.Camera,
      resultType: CameraResultType.Base64,
      quality: 100
    });

  }

  addSection() {
    this.pdf?.images.push({
      src : '',
      name : '',
      desc : '',
      success : 0,
      error : 0

    })
    if(this.slides)
      this.slides.slideNext();
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
        this.title = 'La mia lista';
        break;
      case 1:
        this.title = 'Crea PDF';
        break;
      case 2:
        this.title = 'Galleria';
        break;
        }
  }
  onNext() {
    this.counter++;
  }

  onPrevious() {
    this.counter--;
  }

  show(id: number) {

  }

  excerpt(s: any) {
    if(s)
      return s.desc.substr(0,97) + "..."
    return ""
  }

  newPdf() {
    var el =document.getElementById("ex1-tab-2") 
    if(el)
      el.click() 
  }

  back() {
    var el = document.getElementById("ex1-tab-1")
    if(el)
      el.click()
  }

  savePdf() {
    this.httpClient.post("http://localhost/api.php", {...this.pdf, action:'create-pdf'}).subscribe((data)=>{
      this.pdf = data
    })
  }

  cancel() {
    if(this.modal)
    this.modal.dismiss(null, 'cancel');
}

confirm() {
  if(this.modal)
    this.modal.dismiss(null, 'cancel');
//      this.modal.dismiss(this.name, 'confirm');
  }

  async createDirectory() {
    try {
      let ret = await Filesystem.mkdir({
        path: 'input',
        directory: FilesystemDirectory.Documents,
        recursive: false,
      });
      alert(ret);
    } catch (e) {
      alert(e);
    }    
  }

}
