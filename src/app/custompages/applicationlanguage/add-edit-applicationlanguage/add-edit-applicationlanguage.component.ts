import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { LanguageOptions } from 'app/common/enuns/language-options';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { GetMsgServiceResponse } from 'app/common/helpers/GetMsgServiceResponse';
import { ApplicationLanguageService } from 'app/services/general/simple/applicationlanguage.service';
import { ApplicationLanguageModel } from 'app/models/simplemodel/ApplicationLanguageModel';
import { ResourceKeyOptions } from 'app/common/enuns/language-options copy';
import { LanguageService } from 'app/services/general/language.service';
@Component({
    moduleId: module.id,
    selector: 'add-edit-applicationlanguage',
    templateUrl: 'add-edit-applicationlanguage.component.html'
    //styleUrls: ['./ApplicationLanguage.component.css']
})
//5-  a lista

export class AddEditApplicationLanguageComponent implements OnInit {
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: ApplicationLanguageModel;
    serviceResponse: ServiceResponse<ApplicationLanguageModel>;
    public languages = LanguageOptions;
    public resourceKeyOpts = ResourceKeyOptions;
    estadoBotao_goBackToList = 'inicial';
    estadoBotao_addRegister = 'inicial';
    estadoBotao_updateRegister = 'inicial';

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        , @Inject(ApplicationLanguageService) private registerService: ApplicationLanguageService
        , private fb: FormBuilder, @Inject(Router) private router: Router
        , @Inject(LanguageService) private languageService: LanguageService) {
        this.gerateFormRegister();
    }
    ngOnInit() {
        this.languageService.loadLanguage();
        this.loadFormRegister();
        if (this.registerId)
            this.loadRegister();

        if (this.registerModel?.id)
            this.createEmptyRegister();
    }
    ngAfterViewInit() {
    }
    animarBotao(estado: string, stateBtn: string) {
        // alert(estado);
        if (stateBtn === 'goBackToList')
            this.estadoBotao_goBackToList = estado;

        if (stateBtn === 'addRegister')
            this.estadoBotao_addRegister = estado;

        if (stateBtn === 'updateRegister')
            this.estadoBotao_updateRegister = estado;
    }
    loadFormRegister() {
        let formsElement = this.registerForm;
        let paramsUrl = this.route.snapshot.paramMap;
        this.isModeViewForm = paramsUrl.get('modeForm') === 'view';

        if (this.isModeViewForm) {
            formsElement.controls['description'].disable();
            formsElement.controls['language'].disable();
            formsElement.controls['languageKey'].disable();
            formsElement.controls['languageValue'].disable();
            formsElement.controls['resourceKey'].disable();
            formsElement.controls['enableOpt'].disable();
        }
        this.registerId = Number(paramsUrl.get('id'));

        if (this.registerId > 0) {
            formsElement.controls['languageKey'].disable();
            formsElement.controls['language'].disable();
            //formsElement.controls['resourceKey'].disable();   
        }
    }
    loadRegister() {
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<ApplicationLanguageModel>) => { this.processLoadRegister(response); }, error: (err) => { this.processLoadRegisterErro(err); },
        });
    }
    addRegister() {
        this.getValuesForm();
        this.registerService.add(this.registerModel).subscribe({
            next: (response: ServiceResponse<ApplicationLanguageModel>) => { this.processAddRegister(response); }, error: (err) => { this.processAddRegisterErro(err); },
        });
    }
    updateRegister() {
        this.getValuesForm();
        this.registerService.update(this.registerModel).subscribe({
            next: (response: ServiceResponse<ApplicationLanguageModel>) => { this.processUpdateRegister(response); }, error: (err) => { this.processUpdateRegisterErro(err); },
        });
    }
    processAddRegister(response: ServiceResponse<ApplicationLanguageModel>) {
        CaptureTologFunc('processAddRegister-ApplicationLanguage', response);
        this.serviceResponse = response;
        if (response?.errors?.length == 0) {
            this.modalSuccessAlert();
        } else {
            this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
        }
        this.goBackToList();
    }
    processAddRegisterErro(response: ServiceResponse<ApplicationLanguageModel>) {
        CaptureTologFunc('processAddRegisterErro-ApplicationLanguage', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
    }

    processUpdateRegister(response: ServiceResponse<ApplicationLanguageModel>) {
        CaptureTologFunc('processUpdateRegister-ApplicationLanguage', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<ApplicationLanguageModel>) {
        CaptureTologFunc('processUpdateRegisterErro-ApplicationLanguage', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<ApplicationLanguageModel>) {
        CaptureTologFunc('processLoadRegister-ApplicationLanguage', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
        this.isUpdateRegister = true && !this.isModeViewForm;
    }
    processLoadRegisterErro(response: ServiceResponse<ApplicationLanguageModel>) {
        CaptureTologFunc('processLoadRegisterErro-ApplicationLanguage', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.load.title'), response);
    }
    fillFieldsForm(): void {
        let responseData: any = this.serviceResponse?.data;
        let formsElement = this.registerForm;
        this.registerModel = {
            id: responseData?.id,
            description: responseData?.description,
            language: responseData?.language,
            enable: responseData?.enable,
            languageKey: responseData?.languageKey,
            languageValue: responseData?.languageValue,
            resourceKey: responseData?.resourceKey,
        };
        let modelEntity = this.registerModel;
        formsElement.controls['description'].setValue(modelEntity?.description);
        formsElement.controls['language'].setValue(modelEntity?.language);
        formsElement.controls['languageKey'].setValue(modelEntity?.languageKey);
        formsElement.controls['languageValue'].setValue(modelEntity?.languageValue);
        formsElement.controls['resourceKey'].setValue(modelEntity?.resourceKey);
        formsElement.controls['enableOpt'].setValue(modelEntity?.enable);
    }

    isValidFormDescription(): boolean {
        let isValid = this.registerForm.get('description').errors?.required;
        return this.registerForm.controls['description'].touched && this.registerForm.controls['description'].invalid && isValid;
    }
    isValidFormLanguage(): boolean {
        let isValid = this.registerForm.get('language').errors?.required;
        return this.registerForm.controls['language'].touched && this.registerForm.controls['language'].invalid && isValid;
    }
    isValidFormLanguageKey(): boolean {
        let isValid = this.registerForm.get('languageKey').errors?.required;
        return this.registerForm.controls['languageKey'].touched && this.registerForm.controls['languageKey'].invalid && isValid;
    }
    isValidFormLanguageValue(): boolean {
        let isValid = this.registerForm.get('languageValue').errors?.required;
        return this.registerForm.controls['languageValue'].touched && this.registerForm.controls['languageValue'].invalid && isValid;
    }

    isValidFormResourceKey(): boolean {
        let isValid = this.registerForm.get('resourceKey').errors?.required;
        return this.registerForm.controls['resourceKey'].touched && this.registerForm.controls['resourceKey'].invalid && isValid;
    }

    gerateFormRegister() {
        this.registerForm = this.fb.group({
            id: new FormControl(),
            description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            language: new FormControl('', Validators.required),
            languageKey: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            languageValue: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            resourceKey: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            enableOpt: new FormControl(false, Validators.required),

        });
    }
    getValuesForm() {
        let formElement = this.registerForm;
        this.registerModel = {
            id: this.registerId ? this.registerId : 0,
            description: formElement.controls['description']?.value,
            language: formElement.controls['language']?.value,
            enable: formElement.controls['enableOpt']?.value,
            languageKey: formElement.controls['languageKey']?.value,
            languageValue: formElement.controls['languageValue']?.value,
            resourceKey: formElement.controls['resourceKey']?.value,
        }; 
    }
    createEmptyRegister(): void {
        this.registerModel = {
            id: 0,
            description: '',
            language: '',
            enable: false,
            languageKey: '',
            languageValue: '',
            resourceKey: '',
        }
    }
    onSelect(selectedValue: string) {
        //demo
    }
    goBackToList() {
        this.router.navigate(['/administrative/applicationlanguage']);
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
    modalErroAlert(msgErro: string, response: ServiceResponse<ApplicationLanguageModel>) {
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
}