import { Component, EventEmitter, forwardRef, Input, NgModule, Output, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Ivy-compatible replacement for abandoned jw-bootstrap-switch-ng2.
 * Keeps selector `bSwitch` and common inputs used across the app.
 */
@Component({
    selector: 'bSwitch',
    template: `
    <label class="sdp-bswitch" [class.is-on]="value" [class.is-disabled]="disabled" (click)="toggle($event)">
      <input type="checkbox" [checked]="value" [disabled]="disabled" (change)="onInputChange($event)" />
      <span class="sdp-bswitch-slider" [attr.data-on-color]="switchOnColor"></span>
      @if (switchOnText || switchOffText) {
        <span class="sdp-bswitch-text">
          {{ value ? switchOnText : switchOffText }}
        </span>
      }
    </label>
    `,
    styles: [`
    .sdp-bswitch {
      position: relative;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      gap: 6px;
    }
    .sdp-bswitch.is-disabled { opacity: 0.6; cursor: not-allowed; }
    .sdp-bswitch input { position: absolute; opacity: 0; width: 0; height: 0; }
    .sdp-bswitch-slider {
      width: 40px;
      height: 20px;
      border-radius: 20px;
      background: #ddd;
      position: relative;
      transition: background 0.2s;
    }
    .sdp-bswitch-slider::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff;
      top: 2px;
      left: 2px;
      transition: transform 0.2s;
      box-shadow: 0 1px 2px rgba(0,0,0,.2);
    }
    .sdp-bswitch.is-on .sdp-bswitch-slider { background: #1dc7ea; }
    .sdp-bswitch.is-on .sdp-bswitch-slider[data-on-color="primary"] { background: #3472f7; }
    .sdp-bswitch.is-on .sdp-bswitch-slider[data-on-color="success"] { background: #87cb16; }
    .sdp-bswitch.is-on .sdp-bswitch-slider[data-on-color="info"] { background: #1dc7ea; }
    .sdp-bswitch.is-on .sdp-bswitch-slider[data-on-color="warning"] { background: #ff9500; }
    .sdp-bswitch.is-on .sdp-bswitch-slider[data-on-color="danger"] { background: #ff4a55; }
    .sdp-bswitch.is-on .sdp-bswitch-slider::after { transform: translateX(20px); }
  `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => BSwitchComponent),
            multi: true
        }
    ],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BSwitchComponent implements ControlValueAccessor {
  @Input('switch-on-color') switchOnColor = 'primary';
  @Input('switch-off-color') switchOffColor = 'default';
  @Input('switch-on-text') switchOnText = '';
  @Input('switch-off-text') switchOffText = '';
  @Input() disabled = false;
  @Output() changeState = new EventEmitter<{ checked: boolean }>();

  value = false;
  private onChange: (v: boolean) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  writeValue(value: boolean): void {
    this.value = !!value;
  }

  registerOnChange(fn: (v: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(event: Event): void {
    if (this.disabled) {
      return;
    }
    event.preventDefault();
    this.setValue(!this.value);
  }

  onInputChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.setValue(checked);
  }

  private setValue(next: boolean): void {
    this.value = next;
    this.onChange(next);
    this.onTouched();
    this.changeState.emit({ checked: next });
  }
}

@NgModule({
  declarations: [BSwitchComponent],
  imports: [CommonModule, FormsModule],
  exports: [BSwitchComponent]
})
export class JwBootstrapSwitchNg2Module {}
