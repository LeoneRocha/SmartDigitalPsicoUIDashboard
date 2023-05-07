import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { DataTable, RouteEntity } from 'app/models/general/DataTable';
import { Store, select } from '@ngrx/store';
import { Appstate } from 'app/storereduxngrx/shared/appstate';
import { selectSpecialty } from 'app/storereduxngrx/selectors/specialty.selector';
import { selectAppState } from 'app/storereduxngrx/shared/app.selector';
import { invokeDeleteSpecialtyAPI, invokeSpecialtysAPI } from 'app/storereduxngrx/actions/specialty.action';
import { LanguageService } from 'app/services/general/language.service';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'specialty-list',
    templateUrl: 'specialty.component.html'
    //styleUrls: ['./Specialty.component.css']
})

export class SpecialtyComponent implements OnInit {
    public dataTable: DataTable;
    entityRoute: RouteEntity;
    columlabelsDT: string[] = [
        'Id'
        , 'general.description.title'
        , 'applanguage.title'
        , 'general.enable'
        , 'general.actions'
    ];

    entityEff$ = this.store.pipe(select(selectSpecialty));

    constructor(
        private store: Store, private appStore: Store<Appstate>
        , @Inject(Router) private router: Router
        , @Inject(LanguageService) private languageService: LanguageService
    ) {

    }
    ngOnInit() {
        this.languageService.loadLanguage();
        this.loadHeaderFooterDataTable();
        this.retrieveList();
    }
    ngAfterViewInit() {
    }
    newRegister(): void {
        this.router.navigate(['/administrative/specialty/specialtyaction']);
    }
    viewRegister(idRegister: number): void {
        //MUDAR PARAMETRO ID PARA SE GERENCIADO PELO REDUX 
        this.router.navigate(['/administrative/specialty/specialtyaction', { modeForm: 'view', id: idRegister }]);
    }
    editRegister(idRegister: number): void {
        this.router.navigate(['/administrative/specialty/specialtyaction', { modeForm: 'edit', id: idRegister }]);
    }
    removeRegister(idRegister: number): void {
        this.modalAlertRemove(idRegister);
    }
    retrieveList(): void {
        this.store.dispatch(invokeSpecialtysAPI());
        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe({
            next: (apState) => {
                if (apState.apiStatus === 'success' && apState.apiResponseMessage === 'invokeSpecialtysAPI') {
                    this.loadConfigDataTablesLazzy();
                }
                if (apState.apiStatus === 'error' && apState.apiResponseMessage === 'invokeSpecialtysAPI') {
                    this.showNotification('top', 'center', this.gettranslateInformationAsync('modalalert.notification.erro.connection'), 'danger');
                }
            },
            //error: (err) => { this.showNotification('top', 'center', 'Erro ao conectar!', 'danger'); }
        });
        /*this.registerService.getAll().subscribe({
            next: (response: any) => {
                this.listResult = response["data"];
                //console.log(this.listResult);
                this.loadConfigDataTablesLazzy();
                //this.convertListToDataTableRowAndFill(response["data"]);  this.loadConfigDataTablesLazzy()
                CaptureTologFunc('retrieveList-specialty', response);
            },
            error: (err) => { this.showNotification('top', 'center', 'Erro ao conectar!', 'danger'); }
        });*/
        // alert('You clicked on Like button');
    }
    /* convertListToDataTableRowAndFill(inputArray: any) {
         //const outputArray = inputArray.map(obj => Object.values(obj)); 
         let resultData = inputArray.map((item) => {
             return [item.id, item.description, item.language, item.enable];
         });
         this.dataTable.dataRows = resultData;       //console.log(resultData);     } */
    executeDeleteRegister(idRegister: number) {
        this.store.dispatch(invokeDeleteSpecialtyAPI({ id: idRegister, }));
        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe({
            next: (apState) => {
                if (apState.apiStatus === 'success') {
                    this.modalAlertDeleted();
                }
                if (apState.apiStatus === 'error') {
                    this.modalErroAlert('Error of delete.');
                }
            },
            //error: (err) => { this.modalErroAlert('Error of delete.'); }
        });
        /* this.registerService.delete(idRegister).subscribe({
             next: (response: any) => {
                 CaptureTologFunc('executeDeleteRegister-specialty', response);
                 this.listResult = this.removeItemFromList<SpecialtyModel>(this.listResult, idRegister);
                 this.modalAlertDeleted();
             },
             error: (err) => { this.modalErroAlert('Error of delete.'); }
         }); */
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
            //destroy: true,
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