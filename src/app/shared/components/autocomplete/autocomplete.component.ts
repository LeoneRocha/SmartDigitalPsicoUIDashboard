import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteComponent),
      multi: true
    }
  ]
})
export class AutocompleteComponent implements ControlValueAccessor {
  @Input() items: any[] = [];
  @Input() placeholder: string = '';
  @Output() search = new EventEmitter<string>();

  searchText: string = '';
  filteredItems: any[] = [];
  showSuggestions: boolean = false;
  selectedValue: any = null;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  onSearch(term: string) {
    console.log('Search term:', term);  
    if (term.length >= 3) {
      this.search.emit(term);
      this.showSuggestions = true;
    } else {
      this.filteredItems = [];
      this.showSuggestions = false;
    }
  }

  selectItem(item: any) {
    console.log('Selected item:', item);  
    this.selectedValue = item.id;
    this.searchText = item.text;
    this.showSuggestions = false;
    this.onChange(item.id);
    this.onTouched();
  }

  onFocus() {
    if (this.searchText.length >= 3) {
      this.showSuggestions = true;
    }
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    const selectedItem = this.items.find(item => item.id === value);
    this.searchText = selectedItem ? selectedItem.text : '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
