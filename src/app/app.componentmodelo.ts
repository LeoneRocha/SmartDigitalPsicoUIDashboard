// componentemodelo.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app.componentmodelo',
  templateUrl: './app.componentmodelo.html',
  styleUrls: ['./app.componentmodelo.css']
})
export class ComponentemodeloComponent {
  title: string = 'default title';

  setTitle(newTitle: string): void {
    this.title = newTitle;
  }
}
