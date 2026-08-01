import { Component, Inject, OnInit } from '@angular/core'; 
import { AppInformationVersionProductModel } from 'app/models/simplemodel/AppInformationVersionProductModel';
import { AppInformationVersionProductService } from 'app/services/general/simple/appinformationversionproduct.service';

@Component({
    selector: 'footer-cmp',
    templateUrl: 'footer.component.html',
    standalone: false
})

export class FooterComponent {

    public apiInfo: AppInformationVersionProductModel;

    test: Date = new Date();
    constructor(@Inject(AppInformationVersionProductService) private appInformationVersionProductService: AppInformationVersionProductService) {

    }
    ngOnInit() {
        this.loadAppInfo();
    }
    loadAppInfo() {
        this.appInformationVersionProductService.getAll().subscribe({
            next: (response: AppInformationVersionProductModel[]) => { this.apiInfo = response[0]; }, error: (err) => { console.log(err); },
        });
    }
}
