import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import {forEach} from "@angular/router/src/utils/collection";

@Injectable()
export class dataService {
  constructor (
    private http: HttpClient,
  ) {}

  distance:number = 0;
  last_distance:number = 0;
  multiple:number = 0;
  start:boolean = false;


  getData(): Observable<any>  {
    return this.http.get(`http://192.168.1.8:3001/api/v1/getdata`)
     // .map(data => this.sortData(data));
  }

  sortData(data) {
    for (let i=0;i<data.length;i++) {
      data[i].total_distance = this.calcDistance(data[i].distance);
    }
  }

  calcDistance(distance) {
    if (+distance > this.last_distance && this.start) {
      this.distance += 256;
      this.multiple++;
    }
    if (!this.start) {
      this.distance = 112;
    }
    if (distance>0) {
      this.start = true;
    }
    this.last_distance = distance;
    return this.distance;
  }
}
