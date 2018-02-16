import {Component, OnInit} from '@angular/core';
import {dataService} from './services/data.service';
import { IntervalObservable } from "rxjs/observable/IntervalObservable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private alive: boolean; // used to unsubscribe from the IntervalObservable

  constructor(
    private dataService: dataService
  ) {this.alive = true;}

  rowdata= [];
  stroke_count = [];
  stroke_rate = [];
  watts = [];
  distance:number = 0;
  last_distance:number = 0;
  multiple:number = 0;
  start:boolean = false;
  calc_distance:number = 0;
  start_distance:number = 0;
  isDataAvailable:boolean = false;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
   //this.dataService.getData()
   //  .subscribe(data => this.rowdata = this.sortData(data));
    // get our data immediately when the component inits

    this.dataService.getData()
      .first() // only gets fired once
      .subscribe((data) => {
        this.rowdata = this.sortData(data);
      });

    // get our data every subsequent 10 seconds
    IntervalObservable.create(10000)
      .takeWhile(() => this.alive) // only fires when component is alive
      .subscribe(() => {
        this.dataService.getData()
          .subscribe(data => {
            this.rowdata = this.sortData(data);
          });
      });
  }
  sortData(data) {
    let delta:number = 10;
    for (let i = 0; i < data.length; i++) {
      data[i].total_distance = this.calcDistance(data[i].distance);
      if (i % 6 == 0 && i>3) {
        this.stroke_rate.push(+data[i].stroke_rate);
        this.stroke_count.push(+data[i].stroke_count);
        this.watts.push(+data[i].watt);
      }

      if (i === (data.length-1)) {
        console.log(this.stroke_rate);
        this.lineChartData = [{data: this.stroke_rate, label: 'Stroke rate'}];
        this.watt_lineChartData = [{data: this.watts, label: 'Watts'}];
        this.lineChartLabels = [this.stroke_count];
        this.isDataAvailable = true;
      }
    }
    return data;
  }

  calcDistance(distance) {
    if (+distance > this.last_distance && this.start) {
      this.calc_distance = 256;
      this.multiple++;
    } else {
      if (this.start) {
        if (this.multiple>0) {
          this.distance = (this.calc_distance - distance) + ((this.multiple-1) * this.calc_distance) + this.start_distance;
        } else {
          this.distance = (this.calc_distance - distance);
        }
      }
    }
    if (!this.start && distance>0) {
      this.distance = 0;
      this.calc_distance = 112;
      this.start_distance = 112;
      this.start = true;
    }
    this.last_distance = distance;
    return this.distance;
  }

  public watt_lineChartData:Array<any> = [{data: this.watts, label: 'Watts'}];
  public lineChartData:Array<any> = [{data: this.stroke_rate, label: 'Stroke rate'}];

  public lineChartLabels:Array<any> = this.stroke_count;
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

}

