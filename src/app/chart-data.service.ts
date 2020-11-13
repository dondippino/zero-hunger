import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UtilsService } from './utils.service'
import * as crossfilter from 'crossfilter2/crossfilter';


@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  // Zero Hunger Cross-Filter Data
  zeroHungerData: any;

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
    this.echartsInstances[key].on('click', (params) => {
      if (params.componentSubType === 'map' && params.data !== undefined){
        this.stateModel[params.data.name] = true;
        this.setAllDataToComponents();
        this.refreshAllVisualization();
        // Workaround for Groups
        this.sendGroupDataByEvent();
      }
      if (params.componentSubType === 'map' && params.data === undefined) {
        this.resetAllFilters();
        // Workaround for Groups
        this.sendGroupDataByEvent();
      }
    });
  }

  // Groups
  disabled: any = 0;
  aged: any;
  whh: any;
  fhh: any;
  ill: any;
  under15: any;

  // Map data
  mapData1: any;
  nigeriaGeoJSON:any;

  // Pie Chart
  pie1: any;
  pieData: any;

  // TreeMapData
  treeMapData: any;

  // Table Data
  tableData:any;

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
  mapOptions: any = {
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2,
      formatter: (params) => {
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

  // Pie Chart options
  pieChartOptions = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)',
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

        return [
          '<div class="tooltip-title">INDIVIDUALS</div>',
          info.name + ': ' + value + ' ',
        ].join('');
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

  constructor(private http: HttpClient, private utilService: UtilsService)  { }
  async initData() {
    await this.initializeCrossfilter();
    await this.fetchNigeriaGeoJSON();
    this.createDimensions();
    this.constructDimensionPredicates();
    this.constructPredicates();
    this.applyDimensionFilters();
    this.runFilter();
    this.setMapData();
    this.setPieChartData();
    this.setTreeMapData();
    

  }

  async fetchNigeriaGeoJSON(){
    this.nigeriaGeoJSON = await this.http.get(environment.nigeria).toPromise();
  }

  async initializeCrossfilter(){
    let d = await this.http.get(environment.zeroHunger).toPromise();
    this.zeroHungerData = crossfilter(<any>d);
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
    this.setTreeMapData();
  }

  refreshAllVisualization(){
    this.echartsInstances.map1.setOption(this.mapOptions, { notMerge: true });
    this.echartsInstances.pie1.setOption(this.pieChartOptions, { notMerge: true });
    this.echartsInstances.tree1.setOption(this.treeMapOptions, { notMerge: true });
    this.utilService.refreshDataTable.next();
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
    this.mapOptions.series[0]['data'] = this.mapData1;
    this.mapOptions.visualMap.max = this.mapData1[0].value;
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
      }
    }, {});
    this.treeMapData = Object.values(d);
    this.treeMapOptions.series[0]['data'] = this.treeMapData;
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
      under15: this.under15
    }
    this.utilService.refreshAll.next(data);
  }

}
