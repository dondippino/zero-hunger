import { Directive, ElementRef, Input, OnChanges, OnInit, AfterViewInit, AfterContentInit, HostListener, SimpleChange } from '@angular/core';
import { UtilsService } from './utils.service'
declare var $: any;

@Directive({
  selector: '[appCountup]'
})
export class CountupDirective implements OnInit, AfterViewInit, AfterContentInit {
  @Input('options') options: any;
  @Input('val') value: number;
  $counter = $(this.el.nativeElement);
  counter = this.$counter.data('options');
  playCountUpTriggered = false;
  countNum = 0;

  constructor(private el: ElementRef, private utilService: UtilsService) {
    // Listen for dashboard refresh broadcast
    this.utilService.refreshAll.subscribe((s) => {
      this.value = s[el.nativeElement.ariaLabel];
      this.countUP();
    });
  }

  ngOnInit() {
    this.countUP();
    
  }
  ngAfterViewInit() {
    
  }
  ngAfterContentInit() {
    
  }
  @HostListener('change', ['$event']) ngOnChanges(change) {
    this.value = change.value.currentValue;
    this.countUP()
  }


  countUP = () => {
    this.counter.count = this.value;
    $({
      countNum: 0
    }).animate({
      countNum: this.counter.count
    }, {
      duration: this.counter.duration || 1000,
      easing: 'linear',
      step: (now, fx) => {
        this.countNum = now;
        this.$counter.text((this.counter.prefix ? this.counter.prefix : '') + Math.floor(now));
      },
      complete: () => {
        switch (this.counter.format) {
          case 'comma':
            this.$counter.text((this.counter.prefix ? this.counter.prefix : '') + this.toComma(this.countNum));
            break;

          case 'space':
            this.$counter.text((this.counter.prefix ? this.counter.prefix : '') + this.toSpace(this.countNum));
            break;

          case 'alphanumeric':
            this.$counter.text((this.counter.prefix ? this.counter.prefix : '') + this.toAlphanumeric(this.countNum));
            break;

          default:
            this.$counter.text((this.counter.prefix ? this.counter.prefix : '') + this.countNum);
        }
      }
    });
  };

  toAlphanumeric = (num) => {
    var number = num;
    var abbreviations = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
      t: 1000000000000
    };

    if (num < abbreviations.m) {
      number = (num / abbreviations.k).toFixed(2) + "k";
    } else if (num < abbreviations.b) {
      number = (num / abbreviations.m).toFixed(2) + "m";
    } else if (num < abbreviations.t) {
      number = (num / abbreviations.b).toFixed(2) + "b";
    } else {
      number = (num / abbreviations.t).toFixed(2) + "t";
    }

    return number;
  };

  toComma = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  toSpace = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  
}
