import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import {dataService} from "./services/data.service";
import { HttpClientModule } from "@angular/common/http";
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ChartsModule
  ],
  providers: [dataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
