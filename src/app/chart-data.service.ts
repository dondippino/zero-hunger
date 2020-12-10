import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service'
import * as crossfilter from 'crossfilter2/crossfilter';


@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  // Zero Hunger Cross-Filter Data
  zeroHungerData: any;
  mvamInadequateDiet: any;
  mvamlivelihoodBasedCoping: any;
  mvamInadequateDietTrend: any;
  mvamlivelihoodBasedCopingTrend: any;

  // Dimensions
  public dimensions: any = {
    unfiltered: undefined,
    decileDim: undefined,
    stateDim: undefined
  };

  dimensionPredicates:any = {
    decileDim: undefined,
    stateDim: undefined
  };

  predicates:any ={
    decileDim: undefined,
    stateDim: undefined
  }

  namePredicates: any = {
    decileDim: undefined,
    stateDim: undefined
  }

  datatablePredicates:any = {
    decileDim: undefined,
    stateDim: undefined
  }

  // ECharts Instances
  echartsInstances: any = {};
  addEchartsInstance(key, instance) {
    this.echartsInstances[key] = instance;
    // this.echartsInstances[key].on('click', (params) => {
    //   if (params.componentSubType === 'map' && params.data !== undefined){
    //     this.stateModel[params.data.name] = true;
    //     this.setAllDataToComponents();
    //     this.refreshAllVisualization();
    //     this.selectedStatesPopulation();
    //     // Workaround for Groups
    //     this.sendGroupDataByEvent();
    //     // this.sendPopInfoEvent();
    //   }
    //   if (params.componentSubType === 'map' && params.data === undefined) {
    //     this.resetAllFilters();
    //     this.selectedStatesPopulation();
    //     // Workaround for Groups
    //     this.sendGroupDataByEvent();
    //     // this.sendPopInfoEvent();
    //   }
      
    // });
  }

  // States Population
  statesPopulation: any;
  popInfo: any = 'Nigeria';

  // Groups
  disabled: any = 0;
  aged: any;
  whh: any;
  fhh: any;
  ill: any;
  under15: any;
  population: any;
  allPopulation: any;

  // Map data
  mapData1: any;
  nigeriaGeoJSON:any;
  mapData2:any;
  mapData3:any;

  // Pie Chart
  pie1: any;
  pieData: any;

  // TreeMapData
  treeMapData: any;

  // Table Data
  tableData:any;

  // Area Chart Data
  areaChartData1: any = {};
  areaChartData2: any = {};

  // All filter states
  allFilterStates:any;

  stateModel = {
    "Abia": false,
    "Adamawa": false,
    "Akwa Ibom": false,
    "Anambra": false,
    "Bauchi": false,
    "Bayelsa": false,
    "Benue": false,
    "Borno": false,
    "Cross River": false,
    "Delta": false,
    "Ebonyi": false,
    "Edo": false,
    "Ekiti": false,
    "Enugu": false,
    "Federal Capital Territory": false,
    "Gombe": false,
    "Imo": false,
    "Jigawa": false,
    "Kaduna": false,
    "Kano": false,
    "Katsina": false,
    "Kebbi": false,
    "Kogi": false,
    "Kwara": false,
    "Lagos": false,
    "Nasarawa": false,
    "Niger": false,
    "Ogun": false,
    "Ondo": false,
    "Osun": false,
    "Oyo": false,
    "Plateau": false,
    "Rivers": false,
    "Sokoto": false,
    "Taraba": false,
    "Yobe": false,
    "Zamfara": false
  }

  states = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Federal Capital Territory', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

  decileModel:any = {
    decile16: false,
    decile710: true
  }

  // Map options
  mapOptionsBase: any = {
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: (params) => {
        console.log('trace',params)
        if (isNaN(params.value)) {
          return null;
        } else {

          let value: any = (params.value + '').split('.');
          value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
          return 'INDIVIDUALS <br/>' + params.name + ': ' + value;
        }
      }
    },
    geo: {
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
        // restore: { title: 'Restore' },
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
        data: []

      }
    ],
    grid: { bottom: "0%", top: "0%", right: "40px", left: "40px" },
  }

  mapOptions: any = JSON.parse(JSON.stringify(this.mapOptionsBase));
  mapOptions2: any = JSON.parse(JSON.stringify(this.mapOptionsBase));
  mapOptions3: any = JSON.parse(JSON.stringify(this.mapOptionsBase));

  // Pie Chart options
  pieChartOptions = {
    tooltip: {
      trigger: 'item',
      // formatter: '{a}? <br/>{b} : {c} ({d}%)',
      formatter:  (params, ticket, callback)=> {
        return `National Social Register <br/><b>${params.data.name}</b> : ${this.formatNumber(params.data.value)}`;
      },
      position: 'right'
    },
    // roseType: 'radius',
    series: [
      {

        name: 'National Social Register',
        type: 'pie',
        radius: '55%',
        center: ['50%', '40%'],
        color: ['#9CE1D9', '#015C55'],
        data: [],
        label: {
          color: 'rgba(0, 0, 0, 1)',
          alignTo: 'edge',
          bleedMargin: 0.1,
          margin: 0.1,
          distanceToLabelLine: 0.01,
          // rotate: true,
          formatter: ((x)=>{
            return `${x.name}\n(${x.percent}%)`;
          })
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
        animationDelay: (idx) => {
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

  // Treemap options
  treeMapOptions = {
    // width: '100%',
    // height: '100%',
    left: '1%',
    tooltip: {
      formatter: (info) => {
        var value = info.value;
        var treePathInfo = info.treePathInfo;
        var treePath = [];

        for (var i = 1; i < treePathInfo.length; i++) {
          treePath.push(treePathInfo[i].name);
        }

        return `<div class="tooltip-title">INDIVIDUALS</div> <b>${info.name}</b>: ${this.formatNumber(value)}` ;
      }
    },

    series: [
      {
        name: 'LGA',
        type: 'treemap',
        leafDepth: 3,
        visibleMin: 300,
        roam: false,
        label: {
          show: true,
          formatter: '{b}'
        },
        upperLabel: {
          show: true,
          height: 30
        },
        itemStyle: {
          borderColor: '#fff'
        },
        levels: (() => {
          return [
            {
              itemStyle: {
                borderColor: '#777',
                borderWidth: 0,
                gapWidth: 1
              },
              upperLabel: {
                show: false
              }
            },
            {
              itemStyle: {
                borderColor: '#555',
                borderWidth: 5,
                gapWidth: 1
              },
              emphasis: {
                itemStyle: {
                  borderColor: '#ddd'
                }
              }
            },
            {
              colorSaturation: [0.35, 0.5],
              itemStyle: {
                borderWidth: 5,
                gapWidth: 1,
                borderColorSaturation: 0.6
              }
            }
          ];
        })(),
        data: []
      }
    ],
    grid: { bottom: "8%", top: "0%", right: "40px", left: "40px" },
  }

  // Area Chart Options
  lineDefaultOptions = {
    tooltip: {
      triggerOn: "mousemove",
      trigger: "axis",
      // padding: [7, 10],
      // formatter: "{b0}: {c0}",
      // backgroundColor: '#FFF',
      // borderColor: this.utilService.grays["300"],
      // borderWidth: 1,
      // transitionDuration: 0,
      position: (pos, params, dom, rect, size) => {
        return this.utilService.getPosition(pos, params, dom, rect, size);
      },
      // textStyle: { color: '#0b1727' },
     
    },
    xAxis: {
      type: "category",
      data: [],
      boundaryGap: false,
      splitLine: { show: false },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ccc',
          type: "solid",
          width: 3
        },
      },
      axisLabel: { show: true },
      axisTick: { show: false },
      axisPointer: {
        type: "line",
        lineStyle: {
          color: '#ccc',
          type: "dotted",
          width: 1
        },
      },
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ccc',
          type: "dashed",
          width: 1
        }
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ccc',
          type: "solid",
          width: 3
        }
      },
      axisLabel: { show: true },
      axisTick: { show: false },
      axisPointer: { show: false },
    },
    series: [
      {
        type: "line",
        lineStyle: {
          color: '#D3130C',
          width: 3,
        },
        itemStyle: {
          color: '#fff',
          borderColor: '#D3130C',
          borderWidth: 2,
        },
        hoverAnimation: true,
        data: [],
        connectNulls: true,
        // smooth: 0.6,
        smoothMonotone: "x",
        symbol: "circle",
        symbolSize: 0,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: this.rgbaColor('#D3130C', 0.75),
              },
              {
                offset: 1,
                color: this.rgbaColor('#D3130C', 0),
              },
            ],
          },
        },
      },
    ],
    grid: { bottom: "10%", top: "0%", right: "40px", left: "40px" },
  };
  lineOptions: any = JSON.parse(JSON.stringify(this.lineDefaultOptions));
  lineOptions2: any = JSON.parse(JSON.stringify(this.lineDefaultOptions));

  constructor(private http: HttpClient, private utilService: UtilsService)  {}
  async initData() {
    await this.initializeCrossfilter();
    await this.fetchNigeriaGeoJSON();
    await this.fetchNigeriaPopulation();
    this.createDimensions();
    this.constructDimensionPredicates();
    this.constructPredicates();
    this.applyDimensionFilters();
    this.runFilter();
    this.setMapData();
    this.setPieChartData();
    this.setTreeMapData();
    this.setLineChartData();
    this.totalPopulation();
    this.selectedStatesPopulation();

    // this.minValue = this.areaChartData1.x[0];
    // this.maxValue = this.areaChartData1.x[this.areaChartData1.x.length - 1];
    this.firstRun = false; 
    
  }

  async fetchNigeriaGeoJSON(){
    this.nigeriaGeoJSON = await this.http.get(environment.nigeria).toPromise();
  }

  async fetchNigeriaPopulation() {
    this.statesPopulation = await this.http.get(environment.nigeria_population).toPromise();
  }

  async initializeCrossfilter(){
    let d = await this.http.get(`${environment.apiServer}/zero-hunger`).toPromise();
    this.mvamInadequateDiet = await this.http.get(`${environment.apiServer}/mvam/inadequate-diet`).toPromise();
    this.mvamlivelihoodBasedCoping = await this.http.get(`${environment.apiServer}/mvam/livelihood-based-coping`).toPromise();
    this.mvamInadequateDietTrend = await this.http.get(`${environment.apiServer}/mvam/inadequate-diet-trend`).toPromise();
    this.mvamlivelihoodBasedCopingTrend = await this.http.get(`${environment.apiServer}/mvam/livelihood-based-coping-trend`).toPromise();
    
    this.zeroHungerData = crossfilter(<any>d);
    // this.mvamInadequateDiet = crossfilter(<any>mvamDiet);
    // this.mvamlivelihoodBasedCoping = crossfilter(<any>mvamLBCoping);
  }

  createDimensions(){
    this.dimensions.decileDim = this.zeroHungerData.dimension(d => d['Decile']);
    this.dimensions.stateDim = this.zeroHungerData.dimension(d => d['STATE']); 
  }

  filterData(dimension, predicate):void {
    dimension.filterFunction(predicate);
  }

  setStateModel(event) {
    this.stateModel[event.target.id] = event.target.checked;
    this.setAllDataToComponents();
    this.refreshAllVisualization();
  }

  setDecileModel(event){
    this.decileModel[event.target.id] = event.target.checked;
    this.setAllDataToComponents();
    this.refreshAllVisualization();
  }

  setAllDataToComponents(){
    this.constructDimensionPredicates();
    this.constructPredicates();
    this.applyDimensionFilters();
    this.runFilter();
    this.setMapData(eval(this.namePredicates.stateDim));
    this.setPieChartData();
    this.setLineChartData();
    this.setTreeMapData();
    this.selectedStatesPopulation();
    // console.log(this.selectedStatesPopulation(), this.datatablePredicates.stateDim)
    
  }

  refreshAllVisualization(){
    this.echartsInstances.map1.setOption(this.mapOptions, { notMerge: true });
    this.echartsInstances.map2.setOption(this.mapOptions2, { notMerge: true });
    this.echartsInstances.map3.setOption(this.mapOptions3, { notMerge: true });
    this.echartsInstances.pie1.setOption(this.pieChartOptions, { notMerge: true });
    this.echartsInstances.tree1.setOption(this.treeMapOptions, { notMerge: true });
    this.echartsInstances.line1.setOption(this.lineOptions, { notMerge: true });
    this.echartsInstances.line2.setOption(this.lineOptions2, { notMerge: true });
    this.utilService.refreshDataTable.next();
    this.sendGroupDataByEvent();
  }

  clearFilter(dimension) {
    dimension.filterAll();
  }

  constructDimensionPredicates(){
    this.dimensionPredicates.decileDim = 'd => ' + (Object.keys(this.decileModel).filter((v, i) => this.decileModel[v]).length > 0 ? Object.keys(this.decileModel).filter((v, i) => this.decileModel[v]).map(v => `d === '${v === 'decile16' ? 'one to six' : 'seven to ten'}'` ).join(' || ') : 'd');
    this.dimensionPredicates.stateDim = 's => ' + (Object.keys(this.stateModel).filter((v, i) => this.stateModel[v]).length > 0 ? Object.keys(this.stateModel).filter((v, i) => this.stateModel[v]).map(v => `s === '${v}'`).join(' || ') : "s");
  }

  constructPredicates() {
    this.predicates.decileDim = 'd => ' + (Object.keys(this.decileModel).filter((v, i) => this.decileModel[v]).length > 0 ? Object.keys(this.decileModel).filter((v, i) => this.decileModel[v]).map(v => `d.key === '${v === 'decile16' ? 'one to six' : 'seven to ten'}'`).join(' || ') : 'd');
    this.predicates.stateDim = 's => ' + (Object.keys(this.stateModel).filter((v, i) => this.stateModel[v]).length > 0 ? Object.keys(this.stateModel).filter((v, i) => this.stateModel[v]).map(v => `s.key === '${v}'`).join(' || ') : "s");

    this.namePredicates.decileDim = 'd => ' + (Object.keys(this.decileModel).filter((v, i) => this.decileModel[v]).length > 0 ? Object.keys(this.decileModel).filter((v, i) => this.decileModel[v]).map(v => `d.name === '${v === 'decile16' ? 'one to six' : 'seven to ten'}'`).join(' || ') : 'd');
    this.namePredicates.stateDim = 's => ' + (Object.keys(this.stateModel).filter((v, i) => this.stateModel[v]).length > 0 ? Object.keys(this.stateModel).filter((v, i) => this.stateModel[v]).map(v => `s.name === '${v}'`).join(' || ') : "s");

    this.datatablePredicates.decileDim = Object.keys(this.decileModel).filter((v, i) => this.decileModel[v]).map(v => `${v === 'decile16' ? 'one to six' : 'seven to ten'}`).join('|');
    this.datatablePredicates.stateDim = Object.keys(this.stateModel).filter((v, i) => this.stateModel[v]).map(v => `${v.trim()}`).join('|');
  }

  applyDimensionFilters(){
    if (this.dimensionPredicates.decileDim === "d => d" || this.dimensionPredicates.decileDim === "d => d === 'one to six' || d === 'seven to ten'"){
      this.clearFilter(this.dimensions.decileDim);
    }else{
      this.filterData(this.dimensions.decileDim, eval(this.dimensionPredicates.decileDim));
    }
    this.filterData(this.dimensions.stateDim, eval(this.dimensionPredicates.stateDim));
  }

  runFilter(){
    if (this.dimensionPredicates.decileDim === "d => d" || this.dimensionPredicates.decileDim === "d => d === 'one to six' || d === 'seven to ten'"){
      this.disabled = this.zeroHungerData.groupAll().reduceSum(s => { return s['PERSONS WITH DISABILITY']; }).value();
      this.aged = this.zeroHungerData.groupAll().reduceSum(s => { return s['AGED']; }).value();
      this.whh = this.zeroHungerData.groupAll().reduceSum(s => { return s['WIDOW HEADED HHS']; }).value();
      this.fhh = this.zeroHungerData.groupAll().reduceSum(s => { return s['FEMALE HEADED HHS']; }).value();
      this.ill = this.zeroHungerData.groupAll().reduceSum(s => { return s['CHRONICALLY ILL']; }).value();
      this.under15 = this.zeroHungerData.groupAll().reduceSum(s => { return s['UNDER 15']; }).value();
    }else{
      this.disabled = this.dimensions.decileDim.group().reduceSum(s => { return s['PERSONS WITH DISABILITY']; }).top(Infinity).filter(eval(this.predicates.decileDim))[0].value;
      this.aged = this.dimensions.decileDim.group().reduceSum(s => { return s['AGED']; }).top(Infinity).filter(eval(this.predicates.decileDim))[0].value;
      this.whh = this.dimensions.decileDim.group().reduceSum(s => { return s['WIDOW HEADED HHS']; }).top(Infinity).filter(eval(this.predicates.decileDim))[0].value;
      this.fhh = this.dimensions.decileDim.group().reduceSum(s => { return s['FEMALE HEADED HHS']; }).top(Infinity).filter(eval(this.predicates.decileDim))[0].value;
      this.ill = this.dimensions.decileDim.group().reduceSum(s => { return s['CHRONICALLY ILL']; }).top(Infinity).filter(eval(this.predicates.decileDim))[0].value;
      this.under15 = this.dimensions.decileDim.group().reduceSum(s => { return s['UNDER 15']; }).top(Infinity).filter(eval(this.predicates.decileDim))[0].value;
    }
  }

  setMapData(filterPredicate?) {
    ////////////////////// initialize Map Data /////////////////////////
    if (filterPredicate === undefined) {
      this.mapData1 = this.dimensions.stateDim.group().orderNatural().reduceSum(s => { return s['INDIVIDUALS']; }).top(Infinity).map(m => {
        return { name: m.key, value: m.value }
      });
    } else {
      this.mapData1 = this.dimensions.stateDim.group().orderNatural().reduceSum(s => { return s['INDIVIDUALS']; }).top(Infinity).map(m => {
        return { name: m.key, value: m.value }
      }).filter(filterPredicate);
    }
    this.mapOptions.tooltip.formatter = (params) => {
      if (isNaN(params.value)) {
        return null;
      } else {

        let value: any = (params.value + '').split('.');
        value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
        return `INDIVIDUALS <br/> <b>${params.name}</b>: ${value}`;
      }
    }
    this.mapOptions.series[0]['data'] = this.mapData1;
    this.mapOptions.visualMap.max = this.mapData1[0].value;

    ////////////////////// initialize Map Data 2 /////////////////////////
    // console.log(filterPredicate, this.mapData2,this.mvamInadequateDiet)
    if (filterPredicate === undefined) {
      this.mapData2 = this.mvamInadequateDiet.map(m => {
        return { name: m['State'], value: m['Mean crrnt'] }
      }).sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
    } else {
      this.mapData2 = this.mvamInadequateDiet.map(m => {
        return { name: m['State'], value: m['Mean crrnt'] }
      }).filter(filterPredicate).sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
    }
    
    this.mapOptions2.tooltip.formatter = (params) => {
      if (isNaN(params.value)) {
        return null;
      } else {
        return `% WITH INADEQUATE DIET <br/><b>${params.name}</b>: ${(params.value.toFixed(2))}`;
      }
    }
    this.mapOptions2.series[0]['data'] = this.mapData2;

    this.mapOptions2.visualMap.inRange.color = ['#73b358', '#97bb41', '#aec032', '#c6c623', '#e0cc13', '#ffd300', '#f7b002', '#f09104', '#e97406', '#df4809', '#d3130c'];
    if (this.mapData2.length > 0){
      this.mapOptions2.visualMap.max = this.mapData2[0].value;
    }

    ////////////////////// initialize Map Data 3 /////////////////////////
    // console.log(filterPredicate, this.mapData2,this.mvamInadequateDiet)
    if (filterPredicate === undefined) {
      this.mapData3 = this.mvamlivelihoodBasedCoping.map(m => {
        return { name: m['State'], value: m['Mean crrnt'] }
      }).sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
    } else {
      this.mapData3 = this.mvamlivelihoodBasedCoping.map(m => {
        return { name: m['State'], value: m['Mean crrnt'] }
      }).filter(filterPredicate).sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
    }

    this.mapOptions3.tooltip.formatter = (params) => {
      if (isNaN(params.value)) {
        return null;
      } else {
        return `% WITH LIVELIHOOD BASED COPING STRATEGIES <br/> <b>${params.name}</b>: ${(params.value.toFixed(2))}`;
      }
    }

    this.mapOptions3.series[0]['data'] = this.mapData3;

    this.mapOptions3.visualMap.inRange.color = ['#73b358', '#97bb41', '#aec032', '#c6c623', '#e0cc13', '#ffd300', '#f7b002', '#f09104', '#e97406', '#df4809', '#d3130c'];
    if (this.mapData3.length > 0) {
      this.mapOptions3.visualMap.max = this.mapData3[0].value;
    }

  }

  setPieChartData() {
    //////////////////////// Initialize Pie Chart Data ////////////////
    this.pieData = this.dimensions.decileDim.group().reduceSum(s => { return s['INDIVIDUALS']; }).top(Infinity).map(m => {
      var k = m.key === 'one to six' ? 'Assisted' : 'Unassisted';
      return { name: k, value: m.value }
    });
    this.pieChartOptions.series[0]['data'] = this.pieData;
  }

  setTreeMapData(){
    let d = this.zeroHungerData.allFiltered().reduce((o, c, i) => {
      if (o[c['STATE']] === undefined) {
        o[c['STATE']] = { name: c['STATE'].trim(), value: 0, path: c['STATE'].trim(), children: [] };
        o[c['STATE']]['children'].push({ name: c['LGA'].trim(), value: c['INDIVIDUALS'], path: c['STATE'].trim() + '/' + c['LGA'].trim() });
        o[c['STATE']]['value'] += parseInt(c['INDIVIDUALS']);
        return o;
      } else {
        o[c['STATE']]['children'].push({ name: c['LGA'].trim(), value: c['INDIVIDUALS'], path: c['STATE'].trim() + '/' + c['LGA'].trim() });
        o[c['STATE']]['value'] += parseInt(c['INDIVIDUALS']);
        return o;
      }i
    }, {});
    this.treeMapData = Object.values(d);
    this.treeMapOptions.series[0]['data'] = this.treeMapData;
  }

  firstRun: boolean = true;
  async setLineChartData(){
    if (!this.firstRun) {
      this.mvamInadequateDietTrend = await this.http.get(`${environment.apiServer}/mvam/inadequate-diet-trend/${this.datatablePredicates.stateDim}`).toPromise();
      this.mvamlivelihoodBasedCopingTrend = await this.http.get(`${environment.apiServer}/mvam/livelihood-based-coping-trend/${this.datatablePredicates.stateDim}`).toPromise();
    }
    
    this.areaChartData1.x = Object.keys(this.mvamInadequateDietTrend);
    this.areaChartData1.y = Object.values(this.mvamInadequateDietTrend);
    this.lineOptions.xAxis.data = this.areaChartData1.x;
    this.lineOptions.series[0]['data'] = this.areaChartData1.y;

    this.areaChartData2.x = Object.keys(this.mvamlivelihoodBasedCopingTrend);
    this.areaChartData2.y = Object.values(this.mvamlivelihoodBasedCopingTrend);
    this.lineOptions2.xAxis.data = this.areaChartData2.x;
    this.lineOptions2.series[0]['data'] = this.areaChartData2.y;

    this.lineOptions.tooltip.formatter = (info) => {
      return `<b>${(info[0].value).toFixed(2)}</b><br/> ${info[0].name}`;
    }

    this.lineOptions2.tooltip.formatter = (info) => {
      return `<b>${(info[0].value).toFixed(2)}</b><br/> ${info[0].name}`;
    }

    if (!this.firstRun) {
      this.echartsInstances.line1.setOption(this.lineOptions, { notMerge: true });
      this.echartsInstances.line2.setOption(this.lineOptions2, { notMerge: true });
    }
  }


  // value: any = chartDataService.areaChartData1.x[0];
  minValue: any = undefined;
  maxValue: any = undefined;
  setValsforDatePicker(event) {
    if ( event.target.min === 'minValue' ) {
      this.minValue = event.target.value
    }
    if ( event.target.max === 'maxValue' ) { 
      this.maxValue = event.target.value
    }
    
    this.setAllDataToComponents();
    this.refreshAllVisualization();
  }

  resetAllFilters(){
    this.clearFilter(this.dimensions.decileDim);
    this.clearFilter(this.dimensions.stateDim);

    this.decileModel.decile16 = false;
    this.decileModel.decile710 = true;

    Object.keys(this.stateModel).forEach(state => {
      this.stateModel[state] = false;
    });

    this.setAllDataToComponents();
    this.refreshAllVisualization();

  }

  sendGroupDataByEvent(){
    let data = {
      disabled: this.disabled,
      aged: this.aged,
      whh: this.whh,
      fhh: this.whh,
      ill: this.ill,
      under15: this.under15,
      population: this.population
    }
    this.utilService.refreshAll.next(data);
  }


  hexToRgb(hexValue) {
    let hex;
    hexValue.indexOf("#") === 0
      ? (hex = hexValue.substring(1))
      : (hex = hexValue);
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
      hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)
    );
    return result
      ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
      : null;
  }


  rgbColor(color = "#fff") {
    return `rgb(${this.hexToRgb(color)})`;
  }

  rgbaColor(color = "#fff", alpha = 0.5) {
    return `rgba(${this.hexToRgb(color)}, ${alpha})`;
  }
  formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  selectedStatesPopulation(){
    let stateArr = this.datatablePredicates.stateDim.trim().length === 0 ? []: this.datatablePredicates.stateDim.trim().split('|');
    let result = stateArr.reduce((o, c, i) => {
      o += this.statesPopulation[c];
      return o;
    }, 0);
    this.population = result === 0 ? this.allPopulation : result;
    
    if(result === 0){
      this.popInfo = 'Nigeria';
    } else if (stateArr.length === 1){
      this.popInfo = stateArr[0];
    } else {
      this.popInfo = `${stateArr.length} States`;
    }
  }
  totalPopulation(){
    this.allPopulation = Object.values(this.statesPopulation).reduce((o:number, c:number, i) => {
      o += c;
      return o;
    }, 0);
  }
  // sendPopInfoEvent(){
  //   console.log(this.popInfo)
  //   this.utilService.updatePopInfo.next(this.popInfo);
  // }
  mapClickHandler(params){
    if (params.componentSubType === 'map' && params.data !== undefined) {
      this.stateModel[params.data.name] = true;
      this.setAllDataToComponents();
      this.refreshAllVisualization();
      this.selectedStatesPopulation();
      // Workaround for Groups
      this.sendGroupDataByEvent();
      // this.sendPopInfoEvent();
    }
    if (params.componentSubType === 'map' && params.data === undefined) {
      this.resetAllFilters();
      this.selectedStatesPopulation();
      // Workaround for Groups
      this.sendGroupDataByEvent();
      // this.sendPopInfoEvent();
    }
  }
}
