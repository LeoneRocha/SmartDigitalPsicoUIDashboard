import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  @Input() message: string = 'Loading...';
  @Input() fullScreen: boolean = false;
  @Input() showSpinner: boolean = true;
}


/*<!-- Full screen loading -->
<app-loading [fullScreen]="true" [showSpinner]="isLoading" message="Processing data..."></app-loading>

<!-- Component scope loading -->
<div style="position: relative;">
  <app-loading [fullScreen]="false" [showSpinner]="isLoading" message="Loading component..."></app-loading>
  <!-- Your component content here -->
</div>
*/