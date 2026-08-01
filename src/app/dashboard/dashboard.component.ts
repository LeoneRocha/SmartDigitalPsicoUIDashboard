import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'dashboard-cmp',
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class DashboardComponent {
}
