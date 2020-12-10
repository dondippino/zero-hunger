import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * Utility Service 
 */
export class UtilsService {
  constructor(private http: HttpClient) {
    this.refreshAll = new Subject<any>();
    this.updateAll = new Subject<any>();
    this.refreshDataTable = new Subject<any>(); 
    this.updatePopInfo = new Subject<any>(); 

    this.httpClient = http;
   }
  public httpClient: HttpClient;
  public diskData:any;
  public refreshAll:any;
  public updateAll:any;
  public refreshDataTable:any
  public updatePopInfo: any
  grays: any = (mode?) => {
    let colors = {
      white: "#fff",
      "100": "#f9fafd",
      "200": "#edf2f9",
      "300": "#d8e2ef",
      "400": "#b6c1d2",
      "500": "#9da9bb",
      "600": "#748194",
      "700": "#5e6e82",
      "800": "#4d5969",
      "900": "#344050",
      "1000": "#232e3c",
      "1100": "#0b1727",
      black: "#000",
    };
    if (mode.isDark) {
      colors = {
        white: "#0e1c2f",
        "100": "#132238",
        "200": "#061325",
        "300": "#344050",
        "400": "#4d5969",
        "500": "#5e6e82",
        "600": "#748194",
        "700": "#9da9bb",
        "800": "#b6c1d2",
        "900": "#d8e2ef",
        "1000": "#edf2f9",
        "1100": "#f9fafd",
        black: "#fff",
      };
    }
    return colors;
  };
  colors:any =  {
    primary: "#2c7be5",
    secondary: "#748194",
    success: "#00d27a",
    info: "#27bcfd",
    warning: "#f5803e",
    danger: "#e63757",
    light: "#f9fafd",
    dark: "#0b1727",
    theme: "#015C55"
  };
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
  getPosition(pos, params, dom, rect, size) {
    return {
      top: pos[1] - size.contentSize[1] - 10,
      left: pos[0] - size.contentSize[0] / 2
    };
  };

  getData = (data) =>{
    return this.httpClient.get(data);
  }
}