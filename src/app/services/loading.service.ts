import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<{
    isLoading: boolean;
    message?: string;
    fullScreen?: boolean;
    showSpinner?: boolean;
  }>({ isLoading: false });

  loading$ = this.loadingSubject.asObservable();

  show(message?: string, fullScreen: boolean = false, showSpinner: boolean = true) {
    this.loadingSubject.next({
      isLoading: true,
      message,
      fullScreen,
      showSpinner
    });
  }

  hide() {
    this.loadingSubject.next({
      isLoading: false
    });
  }
}
/*// Basic usage
this.loadingService.show();

// With custom message
this.loadingService.show('Processing data...');

// Full configuration
this.loadingService.show('Loading content...', true, true);

// Hide loading
this.loadingService.hide();
*/