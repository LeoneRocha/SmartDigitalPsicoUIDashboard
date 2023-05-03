import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core'; 
import { CustomTextActivePipe } from './customtextactive.pipe';


@NgModule({
    imports: [ 
        CommonModule
    ],
    declarations: [ 
        CustomTextActivePipe 
    ]
    ,
    providers: [ 
    ],
    exports: [
        CustomTextActivePipe
      ]
    
})

export class CustomPipesModule { 
    
}
