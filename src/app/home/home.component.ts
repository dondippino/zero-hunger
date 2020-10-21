import { AUTO_STYLE } from '@angular/animations';
import { Component, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { environment } from 'src/environments/environment';
// import * as echarts from '../../assets/js/echarts.min.js';
import * as echarts from 'echarts';

import { UtilsService } from '../utils.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public utils: UtilsService;
  chartOption: any;
  // formatUtil = echarts.format;
  lineDefaultOptions: any;
  lineDefaultOptions2: any;
  pieChartOptions: any;
  treeMapOptions: any;
  mapOptions: any;
  mapOptions2: any;
  treeData: any;
  env: any;


  constructor(public utilService: UtilsService) {
    this.utils = utilService;
    console.log(this.utils.diskData)
    this.env = environment;
  }
  @ViewChild('lineChart')
  lineChart: ElementRef;

  ngOnInit(): void {
    this.utils.getData(this.env.treeMap).subscribe(data => {
      this.treeData = data;
      //=================================
      this.treeMapOptions = {
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
              '<div class="tooltip-title"></div>',
              'Population: ' + value + ' ',
            ].join('');
          }
        },

        series: [
          {
            name: 'LGA',
            type: 'treemap',
            visibleMin: 300,
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
            levels: this.getLevelOption(),
            data: this.treeData
          }
        ],
        grid: { bottom: "8%", top: "0%", right: "40px", left: "40px" },
      }
    });

    this.utils.getData(this.env.nigeria).subscribe(data => {
      console.log(data);
      //=================================
      echarts.registerMap('nigeria', data);

      this.mapOptions = {
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: (params) => {
            console.log(params);
            let value: any = (params.value + '').split('.');
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
            return params.seriesName + '<br/>' + params.name + ': ' + value;
          }
        },
        visualMap: {
          show: false,
          left: 'right',
          min: 0,
          max: 13000000,
          inRange: {
            // color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
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
            // dataView: { readOnly: true, title: 'Data View' },
            restore: { title: 'Restore' },
            saveAsImage: { title: 'Save as Image' }
          }
        },
        zoom: 2,
        itemStyle: {
          borderType: 'dotted',
          borderWidth: 10
        },
        series: [
          {
            name: 'Nigeria',
            nameProperty: 'ADM1_REF',
            type: 'map',
            roam: true,
            map: 'nigeria',
            aspectScale: 0.97,

            emphasis: {
              itemStyle: { areaColor: '#444' },
              label: {
                show: false,
              }
            },
            // 文本位置修正
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
      this.mapOptions2 = {
        tooltip: {
          trigger: 'item',
          showDelay: 0,
          transitionDuration: 0.2,
          formatter: (params) => {
            console.log(params);
            let value: any = (params.value + '').split('.');
            value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,');
            return params.seriesName + '<br/>' + params.name + ': ' + value;
          }
        },
        visualMap: {
          show: false,
          left: 'right',
          min: 0,
          max: 13000000,
          inRange: {
            // color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
            color: ['#73b358', '#97bb41', '#aec032', '#c6c623', '#e0cc13', '#ffd300', '#f7b002', '#f09104', '#e97406', '#df4809', '#d3130c']
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
            // dataView: { readOnly: true, title: 'Data View' },
            restore: { title: 'Restore' },
            saveAsImage: { title: 'Save as Image' }
          }
        },
        zoom: 2,
        itemStyle: {
          borderType: 'dotted',
          borderWidth: 10
        },
        series: [
          {
            name: 'Nigeria',
            nameProperty: 'ADM1_REF',
            type: 'map',
            roam: true,
            map: 'nigeria',
            aspectScale: 0.97,

            emphasis: {
              itemStyle: { areaColor: '#444' },
              label: {
                show: false,
              }
            },
            // 文本位置修正
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
    });


    console.log(this.treeData);
    this.chartOption = {
      tooltip: {
        trigger: 'axis',
        padding: [7, 10],
        backgroundColor: '#FFF',
        borderColor: this.utils.grays['300'],
        borderWidth: 1,
        textStyle: {
          color: this.utils.grays['1100']
        },

        transitionDuration: 0,
        position: (pos, params, dom, rect, size) => {
          return this.utils.getPosition(pos, params, dom, rect, size);
        }
      },

      xAxis: {
        type: "category",
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        boundaryGap: false,
        splitLine: { show: false },
        axisLine: {
          show: false,
          lineStyle: {
            color: this.utils.grays["300"],
            type: "dashed",
          },
        },
        axisLabel: { show: true },
        axisTick: { show: true },
        axisPointer: { type: "none" },
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        connectNulls: true,

        symbol: "circle",
        symbolSize: 8,
        type: 'line',
        lineStyle: {
          color: this.utils.colors.white,
          width: 3,
        },
        itemStyle: {
          color: '#FFF',
          borderColor: this.utils.colors.primary,
          borderWidth: 2,
        },
        hoverAnimation: true,
        areaStyle: {
          color: '#FFF',
          opacity: 0.5
        }
      }],
      grid: { bottom: "8%", top: "0%", right: "40px", left: "40px" },
    };
    //=================================
    this.lineDefaultOptions = {
      tooltip: {
        triggerOn: "mousemove",
        trigger: "axis",
        padding: [7, 10],
        formatter: "{b0}: {c0}",
        backgroundColor: '#FFF',
        borderColor: this.utils.grays["300"],
        borderWidth: 1,
        transitionDuration: 0,
        position: (pos, params, dom, rect, size) => {
          return this.utils.getPosition(pos, params, dom, rect, size);
        },
        textStyle: { color: this.utils.colors.dark },
      },
      xAxis: {
        type: "category",
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        boundaryGap: false,
        splitLine: { show: false },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#fff',
            type: "solid",
            width: 3
          },
        },
        axisLabel: { show: true },
        axisTick: { show: false },
        axisPointer: {
          type: "line",
          lineStyle: {
            color: '#fff',
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
            color: '#fff',
            type: "dotted",
            width: 1
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#fff',
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
            color: '#FFF',
            width: 3,
          },
          itemStyle: {
            color: '#FFF',
            borderColor: this.utils.colors.primary,
            borderWidth: 2,
          },
          hoverAnimation: true,
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          connectNulls: true,
          // smooth: 0.6,
          // smoothMonotone: "x",
          symbol: "circle",
          symbolSize: 16,
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
                  color: this.utils.rgbaColor('#fff', 0.9),
                },
                {
                  offset: 1,
                  color: this.utils.rgbaColor(this.utils.colors.primary, 0),
                },
              ],
            },
          },
        },
      ],
      grid: { bottom: "10%", top: "0%", right: "40px", left: "40px" },
    };
    //=================================
    this.lineDefaultOptions2 = {
      tooltip: {
        triggerOn: "mousemove",
        trigger: "axis",
        padding: [7, 10],
        formatter: "{b0}: {c0}",
        backgroundColor: '#FFF',
        borderColor: this.utils.grays["300"],
        borderWidth: 1,
        transitionDuration: 0,
        position: (pos, params, dom, rect, size) => {
          return this.utils.getPosition(pos, params, dom, rect, size);
        },
        textStyle: { color: this.utils.colors.dark },
      },
      xAxis: {
        type: "category",
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          connectNulls: true,
          // smooth: 0.6,
          // smoothMonotone: "x",
          symbol: "circle",
          symbolSize: 16,
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
                  color: this.utils.rgbaColor('#D3130C', 0.25),
                },
                {
                  offset: 1,
                  color: this.utils.rgbaColor('#D3130C', 0),
                },
              ],
            },
          },
        },
      ],
      grid: { bottom: "10%", top: "0%", right: "40px", left: "40px" },
    };
    //=================================
    this.pieChartOptions = {
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

  ngAfterViewInit(): void {

  }
  getLevelOption = () => {
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
  }




}
