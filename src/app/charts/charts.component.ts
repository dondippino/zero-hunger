import { Component, ElementRef, ViewChild, OnInit, AfterViewInit, Input } from '@angular/core';
import * as echarts from '../../assets/js/echarts.min.js';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit ,AfterViewInit {

  constructor() { }
  @Input()
  options:any;

  @ViewChild('chartContainer', { static: false }) chartContainer: ElementRef;

  ngOnInit(): void {
    console.log('OnInit', this.options)
  }

  ngAfterViewInit(): void{
    console.log('ngAfterViewInit', this.options)
    let elem = this.chartContainer.nativeElement;
    let chart = echarts.init(elem);
    chart.setOption(this.options);
  }

}
