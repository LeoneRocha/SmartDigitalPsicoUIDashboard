import { Component, Input, OnInit } from "@angular/core";
import { ProgressBarService } from "app/services/progress-bar.service";

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {
  progress$ = this.progressService.progress$;
  isVisible: boolean = false;
  title: string = '';
  progressValue: number = 0;
  progressMessage: string = '';

  constructor(private progressService: ProgressBarService) { }

  ngOnInit(): void {
    this.progress$.subscribe(progress => {
      this.isVisible = progress.isVisible;
      this.title = progress.title;
      this.progressValue = progress.value;
      this.progressMessage = progress.message; 
    });
  }
}