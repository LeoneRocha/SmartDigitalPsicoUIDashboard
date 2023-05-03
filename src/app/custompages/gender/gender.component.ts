import { Component, OnDestroy, OnInit } from '@angular/core';
import { GenderService } from 'app/services/general/simple/gender.service';
import { Inject } from '@angular/core';
import { GenderModel } from 'app/models/simplemodel/GenderModel';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { DataTable, RouteEntity } from 'app/models/general/DataTable';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'app/services/general/language.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'genderlist',
    templateUrl: 'gender.component.html'
    //styleUrls: ['./gender.component.css']
})

export class GenderComponent implements OnInit, OnDestroy {
    public listResult: GenderModel[];
    serviceResponse: ServiceResponse<GenderModel>;
    public dataTable: DataTable;
    entityRoute: RouteEntity;
    private subscription: Subscription;
    columlabel_1: string;
    columlabelsDT: string[] = [
        'Id'
        , 'general.description'
        , 'applanguage.title'
        , 'general.enable'
        , 'general.actions'
    ];
    public labelsDT: string[];

    constructor(@Inject(GenderService) private registerService: GenderService, @Inject(Router) private router: Router
        , @Inject(TranslateService) private translate: TranslateService
        , @Inject(LanguageService) private languageService: LanguageService) {

    }
    ngOnInit() {
        this.languageService.loadLanguage();

        // this.columlabel_1 =  this.languageService.translateInformation('general.description');         
        this.loadHeaderFooterDataTable();
        this.retrieveList();

        //vou ter que injetar o servico em cada componente e pegar do usuario ou storage qual o idioma que o usuario selecionou
    }

    getDTLabels(): string[] {
        return this.languageService.translateInformationAsync(this.columlabelsDT);
    }
    getLanguage(): string {
        return this.languageService.getLanguageToLocalStorage();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    ngAfterViewInit() {
    }
    newRegister(): void {
        this.router.navigate([this.entityRoute.baseRoute]);
    }
    viewRegister(idRegister: number): void {
        this.router.navigate([this.entityRoute.baseRoute, { modeForm: 'view', id: idRegister }]);
    }
    editRegister(idRegister: number): void {
        this.router.navigate([this.entityRoute.baseRoute, { modeForm: 'edit', id: idRegister }]);
    }
    removeRegister(idRegister: number): void {
        this.modalAlertRemove(idRegister);
    }
    retrieveList(): void {

        this.subscription = this.registerService.getAll().subscribe({
            next: (response: any) => {
                this.listResult = response["data"];
                this.dataTable.dataRows = response["data"];
                this.dataTable.dataRowsSimple = response["data"];                
                //this.loadConfigDataTablesLazzy();
                //this.convertListToDataTableRowAndFill(response["data"]);  this.loadConfigDataTablesLazzy()
                CaptureTologFunc('retrieveList-gender', response);
            },
            error: (err) => { this.showNotification('top', 'center', this.gettranslateInformationAsync('modalalert.notification.erro.connection'), 'danger'); }
        }); 
    } 
    executeDeleteRegister(idRegister: number) {
        this.registerService.delete(idRegister).subscribe({
            next: (response: any) => {
                CaptureTologFunc('executeDeleteRegister-gender', response);
                this.listResult = this.removeItemFromList<GenderModel>(this.listResult, idRegister);
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
            title: this.gettranslateInformationAsync('modalalert.remove.title'),//'merda? ',// this.gettranslateInformationAsync('modalalert.remove.title'), //'Are you sure?',
            text: this.gettranslateInformationAsync('modalalert.remove.text'),//'You will not be able to recover register!',
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
            text: this.gettranslateInformationAsync('modalalert.deleted.text'),// 'Register has been deleted. I will close in 5 seconds.',
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
            title: this.gettranslateInformationAsync('modalalert.error.title'),//' 'Error!',
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
        //var table = $('#datatables').DataTable();
        /*var table = $('#datatables').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
            responsive: true,
            language: {
               // url: '../assets/i18n/datatable_pt_br.json'
                search: "_INPUT_",
                searchPlaceholder: "PROCURAR records:(",
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
        });*/
    }
    loadHeaderFooterDataTable() {
        this.entityRoute = {
            baseRoute: "/administrative/gender/genderaction"
        };

        this.dataTable = {

            headerRow: ['Id', 'labels[0]', 'Language', 'Enable', 'Actions'],
            footerRow: ['Id', 'abels[0]', 'Language', 'Enable', 'Actions'],
            dataRows: [], dataRowsSimple: [],
            routes: this.entityRoute
        };
    }
    gettranslateInformationAsync(key: string): string {
        let result = this.languageService.translateInformationAsync([key])[0];
        return result;
    }

} 
