import { Component, forwardRef, Input, NgModule, ChangeDetectionStrategy } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'tag-input',
    template: `
    <div class="sdp-tag-input" [class.disabled]="disabled">
      @for (item of items; track item; let i = $index) {
        <span class="tag">
          {{ displayItem(item) }}
          <button type="button" (click)="remove(i)" [disabled]="disabled">&times;</button>
        </span>
      }
      <input
        type="text"
        [placeholder]="placeholder"
        [disabled]="disabled"
        (keydown.enter)="add($event)"
        (blur)="onTouched()" />
      </div>
    `,
    styles: [`
    .sdp-tag-input {
      display: flex; flex-wrap: wrap; gap: 4px; align-items: center;
      border: 1px solid #ccc; border-radius: 4px; padding: 4px 6px; min-height: 34px;
    }
    .sdp-tag-input.disabled { opacity: 0.6; }
    .sdp-tag-input .tag {
      background: #1dc7ea; color: #fff; border-radius: 3px; padding: 2px 6px;
      display: inline-flex; gap: 4px; align-items: center;
    }
    .sdp-tag-input .tag button {
      border: 0; background: transparent; color: inherit; cursor: pointer; line-height: 1;
    }
    .sdp-tag-input input {
      border: 0; outline: 0; flex: 1; min-width: 80px;
    }
  `],
    providers: [{
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TagInputComponent),
            multi: true
        }],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TagInputComponent implements ControlValueAccessor {
  @Input() placeholder = 'Add tag';
  disabled = false;
  items: any[] = [];
  private onChange: (v: any[]) => void = () => undefined;
  onTouched: () => void = () => undefined;

  writeValue(value: any[]): void { this.items = Array.isArray(value) ? [...value] : []; }
  registerOnChange(fn: (v: any[]) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabled = isDisabled; }

  displayItem(item: any): string {
    if (item == null) { return ''; }
    if (typeof item === 'string') { return item; }
    return item.display ?? item.value ?? String(item);
  }

  add(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = (input.value || '').trim();
    if (!value || this.disabled) { return; }
    this.items = [...this.items, value];
    input.value = '';
    this.onChange(this.items);
  }

  remove(index: number): void {
    if (this.disabled) { return; }
    this.items = this.items.filter((_, i) => i !== index);
    this.onChange(this.items);
  }
}

@NgModule({
  declarations: [TagInputComponent],
  imports: [CommonModule, FormsModule],
  exports: [TagInputComponent]
})
export class TagInputModule {}
