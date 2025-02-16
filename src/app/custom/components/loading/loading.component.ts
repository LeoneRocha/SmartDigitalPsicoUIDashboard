import { Component, Inject, Input, OnInit } from '@angular/core';
import { LanguageService } from 'app/services/general/language.service';
import { LoadingService } from 'app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input() message: string = '';
  @Input() fullScreen: boolean = false;
  @Input() showSpinner: boolean = true;
 
  loading: boolean = false;

  constructor(@Inject(LanguageService) private languageService: LanguageService,
    private loadingService: LoadingService) { }

  ngOnInit() { 

    console.log('LoadingComponent.ngOnInit',this.message );


    if(this.message == null || this.message == undefined || this.message == '') { 
      const loadingText = this.languageService.getTranslateInformationAsync('general.loading.message');
      this.message = loadingText;
    }
    
    this.loadingService.loading$.subscribe(
      (loading: boolean) => { 
        this.loading = loading;
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