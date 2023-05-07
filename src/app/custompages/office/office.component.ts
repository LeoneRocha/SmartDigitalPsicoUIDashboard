import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { DataTable, RouteEntity } from 'app/models/general/DataTable';
import { OfficeModel } from 'app/models/simplemodel/OfficeModel';
import { OfficeService } from 'app/services/general/simple/office.service';
import { LanguageService } from 'app/services/general/language.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'officelist',
    templateUrl: 'office.component.html'
    //styleUrls: ['./office.component.css']
})

export class OfficeComponent implements OnInit {
    public listResult: OfficeModel[];
    serviceResponse: ServiceResponse<OfficeModel>;
    public dataTable: DataTable;
    entityRoute: RouteEntity;
    columlabelsDT: string[] = [
        'Id'
        , 'general.description.title'
        , 'applanguage.title'
        , 'general.enable'
        , 'general.actions'
    ];

    constructor(@Inject(OfficeService) private registerService: OfficeService
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
        this.router.navigate(['/administrative/office/officeaction']);
    }
    viewRegister(idRegister: number): void {
        this.router.navigate(['/administrative/office/officeaction', { modeForm: 'view', id: idRegister }]);
    }
    editRegister(idRegister: number): void {
        this.router.navigate(['/administrative/office/officeaction', { modeForm: 'edit', id: idRegister }]);
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
                CaptureTologFunc('retrieveList-office', response);
            },
            error: (err) => { this.showNotification('top', 'center', this.gettranslateInformationAsync('modalalert.notification.erro.connection'), 'danger'); }
        }); 
    } 
    executeDeleteRegister(idRegister: number) {
        this.registerService.delete(idRegister).subscribe({
            next: (response: any) => {
                CaptureTologFunc('executeDeleteRegister-office', response);
                this.listResult = this.removeItemFromList<OfficeModel>(this.listResult, idRegister);
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
    gettranslateInformationAsync(key: string): string {
        let result = this.languageService.translateInformationAsync([key])[0]; 
        return result;
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
            //var $tr = $(this).closest('tr');
            //var data = table.row($tr).data();
            //alert('You press on Row: ' + data[0] + ' ' + data[1] + ' ' + data[2] + '\'s row.');
        });
        // Delete a record
        table.on('click', '.remove', function (e) {
            //var $tr = $(this).closest('tr');
            //table.row($tr).remove().draw();
            //e.preventDefault();
        });
        //Like record
        table.on('click', '.like', function () {
            // alert('You clicked on Like button');
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
} 