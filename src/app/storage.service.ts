import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-storage-api';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(    private readonly localStorageService: LocalStorageService,
    private readonly sessionStorageService: SessionStorageService) { }

  get(key:string) {
    const data = this.localStorageService.getItem(key);
    if(data)
      return JSON.parse(data);
    return []
  }

  getById(key:string, id:number) {
    const data = this.get(key);
    const i = data.filter((item:any)=> item.id == id)
    if(i)
      return i[0]
    return null
  }

  set(key:string, data:any) {
    let items : any[] = this.get(key);
    if(data.id) {
      items = items.filter((item:any)=>item.id != data.id)
      items.push(data)
      this.set(key, items)
      debugger
    } else {     
      const id = items.length + 1;
      data.id = id;
      items.push(data)
      this.localStorageService.setItem(key, JSON.stringify(items));
    }
    return items
  }
  
  delete(key:string, data:any) {
    let items : any[] = this.get(key);
    items = items.filter((item:any)=>item.id != data.id)
    this.set(key, items)
  }

}
