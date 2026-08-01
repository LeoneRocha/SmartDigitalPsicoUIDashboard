import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'user-cmp',
    templateUrl: 'user.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})

export class UserComponent{ }
