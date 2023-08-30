import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    TabMenuModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage]
})
export class HomePageModule { }
