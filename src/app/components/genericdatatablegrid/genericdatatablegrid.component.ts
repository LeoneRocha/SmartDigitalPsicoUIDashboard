import { Component, Inject, Input, OnInit } from '@angular/core';
import { DataTable } from 'app/models/general/DataTable';
import { SimpleModel } from 'app/models/contracts/SimpleModel';
import { Router } from '@angular/router';
import swal from 'sweetalert2';
import { GenderService } from 'app/services/general/simple/gender.service';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { GenderModel } from 'app/models/simplemodel/GenderModel';
import { LanguageService } from 'app/services/general/language.service';

declare var $: any;
@Component({
  selector: 'custom-genericdatatablegrid',
  templateUrl: './genericdatatablegrid.component.html'
})

export class GenericDataTableGrid implements OnInit {
  @Input() dataTableIn: DataTable;
  @Input() listDataIn: SimpleModel[];
  @Input() numberOfColumns: number
  @Input() language: string
  @Input() labels: string[]

  public listResult: any[];

  constructor(@Inject(Router) private router: Router
    , @Inject(GenderService) private registerServiceGender: GenderService
    , @Inject(LanguageService) private languageService: LanguageService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loadConfigDataTablesLazzy(this.dataTableIn);
    }, 1000);
  }

  gettranslateInformationAsync(key: string): string {
    let result = this.languageService.translateInformationAsync([key])[0];
    return result;
  }

  viewRegister(register: any): void {
    let idRegister: number = register['id'];
    this.router.navigate([this.dataTableIn?.routes?.baseRoute, { modeForm: 'view', id: idRegister }]);
  }
  editRegister(register: SimpleModel): void {
    let idRegister: number = register['id'];
    this.router.navigate([this.dataTableIn?.routes?.baseRoute, { modeForm: 'edit', id: idRegister }]);
  }
  removeRegister(register: SimpleModel): void {
    let idRegister: number = register['id'];    
    this.modalAlertRemove(idRegister);    
  }

  modalAlertRemove(idRegister: number) {
    swal.fire({
      title: this.gettranslateInformationAsync('modalalert.remove.title'),//'Are you sure?',
      text: this.gettranslateInformationAsync('modalalert.remove.text'), //'You will not be able to recover register!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: this.gettranslateInformationAsync('modalalert.remove.confirmButtonText'),//'Yes, delete it!',
      cancelButtonText: this.gettranslateInformationAsync('modalalert.remove.cancelButtonText'),// 'No, keep it',
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

  executeDeleteRegister(idRegister: number) {
    this.registerServiceGender.delete(idRegister).subscribe({
      next: (response: any) => {
        CaptureTologFunc('executeDeleteRegister-gender', response);
        //this.listResult = this.removeItemFromList<GenderModel>(this.dataTableIn.dataRows, idRegister);
        this.listResult = this.removeItemFromList<any>(this.dataTableIn.dataRows, idRegister);
        this.modalAlertDeleted();
      },
      error: (err) => { this.modalErroAlert(this.gettranslateInformationAsync('modalalert.deleted.erro')); }
    });
  }

  removeItemFromList<T>(lista: Array<T>, idRemove: number): Array<T> {
    const registerFinded = lista.find(p => p["id"] === idRemove);
    let indexReg = lista.indexOf(registerFinded);
    lista.splice(indexReg, 1);
    return lista;
  }
  modalAlertCancelled() {
    swal.fire({
      title: this.gettranslateInformationAsync('modalalert.cancelled.title'), //'Cancelled',
      text: this.gettranslateInformationAsync('modalalert.cancelled.text'), //"Register hasn't been deleted",
      icon: 'error',
      customClass: {
        confirmButton: "btn btn-fill btn-info",
      },
      buttonsStyling: false
    });
  }
  modalAlertDeleted() {
    swal.fire({
      title: this.gettranslateInformationAsync('modalalert.deleted.title'), // 'Deleted!',
      text: this.gettranslateInformationAsync('modalalert.deleted.text'), //'Register has been deleted. I will close in 5 seconds.',
      timer: 5000,
      icon: 'success',
      customClass: {
        confirmButton: "btn btn-fill btn-success",
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
  loadConfigDataTablesLazzy(dataTableVal: any): void {   
    this.loadConfigDataTablesV1();
  }

  convertArray2dToList(array2d): SimpleModel[] {
    const list = [];
    for (let i = 0; i < array2d.length; i++) {
      const obj: SimpleModel = {
        id: array2d[i][0],
        description: array2d[i][1],
        enable: array2d[i][2],
        language: array2d[i][3],
      }
      list.push(obj);
    }
    return list;
  }

  loadConfigDataTablesV1(): void {
    var table = $('#datatables').DataTable({
      "pagingType": "full_numbers",
      "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
      //data: listData,
      //columns: columnsData,
      responsive: true,
      language: {
        //search: "_INPUT_",
        //searchPlaceholder: "Search records :)",
        url: './assets/i18n/datatable_' + this.language + '.json'
      }
    });

    //var table = $('#datatables').DataTable();

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
  /*

    loadConfigDataTables(listData: any, columnsData: any): void {
 
    if (typeof listData !== 'undefined' && typeof listData !== null && listData.length > 0) {
      $('#datatables').DataTable({
        "pagingType": "full_numbers",
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
       //data: listData,
        //columns: columnsData,
        responsive: true,
        language: {
          search: "_INPUT_",
          searchPlaceholder: "Search records",
        }
      });
    }
  }

  var table = $('#datatables').DataTable();

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

    public listResult: GenderModel[];
    serviceResponse: ServiceResponse<GenderModel>;
  */
}
