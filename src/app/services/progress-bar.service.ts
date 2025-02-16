import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  private progressSubject = new BehaviorSubject<{
    isVisible: boolean;
    value: number;
    message: string;
    title: string;
  }>({
    isVisible: false,
    value: 0,
    message: '',
    title: ''
  });

  progress$ = this.progressSubject.asObservable();

  show(title: string = 'Processing...') {
    this.progressSubject.next({
      isVisible: true,
      value: 0,
      message: 'Starting...',
      title
    });
    //console.log('ProgressBarService', this.progressSubject);
  }

  updateProgress(value: number, message: string) {
    const current = this.progressSubject.value;
    this.progressSubject.next({
      ...current,
      value,
      message
    });

    if (value >= 100) {
      setTimeout(() => {
        this.hide();
      }, 1000);
    }
  }

  hide() {
    this.progressSubject.next({
      isVisible: false,
      value: 0,
      message: '',
      title: ''
    });
  }
}