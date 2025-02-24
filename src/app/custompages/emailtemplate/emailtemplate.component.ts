import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { DataTable, RouteEntity } from 'app/models/general/DataTable'; 
import { LanguageService } from 'app/services/general/language.service';
import { EmailTemplateService } from 'app/services/general/principals/emailTemplate.service';
import { EmailTemplateDto } from 'app/models/modelsbyswagger/models'; 

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'emailtemplate-list',
    templateUrl: 'emailtemplate.component.html' 
})

export class EmailTemplateComponent implements OnInit {
    public listResult: EmailTemplateDto[];
    serviceResponse: ServiceResponse<EmailTemplateDto>;
    public dataTable: DataTable;
    entityRoute: RouteEntity;
    columlabelsDT: string[] = [
        'Id'
        , 'general.description.title'
        , 'applanguage.title'
        , 'general.enable' 
        , 'general.actions'
    ];

    constructor(@Inject(EmailTemplateService) private registerService: EmailTemplateService
        , @Inject(Router) private router: Router
        , @Inject(LanguageService) private languageService: LanguageService) { }
    ngOnInit() {
        this.languageService.loadLanguage();
        this.loadHeaderFooterDataTable();
        this.retrieveList();
    }
    ngAfterViewInit() {
    }
    newRegister(): void {
        this.router.navigate(['/administrative/emailtemplate/emailtemplateaction']);
    }
    viewRegister(idRegister: number): void {
        this.router.navigate(['/administrative/emailtemplate/emailtemplateaction', { modeForm: 'view', id: idRegister }]);
    }
    editRegister(idRegister: number): void {
        this.router.navigate(['/administrative/emailtemplate/emailtemplateaction', { modeForm: 'edit', id: idRegister }]);
    }
    removeRegister(idRegister: number): void {
        this.modalAlertRemove(idRegister);
    }
    retrieveList(): void {
        this.registerService.getAll().subscribe({
            next: (response: any) => {
                this.listResult = response["data"];
                this.loadConfigDataTablesLazzy();
                //this.convertListToDataTableRowAndFill(response["data"]);  this.loadConfigDataTablesLazzy()
                CaptureTologFunc('retrieveList-EmailTemplate', response);
            },
            error: (err) => { this.showNotification('top', 'center', this.gettranslateInformationAsync('modalalert.notification.erro.connection'), 'danger'); }
        }); 
    }
  
    executeDeleteRegister(idRegister: number) {
        this.registerService.delete(idRegister).subscribe({
            next: (response: any) => {
                CaptureTologFunc('executeDeleteRegister-EmailTemplate', response);
                this.listResult = this.removeItemFromList<EmailTemplateDto>(this.listResult, idRegister);
                this.modalAlertDeleted();
            },
            error: (err) => { this.modalErroAlert('Error of delete.'); }
        });


    }
    removeItemFromList<T>(lista: Array<T>, idRemove: number): Array<T> {
        const registerFinded = lista.find(p => p["id"] === idRemove);
        let indexReg = lista.indexOf(registerFinded);
        lista.splice(indexReg, 1);
        return lista;
    }
    modalAlertRemove(idRegister: number) {
        swal.fire({
            title: this.gettranslateInformationAsync('modalalert.remove.title'),//'Are you sure?',
            text: this.gettranslateInformationAsync('modalalert.remove.text'),// 'You will not be able to recover register!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: this.gettranslateInformationAsync('modalalert.remove.confirmButtonText'),//'Yes, delete it!',
            cancelButtonText: this.gettranslateInformationAsync('modalalert.remove.cancelButtonText'),//'No, keep it',
            customClass: {
                confirmButton: "btn btn-fill btn-success btn-mr-5",
                cancelButton: "btn btn-fill btn-danger",
            },
            buttonsStyling: false
        }).then((result) => {
            if (result.value) {
                this.executeDeleteRegister(idRegister);
            } else {
                this.modalAlertCancelled();
            }
        });
    }
    modalAlertDeleted() {
        swal.fire({
            title: this.gettranslateInformationAsync('modalalert.deleted.title'),//'Deleted!',
            text: this.gettranslateInformationAsync('modalalert.deleted.text'),//'Register has been deleted. I will close in 5 seconds.',
            timer: 5000,
            icon: 'success',
            customClass: {
                confirmButton: "btn btn-fill btn-success",
            },
            buttonsStyling: false
        });
    }
    modalAlertCancelled() {
        swal.fire({
            title: this.gettranslateInformationAsync('modalalert.cancelled.title'),//'Cancelled',
            text: this.gettranslateInformationAsync('modalalert.cancelled.text'),//"Register hasn't been deleted",
            icon: 'error',
            customClass: {
                confirmButton: "btn btn-fill btn-info",
            },
            buttonsStyling: false
        });
    }
    modalErroAlert(msgErro: string) {
        swal.fire({
            title: this.gettranslateInformationAsync('modalalert.error.title'),//'Error!',
            text: msgErro,
            icon: 'error',
            customClass: {
                confirmButton: "btn btn-fill btn-info",
            },
            buttonsStyling: false
        });
    }
    showNotification(from, align, messageCustom: string, colorType: string) {
        //var type = ['','info','success','warning','danger']; 
        $.notify({
            icon: "pe-7s-attention",
            message: messageCustom
        }, {
            type: colorType,
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    }
    loadConfigDataTablesLazzy(): void {
        setTimeout(() => {
            this.loadConfigDataTables();
        }, 100);
    }
    loadConfigDataTables(): void {
        var table = $('#datatables').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            responsive: true,
            language: {
                url: './assets/i18n/datatable_' + this.languageService.getLanguageToLocalStorage() + '.json'
            }

        });

        // Edit record
        table.on('click', '.edit', function () { 
        });
        // Delete a record
        table.on('click', '.remove', function (e) { 
        });
        //Like record
        table.on('click', '.like', function () { 
        });
    }
    loadHeaderFooterDataTable() {
        let dtLabels = this.getDTLabels();
        this.dataTable = {
            headerRow: dtLabels,
            footerRow: dtLabels,
            dataRows: [], dataRowsSimple: [],
            routes: this.entityRoute
        };
    }
    getDTLabels(): string[] {
        return this.languageService.translateInformationAsync(this.columlabelsDT);
    }
    gettranslateInformationAsync(key: string): string {
        let result = this.languageService.translateInformationAsync([key])[0];
        return result;
    }
} 