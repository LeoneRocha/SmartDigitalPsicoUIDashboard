// componentemodelo.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app.componentmodelo',
    templateUrl: './app.componentmodelo.html',
    styleUrls: ['./app.componentmodelo.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ComponentemodeloComponent {
  title: string = 'default title';

  setTitle(newTitle: string): void {
    this.title = newTitle;
  }
}
