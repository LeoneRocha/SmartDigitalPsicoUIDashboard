import { Component, Inject, Input, OnInit } from '@angular/core';
import { LanguageService } from 'app/services/general/language.service';
import { LoadingService } from 'app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  private _message: string = '';
  private _fullScreen: boolean = false;
  private _showSpinner: boolean = true;
  isLoading: boolean = false;

  @Input() 
  set message(value: string) {
    this._message = value;
  }
  get message(): string {
    return this._message;
  }

  @Input() 
  set fullScreen(value: boolean) {
    this._fullScreen = value;
  }
  get fullScreen(): boolean {
    return this._fullScreen;
  }

  @Input() 
  set showSpinner(value: boolean) {
    this._showSpinner = value;
  }
  get showSpinner(): boolean {
    return this._showSpinner;
  }

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.loading$.subscribe(
      (state) => {
        console.log('Loading state:', state);
        this.isLoading = state.isLoading;
        this._showSpinner = state.showSpinner ?? this._showSpinner;
        this._message = state.message ?? this._message;
        this._fullScreen = state.fullScreen ?? this._fullScreen;
      }
    );
  }
}


/*<!-- Full screen loading -->
<app-loading [fullScreen]="true" [showSpinner]="isLoading" message="Processing data..."></app-loading>

<!-- Component scope loading -->
<div style="position: relative;">
  <app-loading [fullScreen]="false" [showSpinner]="isLoading" message="Loading component..."></app-loading>
  <!-- Your component content here -->
</div>
*/