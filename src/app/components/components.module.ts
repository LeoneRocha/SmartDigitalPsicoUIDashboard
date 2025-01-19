import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonsComponent } from './buttons/buttons.component';
import { ComponentsRoutes } from './components.routing';
import { GridSystemComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PanelsComponent } from './panels/panels.component';
import { SweetAlertComponent } from './sweetalert/sweetalert.component';
import { TypographyComponent } from './typography/typography.component';
import { CalendarEventModalComponent } from './calendar-event-modal/calendar-event-modal.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(ComponentsRoutes),
        FormsModule,
        ReactiveFormsModule // Adicione isto
    ],
    declarations: [
        ButtonsComponent,
        GridSystemComponent,
        IconsComponent,
        NotificationsComponent,
        PanelsComponent,
        SweetAlertComponent,
        TypographyComponent,  
    ], 
    exports: [ 
      ]
})

export class ComponentsModule {}
