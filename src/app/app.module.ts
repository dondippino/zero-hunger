import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { NgxEchartsModule } from 'ngx-echarts';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartsComponent } from './charts/charts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CountUpModule } from 'ngx-countup';
import { DataTablesModule } from 'angular-datatables';

import { CountupDirective } from './countup.directive';
import { DataService } from './data.service';
import { DataRefreshDirective } from './data-refresh.directive';
import { ChartDataService } from './chart-data.service';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ChartsComponent,
    DashboardComponent,
    CountupDirective,
    DataRefreshDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DataTablesModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    NgbModule,
    CountUpModule
  ],
  exports: [],
  providers: [ChartDataService, { provide: APP_INITIALIZER, useFactory: initFunction, deps: [ChartDataService], multi: true }],

  bootstrap: [AppComponent]
})
export class AppModule { }
export function initFunction(config: DataService) {
  return async () => await config.initData();
}
