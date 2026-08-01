import { Component, forwardRef, Input, NgModule } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'nouislider',
    template: `
    @if (!isRange) {
      <input
        type="range"
        class="sdp-nouislider"
        [min]="min"
        [max]="max"
        [step]="step"
        [disabled]="disabled"
        [value]="singleValue"
        (input)="onSingleInput($event)"
        />
    }
    @if (isRange) {
      <div class="sdp-nouislider-range">
        <input type="range" [min]="min" [max]="max" [step]="step" [disabled]="disabled" [value]="rangeValues[0]" (input)="onRangeInput(0, $event)" />
        <input type="range" [min]="min" [max]="max" [step]="step" [disabled]="disabled" [value]="rangeValues[1]" (input)="onRangeInput(1, $event)" />
        <small>{{ rangeValues[0] }} - {{ rangeValues[1] }}</small>
      </div>
    }
    `,
    styles: [`
    .sdp-nouislider, .sdp-nouislider-range input { width: 100%; }
    .sdp-nouislider-range { display: grid; gap: 6px; }
  `],
    providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NouisliderComponent),
            multi: true
        }],
    standalone: false
})
export class NouisliderComponent implements ControlValueAccessor {
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() connect: boolean | boolean[] = false;
  @Input() tooltips = false;
  disabled = false;

  singleValue = 0;
  rangeValues: number[] = [0, 100];
  private onChange: (v: number | number[]) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  get isRange(): boolean {
    return Array.isArray(this.connect) ? this.connect.some(Boolean) : !!this.connect;
  }

  writeValue(value: number | number[]): void {
    if (Array.isArray(value)) {
      this.rangeValues = [value[0] ?? this.min, value[1] ?? this.max];
    } else {
      this.singleValue = value ?? this.min;
    }
  }

  registerOnChange(fn: (v: number | number[]) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  onSingleInput(event: Event): void {
    this.singleValue = Number((event.target as HTMLInputElement).value);
    this.onChange(this.singleValue);
    this.onTouched();
  }

  onRangeInput(index: number, event: Event): void {
    const next = [...this.rangeValues];
    next[index] = Number((event.target as HTMLInputElement).value);
    if (next[0] > next[1]) {
      if (index === 0) { next[1] = next[0]; } else { next[0] = next[1]; }
    }
    this.rangeValues = next;
    this.onChange(this.rangeValues);
    this.onTouched();
  }
}

@NgModule({
  declarations: [NouisliderComponent],
  imports: [CommonModule, FormsModule],
  exports: [NouisliderComponent]
})
export class NouisliderModule {}
