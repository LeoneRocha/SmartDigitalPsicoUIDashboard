import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { GetMsgServiceResponse } from 'app/common/helpers/GetMsgServiceResponse';
import { botaoAnimado } from 'app/common/animations/geral-trigger-animation';
import { GenderModel } from 'app/models/simplemodel/GenderModel';
import { ETypeMaritalStatusOptions } from 'app/common/enuns/etypemaritalstatus-options';
import { DatePipe } from '@angular/common';
import { LanguageService } from 'app/services/general/language.service'; 
import { PatientRecordModel } from 'app/models/principalsmodel/PatientRecordModel';
import { PatientRecordService } from 'app/services/general/principals/patientrecord.service';
declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'add-edit-patient_record',
    templateUrl: 'add-edit-patient_record.component.html',
    //styleUrls: ['./gender.component.css']
    animations: [
        botaoAnimado
    ]
})
//5-  a lista
export class AddEditPatientRecordComponent implements OnInit {
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: PatientRecordModel;
    serviceResponse: ServiceResponse<PatientRecordModel>;
    estadoBotao_goBackToList = 'inicial';
    estadoBotao_addRegister = 'inicial';
    estadoBotao_updateRegister = 'inicial';
    public gendersOpts: GenderModel[];
    public maritalStatusOpts = ETypeMaritalStatusOptions;
    parentId: number;
    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        , private fb: FormBuilder
        , @Inject(Router) private router: Router
        , @Inject(PatientRecordService) private registerService: PatientRecordService
        , private datePipe: DatePipe
        , @Inject(LanguageService) private languageService: LanguageService
    ) {
    } 
    ngOnInit() {
        this.languageService.loadLanguage();

        this.getPatientId();
        this.gerateFormRegister();
        this.loadFormRegister();
        if (this.registerId)
            this.loadRegister();

        if (this.registerModel?.id)
            this.createEmptyRegister();
    }
    ngAfterContentInit() {
        this.loadBoostrap();
        this.loadDatePicker();
    }
    private getPatientId(): number {
        let paramsUrl = this.route.snapshot.paramMap;
        this.parentId = Number(paramsUrl.get('parentId'));
        return this.parentId;
    }
    //https://netbasal.com/implementing-grouping-checkbox-behavior-with-angular-reactive-forms-9ba4e3ab3965
    animarBotao(estado: string, stateBtn: string) {
        if (stateBtn === 'goBackToList')
            this.estadoBotao_goBackToList = estado;

        if (stateBtn === 'addRegister')
            this.estadoBotao_addRegister = estado;

        if (stateBtn === 'updateRegister')
            this.estadoBotao_updateRegister = estado;
    }
    loadBoostrap() {
        //  Activate the tooltips
        $('[rel="tooltip"]').tooltip();

        //  Init Bootstrap Select Picker
        if ($(".selectpicker").length != 0) {
            $(".selectpicker").selectpicker({
                iconBase: "fa",
                tickIcon: "fa-check"
            });
        }
    }  

    loadFormRegister() {
        let formsElement = this.registerForm;
        let paramsUrl = this.route.snapshot.paramMap;
        this.isModeViewForm = paramsUrl.get('modeForm') === 'view';
        if (this.isModeViewForm) { 
            formsElement.controls['description'].disable();
            formsElement.controls['annotation'].disable();
            formsElement.controls['annotationDate'].disable(); 
            formsElement.controls['enableOpt'].disable();
        }
        this.registerId = Number(paramsUrl.get('id'));
    }
    ngAfterViewInit() {
    }
    loadRegister() {
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<PatientRecordModel>) => { this.processLoadRegister(response); }, error: (err) => { this.processLoadRegisterErro(err); },
        });
    }
    addRegister() {        
        this.getValuesForm(); 
        this.registerService.add(this.registerModel).subscribe({
            next: (response: ServiceResponse<PatientRecordModel>) => { this.processAddRegister(response); }, error: (err) => { this.processAddRegisterErro(err); },
        });
    }
    updateRegister() {        
        this.getValuesForm(); 
        this.registerService.update(this.registerModel).subscribe({
            next: (response: ServiceResponse<PatientRecordModel>) => { this.processUpdateRegister(response); }, error: (err) => { this.processUpdateRegisterErro(err); },
        });
    }
    processAddRegister(response: ServiceResponse<PatientRecordModel>) {
        CaptureTologFunc('processAddRegister-Patient', response);
        this.serviceResponse = response;
        if (response?.errors?.length == 0) {
            this.modalSuccessAlert();
            this.goBackToList();
        } else {
            this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
        }
    }
    processAddRegisterErro(response: ServiceResponse<PatientRecordModel>) {
        CaptureTologFunc('processAddRegisterErro-Patient', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
    }

    processUpdateRegister(response: ServiceResponse<PatientRecordModel>) {
        CaptureTologFunc('processUpdateRegister-Patient', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<PatientRecordModel>) {
        CaptureTologFunc('processUpdateRegisterErro-Patient', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<PatientRecordModel>) {
        CaptureTologFunc('processLoadRegister-Patient', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
        this.isUpdateRegister = true && !this.isModeViewForm;
    }
    processLoadRegisterErro(response: ServiceResponse<PatientRecordModel>) {
        CaptureTologFunc('processLoadRegisterErro-Patient', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.load.title'), response);
    }
    fillFieldsForm(): void {
        let formatDate = 'dd/MM/yyyy';  
        let pipeDate = new DatePipe('pt-BR');

        let responseData: PatientRecordModel = this.serviceResponse?.data;
        let formsElement = this.registerForm;
        this.registerModel = {
            id: responseData?.id,  
            patientId: responseData?.patientId,
            description: responseData?.description, 
            annotation    : responseData?.annotation,
            annotationDate : responseData?.annotationDate,            
            enable: responseData?.enable,
        };
        let modelEntity = this.registerModel;

        let text_Date  = this.datePipe.transform(modelEntity?.annotationDate, 'yyyy-MM-dd'); 

        //formsElement.controls['patientId'].setValue(modelEntity?.patientId); 
        formsElement.controls['description'].setValue(modelEntity?.description);        
        formsElement.controls['annotation'].setValue(modelEntity?.annotation);        
        formsElement.controls['annotationDate'].setValue(text_Date);        
        formsElement.controls['enableOpt'].setValue(modelEntity?.enable); 
    }
    isValidFormAnnotation(): boolean {
        let isRequired = this.registerForm.get('annotation').errors?.required;
        return this.registerForm.controls['annotation'].touched && this.registerForm.controls['annotation'].invalid && isRequired;
    }
    isValidFormAnnotationDate(): boolean {
        let isRequired = this.registerForm.get('annotationDate').errors?.required;
        return this.registerForm.controls['annotationDate'].touched && this.registerForm.controls['annotationDate'].invalid && isRequired;
    } 
    isValidFormDescription(): boolean {
        let isRequired = this.registerForm.get('description').errors?.required;
        return this.registerForm.controls['description'].touched && this.registerForm.controls['description'].invalid && isRequired;
    } 
    gerateFormRegister() {
        this.registerForm = this.fb.group({
            id: new FormControl<number>(0),            
            description: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),            
            annotation: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
            annotationDate: new FormControl<Date>(new Date(), [Validators.required]),                        
            patientId: new FormControl<number>(0),
            enableOpt: new FormControl<boolean>(false, Validators.required),
        });
    } 

    getValuesForm() {
        let formElement = this.registerForm;
        this.registerModel = {
            patientId: this.parentId ? this.parentId : 0,
            id: this.registerId ? this.registerId : 0,            
            description: formElement.controls['description']?.value,
            annotation: formElement.controls['annotation']?.value,
            annotationDate: formElement.controls['annotationDate']?.value,     
            enable: formElement.controls['enableOpt']?.value,
        };
    }
    createEmptyRegister(): void {
        this.registerModel = {
            id: 0, 
            description: '',
            annotation : '', 
            annotationDate: new Date(),  
            patientId: 0,
            enable: false
        }
    }
    onSelect(selectedValue: string) { 
    }
    goBackToList() {
        this.router.navigate(['/patient/manage/record', { parentId: this.parentId }]);
    }
    gettranslateInformationAsync(key: string): string {
        let result = this.languageService.translateInformationAsync([key])[0]; 
        return result;
    }
    modalSuccessAlert() {
        swal.fire({
            title: this.gettranslateInformationAsync('modalalert.saved.title'),//"Register is saved!",
            text: this.gettranslateInformationAsync('modalalert.saved.text'),//"I will close in 5 seconds.",
            timer: 5000,
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-fill btn-success",
            },
            icon: "success"
        });
    }
    modalErroAlert(msgErro: string, response: ServiceResponse<PatientRecordModel>) {
        swal.fire({
            title: msgErro,
            text: GetMsgServiceResponse(response),
            icon: 'error',
            customClass: {
                confirmButton: "btn btn-fill btn-info",
            },
            buttonsStyling: false
        });
    }

    loadDatePicker(): void {
        $('.datepicker').datetimepicker({
            format: 'DD/MM/YYYY',    //use this format if you want the 12hours timpiecker with AM/PM toggle
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-chevron-up",
                down: "fa fa-chevron-down",
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove'
            }
        });
    }
    onCheckboxChange(e) {
        const checkArray: FormArray = this.registerForm.get('specialtiesIds') as FormArray;
        if (e.target.checked) {
            checkArray.push(new FormControl(e.target.value));
        } else {
            let i: number = 0;
            checkArray.controls.forEach((item: FormControl) => {
                if (item.value == e.target.value) {
                    checkArray.removeAt(i);
                    return;
                }
                i++;
            });
        } //https://www.positronx.io/angular-checkbox-tutorial/          
    }
}