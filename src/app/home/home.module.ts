import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TabMenuModule } from 'primeng/tabmenu';
import { TabViewModule } from 'primeng/tabview';
import { HomePageRoutingModule } from './home-routing.module';
import { HomePage } from './home.page';
import {CardModule} from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    TabMenuModule,
    DataViewModule,
    CardModule,

    FormsModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage],
})
export class HomePageModule { }
