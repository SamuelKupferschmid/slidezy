import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPickerComponent implements OnInit {
  @HostBinding('class') class = 'mat-elevation-z8';

  @Input() color: HslColor;
  @Output() colorChanged = new EventEmitter<HslColor>();

  constructor() { }

  hues = [...Array(10).keys()].map((_, index) => index * 36);
  lightness = [...Array(5).keys()].map((_, index) => (index + 1) * (1 / 6) * 100);

  getHsl(hue: number, saturationPercentage: number, lightnessPercentage: number) {
    return `hsl(${hue}, ${saturationPercentage}%, ${lightnessPercentage}%)`;
  }

  selectColor(hue: number, saturationPercentage: number, lightnessPercentage: number) {
    this.color = {
      hue,
      saturationPercentage,
      lightnessPercentage
    };

    this.colorChanged.emit(this.color);
  }

  ngOnInit(): void {
  }

}


export interface HslColor {
  hue: number;
  saturationPercentage: number;
  lightnessPercentage: number;

}