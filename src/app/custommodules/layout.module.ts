import { NgModule } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { FooterModule } from 'app/shared/footer/footer.module';
import { NavbarModule } from 'app/shared/navbar/navbar.module';
import { PagesnavbarModule } from 'app/shared/pagesnavbar/pagesnavbar.module';
import { SidebarModule } from 'app/sidebar/sidebar.module';
import { NgxTranslateModule } from 'app/translate/translate.module';
  
@NgModule({ 
  exports: [ 
    FormsModule,
    SidebarModule,
    NavbarModule,
    FooterModule,    
    PagesnavbarModule, 
    NgxTranslateModule
  ]
})
export class LayoutModule { }
