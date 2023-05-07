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
import { MedicalFileModel } from 'app/models/principalsmodel/MedicalFileModel';
import { MedicalFileService } from 'app/services/general/principals/medicalfile.service';


declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'add-edit-fileupload-c',
    templateUrl: 'add-edit-fileupload-medical.component.html',
    //styleUrls: ['./gender.component.css']
    animations: [
        botaoAnimado
    ]
})
//5-  a lista
export class AddEditFileUploadMedicalComponent implements OnInit {
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: MedicalFileModel;
    serviceResponse: ServiceResponse<MedicalFileModel>;
    estadoBotao_goBackToList = 'inicial';
    estadoBotao_addRegister = 'inicial';
    estadoBotao_updateRegister = 'inicial';
    public gendersOpts: GenderModel[];
    public maritalStatusOpts = ETypeMaritalStatusOptions;
    parentId: number;
    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        , private fb: FormBuilder
        , @Inject(Router) private router: Router
        , @Inject(MedicalFileService) private registerService: MedicalFileService
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
            formsElement.controls['enableOpt'].disable();
        }
        this.registerId = Number(paramsUrl.get('id'));
    }
    ngAfterViewInit() {
    }
    loadRegister() {
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<MedicalFileModel>) => { this.processLoadRegister(response); }, error: (err) => { this.processLoadRegisterErro(err); },
        });
    }
    addRegister() {
        //this.getValuesForm();
        let formDataSend = this.getValuesForm();
        this.registerService.upload(formDataSend).subscribe({
            next: (response: ServiceResponse<MedicalFileModel>) => { this.processAddRegister(response); }, error: (err) => { this.processAddRegisterErro(err); },
        });
    }
    processAddRegister(response: ServiceResponse<MedicalFileModel>) {
        CaptureTologFunc('processAddRegister-Patient', response);
        this.serviceResponse = response;
        if (response?.errors?.length == 0) {
            this.modalSuccessAlert();
            this.goBackToList();
        } else {
            this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
        }
    }
    processAddRegisterErro(response: ServiceResponse<MedicalFileModel>) {
        CaptureTologFunc('processAddRegisterErro-Patient', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
    }

    processUpdateRegister(response: ServiceResponse<MedicalFileModel>) {
        CaptureTologFunc('processUpdateRegister-Patient', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<MedicalFileModel>) {
        CaptureTologFunc('processUpdateRegisterErro-Patient', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<MedicalFileModel>) {
        CaptureTologFunc('processLoadRegister-Patient', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
        this.isUpdateRegister = true && !this.isModeViewForm;
    }
    processLoadRegisterErro(response: ServiceResponse<MedicalFileModel>) {
        CaptureTologFunc('processLoadRegisterErro-Patient', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.load.title'), response);
    }
    fillFieldsForm(): void {
        let formatDate = 'dd/MM/yyyy';
        let pipeDate = new DatePipe('pt-BR');
        let responseData: MedicalFileModel = this.serviceResponse?.data;
        let formsElement = this.registerForm;
        this.registerModel = {
            id: responseData?.id,
            medicalId: responseData?.medicalId,
            medical: responseData?.medical,
            description: responseData?.description,
            enable: responseData?.enable,
            //fileDetails: responseData?.fileDetails,
        };
        let modelEntity = this.registerModel;

        formsElement.controls['description'].setValue(modelEntity?.description);
        formsElement.controls['enableOpt'].setValue(modelEntity?.enable);
    }
    isValidFormDescription(): boolean {
        let isRequired = this.registerForm.get('description').errors?.required;
        return this.registerForm.controls['description'].touched && this.registerForm.controls['description'].invalid && isRequired;
    }
    fileToUpload: Blob;
    gerateFormRegister() {
        this.registerForm = this.fb.group({
            id: new FormControl<number>(0),
            description: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            medicalId: new FormControl<number>(0),
            file: new FormControl(null, Validators.required),
            enableOpt: new FormControl<boolean>(false, Validators.required),
        });
    }
    onFileSelected(event) {
        this.fileToUpload = event.target.files[0] as Blob;
        this.registerForm.patchValue({
            file: this.fileToUpload
        });
    }
    getValuesForm(): FormData {
        let formElement = this.registerForm;
        const fd = new FormData();
        //fd.append('file', this.registerForm.get('fileDetails').value, this.registerForm.get('fileDetails').value.name);
        //console.log(this.registerForm.get('fileDetails'));
        //fd.append('fileDetails', this.fileToUpload, 'upload.blob'); 
        let nameFile = this.registerForm.get('file').value.name;
        let medicalId = this.parentId ? this.parentId : 0;
        fd.append('medicalId', medicalId.toString());
        fd.append('id', "0");
        fd.append('description', this.registerForm.get('description').value);
        fd.append('enable', this.registerForm.get('enableOpt').value);
        fd.append('fileDetails', this.fileToUpload, nameFile); 
        this.registerModel = {
            medicalId: this.parentId ? this.parentId : 0,
            id: this.registerId ? this.registerId : 0,
            description: formElement.controls['description']?.value,
            //fileDetails: this.fileToUpload,
            fileDetails: fd,
            enable: formElement.controls['enableOpt']?.value,
        }; 
        return fd;
    }
    createEmptyRegister(): void {
        this.registerModel = {
            id: 0,
            description: '',
            medicalId: 0,
            enable: false
        }
    }
    onSelect(selectedValue: string) {
    }
    goBackToList() {
        this.router.navigate(['/medical/manage/filelist', { parentId: this.parentId }]);
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
    modalErroAlert(msgErro: string, response: ServiceResponse<MedicalFileModel>) {
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
}