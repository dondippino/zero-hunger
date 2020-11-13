import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as crossfilter from 'crossfilter2/crossfilter';
import {UtilsService} from './utils.service'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Zero Hunger Cross-Filter Data
  zeroHungerData: any;

  // Dimensions
  public dimensions: any = {
    decileDim: undefined,
    stateDim: undefined
  };

  // Groups
  public disabled: any = 0;
  aged: any;
  whh: any;
  fhh: any;
  ill: any;
  under15: any;

  // Pie Chart
  pie1:any;

  // ECharts Instances
  echartsInstances: any = {};
  addEchartsInstance(key,instance){
    this.echartsInstances[key] = instance;
    console.log(this.echartsInstances);
  }

  // Map data
  mapData1:any;

  // Pie data
  pieData:any;

  testObj:any = {};

  constructor(private http: HttpClient, private utilService: UtilsService) {
    this.utilService.updateAll.subscribe(() => {
      this.updateAll();
    })
  }

  filterData(dimension, predicate) {
    dimension.filterFunction(predicate);
  }

  testFilter() {
   
  }

  clearFilter(dimension) {
    dimension.filterAll();
  }

  setAllGroupData(filterPredicate?) {
    /////////////////////////// Initialize groups /////////////////////
    this.disabled = this.dimensions.decileDim.group().reduceSum(s => { return s['PERSONS WITH DISABILITY']; }).top(2).filter(filterPredicate)[0].value;
    this.aged = this.dimensions.decileDim.group().reduceSum(s => { return s['AGED']; }).top(2).filter(filterPredicate)[0].value;
    this.whh = this.dimensions.decileDim.group().reduceSum(s => { return s['WIDOW HEADED HHS']; }).top(2).filter(filterPredicate)[0].value;
    this.fhh = this.dimensions.decileDim.group().reduceSum(s => { return s['FEMALE HEADED HHS']; }).top(2).filter(filterPredicate)[0].value;
    this.ill = this.dimensions.decileDim.group().reduceSum(s => { return s['CHRONICALLY ILL']; }).top(2).filter(filterPredicate)[0].value;
    this.under15 = this.dimensions.decileDim.group().reduceSum(s => { return s['UNDER 15']; }).top(2).filter(filterPredicate)[0].value;
  }
  setMapData(filterPredicate?){
    ////////////////////// initialize Map Data /////////////////////////
    // if(filterPredicate === undefined){
    //   this.mapData1 = this.dimensions.stateDim.group().orderNatural().reduceSum(s => { return s['INDIVIDUALS']; }).top(Infinity).map(m => {
    //     return { name: m.key, value: m.value }
    //   });
    // } else {
    //   this.mapData1 = this.dimensions.stateDim.group().orderNatural().reduceSum(s => { return s['INDIVIDUALS']; }).top(Infinity).map(m => {
    //    return { name: m.key, value: m.value } 
    //   }).filter(filterPredicate);
    // }
    // this.mapOptions.series[0]['data'] = this.mapData1;
    // this.mapOptions.visualMap.max = this.mapData1[0].value;
  }

  setPieChartData(){
    //////////////////////// Initialize Pie Chart Data ////////////////
    // this.pieData = this.dimensions.decileDim.group().reduceSum(s => { return s['INDIVIDUALS']; }).top(Infinity).map(m => {
    //   var k = m.key === 'one to six' ? 'Assisted' : 'Unassisted';
    //   return { name: k, value: m.value }
    // });
    // this.pieChartOptions.series[0]['data'] = this.pieData;
  }
  
  async initData(){
    let d = await this.http.get(environment.zeroHunger).toPromise();
    this.zeroHungerData = crossfilter(<any>d);
    this.dimensions.decileDim = this.zeroHungerData.dimension(d => d['Decile']);
    this.dimensions.stateDim = this.zeroHungerData.dimension(d => d['STATE']);

    //***** TO BE REVIEWED **************/
    this.filterData(this.dimensions.decileDim, d => d === 'seven to ten');

  }
  async updateAll() {
    // Set data for groups
    // await this.setAllGroupData((current, index) => { return current.key === 'seven to ten'; });

    // Set Map data and refresh map
    await this.setMapData();
    
    // Set pie data
    await this.setPieChartData();
    console.log(this.pieData, this.pieChartOptions, this.testObj);
  }
  
  refreshAll(){
  
  }

  mapOptions:any = {
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: (params) => {
        if (isNaN(params.value) ) {
          return null;
        } else {
          
          let value: any = (params.value + '').split('.');
          value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
          // console.log(value)
          return 'INDIVIDUALS <br/>' + params.name + ': ' + value;
        }
      }
    },
    geo:{
      selectedMode: 'multiple'
    },
    visualMap: {
      show: false,
      left: 'right',
      min: 0,
      max: 150000,
      inRange: {
        color: ['#9ce1d9', '#8cc9c1', '#7aaea5', '#6c9990', '#60867d', '#54746b', '#455d53', '#36463B']
      },
      text: ['High', 'Low'],
      calculable: true
    },
    toolbox: {
      show: true,
      //orient: 'vertical',
      left: 'left',
      top: 'top',
      feature: {
        restore: { title: 'Restore' },
        saveAsImage: { title: 'Save as Image' }
      }
    },
    zoom: 2,
    itemStyle: {
      borderType: 'solid',
      borderWidth: 10
    },
    series: [
      {
        name: 'Nigeria',
        nameProperty: 'ADM1_REF',
        type: 'map',
        roam: false,
        map: 'nigeria',
        aspectScale: 0.97,
        emphasis: {
          itemStyle: { areaColor: '#444' },
          label: {
            show: false,
          }
        },
        textFixed: {
          Alaska: [20, -20]
        },
        data: [
          {
            "name": "Abia",
            "value": 3644714
          },
          {
            "name": "Borno",
            "value": 5669054
          },
          {
            "name": "Federal Capital Territory",
            "value": 2996670
          },
          {
            "name": "Akwa Ibom",
            "value": 5353609
          },
          {
            "name": "Ebonyi",
            "value": 2819675
          },
          {
            "name": "Ogun",
            "value": 5048351
          },
          {
            "name": "Cross River",
            "value": 3780419
          },
          {
            "name": "Imo",
            "value": 5283288
          },
          {
            "name": "Rivers",
            "value": 7081412
          },
          {
            "name": "Kogi",
            "value": 4327246
          },
          {
            "name": "Benue",
            "value": 5568946
          },
          {
            "name": "Ekiti",
            "value": 3174006
          },
          {
            "name": "Oyo",
            "value": 7636122
          },
          {
            "name": "Niger",
            "value": 5394631
          },
          {
            "name": "Lagos",
            "value": 12102238
          },
          {
            "name": "Anambra",
            "value": 5425334
          },
          {
            "name": "Osun",
            "value": 4596693
          },
          {
            "name": "Kano",
            "value": 12706778
          },
          {
            "name": "Gombe",
            "value": 3160494
          },
          {
            "name": "Edo",
            "value": 4138994
          },
          {
            "name": "Ondo",
            "value": 4541779
          },
          {
            "name": "Nasarawa",
            "value": 2459321
          },
          {
            "name": "Kebbi",
            "value": 4311454
          },
          {
            "name": "Bauchi",
            "value": 6386388
          },
          {
            "name": "Enugu",
            "value": 4299281
          },
          {
            "name": "Delta",
            "value": 5502806
          },
          {
            "name": "Zamfara",
            "value": 4376911
          },
          {
            "name": "Taraba",
            "value": 2984174
          },
          {
            "name": "Kwara",
            "value": 3129582
          },
          {
            "name": "Jigawa",
            "value": 5690516
          },
          {
            "name": "Yobe",
            "value": 3197296
          },
          {
            "name": "Katsina",
            "value": 7645575
          },
          {
            "name": "Plateau",
            "value": 4088038
          },
          {
            "name": "Sokoto",
            "value": 4879641
          },
          {
            "name": "Kaduna",
            "value": 8007205
          },
          {
            "name": "Bayelsa",
            "value": 2228965
          },
          {
            "name": "Adamawa",
            "value": 4145684
          }
        ]

      }
    ],
    grid: { bottom: "0%", top: "0%", right: "40px", left: "40px" },
  }
  pieChartOptions = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  // roseType: 'radius',
  series: [
    {

      name: 'National Social Register',
      type: 'pie',
      radius: '55%',
      center: ['50%', '40%'],
      color: ['#9CE1D9', '#015C55'],
      data: [
        { value: 14000000, name: 'Assisted' },
        { value: 2000000, name: 'Unassisted' }
      ],
      label: {
        color: 'rgba(0, 0, 0, 1)',
        alignTo: 'left',
        bleedMargin: 0.1,
        margin: 0.1,
        distanceToLabelLine: 0.01
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      animationType: 'scale',
      animationEasing: 'elasticOut',
      animationDelay: function (idx) {
        return Math.random() * 200;
      },
      // width: '100%',
      // height: '200px'
    }
  ],
  grid: {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }

};
  
}
