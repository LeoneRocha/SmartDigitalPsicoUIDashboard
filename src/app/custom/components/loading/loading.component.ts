import { Component, Input, OnInit } from '@angular/core'; 
import { LoadingService } from 'app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input() message: string = 'Loading...';
  @Input() fullScreen: boolean = false;
  @Input() showSpinner: boolean = true;
  
  loading: boolean = false;

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe(
      (loading: boolean) => {


        this.loading = loading;
      }
    );

    console.log('LoadingComponent', this.loading);  
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