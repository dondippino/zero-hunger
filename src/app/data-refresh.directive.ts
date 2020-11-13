import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appDataRefresh]'
})
export class DataRefreshDirective {

  @Input('options') options: any;
  @Input('val') value: number;
  constructor() { }
  @HostListener('change', ['$event']) ngOnChanges(change) {
    this.value = change.options.currentValue;
  }

}
