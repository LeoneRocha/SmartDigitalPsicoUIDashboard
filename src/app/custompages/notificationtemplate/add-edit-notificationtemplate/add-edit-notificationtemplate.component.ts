import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { LanguageOptions } from 'app/common/enuns/language-options';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { GetMsgServiceResponse } from 'app/common/helpers/GetMsgServiceResponse';
import { ResourceKeyOptions } from 'app/common/enuns/language-options copy';
import { LanguageService } from 'app/services/general/language.service'; 
import { NotificationTemplateDto } from 'app/models/modelsbyswagger/models';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AngularEditorConfigHelper } from 'app/helpers/angularEditorConfigHelper';
import { NotificationTemplateService } from 'app/services/general/principals/notificationtemplate.service';
@Component({
    moduleId: module.id,
    selector: 'add-edit-notificationtemplate',
    templateUrl: 'add-edit-notificationtemplate.component.html',
    styleUrls: ['add-edit-notificationtemplate.component.css']
})

export class AddEditNotificationTemplateComponent implements OnInit {
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: NotificationTemplateDto;
    serviceResponse: ServiceResponse<NotificationTemplateDto>;
    public languages = LanguageOptions;
    public resourceKeyOpts = ResourceKeyOptions;
    estadoBotao_goBackToList = 'inicial';
    estadoBotao_addRegister = 'inicial';
    estadoBotao_updateRegister = 'inicial';

    editorConfig: AngularEditorConfig;

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        , @Inject(NotificationTemplateService) private registerService: NotificationTemplateService
        , private fb: FormBuilder, @Inject(Router) private router: Router
        , @Inject(LanguageService) private languageService: LanguageService) {
        this.gerateFormRegister();
    }
    ngOnInit() {

        this.loadEditorConfig();

        this.languageService.loadLanguage();
        this.loadFormRegister();
        if (this.registerId)
            this.loadRegister();

        if (this.registerModel?.id)
            this.createEmptyRegister();
    }
    ngAfterViewInit() {
    }
    loadEditorConfig() {
        this.editorConfig = AngularEditorConfigHelper.getEditorConfig(window.innerWidth);        
        window.addEventListener('resize', () => {
            this.editorConfig = AngularEditorConfigHelper.getEditorConfig(window.innerWidth);
        });
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
            formsElement.controls['tagApi'].disable();
            formsElement.controls['language'].disable();
            formsElement.controls['subject'].disable();
            formsElement.controls['body'].disable();
            formsElement.controls['enableOpt'].disable();
            this.editorConfig.editable = false;
        }
        this.registerId = Number(paramsUrl.get('id'));

        if (this.registerId > 0) {
            formsElement.controls['language'].disable();
            formsElement.controls['tagApi'].disable();
        }
    }
    loadRegister() {
        console.log('loadRegister', this.registerId);
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<NotificationTemplateDto>) => { this.processLoadRegister(response); }, error: (err) => { this.processLoadRegisterErro(err); },
        });
    }
    addRegister() {
        this.getValuesForm();
        console.log('addRegister', this.registerModel);
        this.registerService.add(this.registerModel).subscribe({
            next: (response: ServiceResponse<NotificationTemplateDto>) => { this.processAddRegister(response); }, error: (err) => { this.processAddRegisterErro(err); },
        });
    }
    updateRegister() {
        this.getValuesForm();
        this.registerService.update(this.registerModel).subscribe({
            next: (response: ServiceResponse<NotificationTemplateDto>) => { this.processUpdateRegister(response); }, error: (err) => { this.processUpdateRegisterErro(err); },
        });
    }
    processAddRegister(response: ServiceResponse<NotificationTemplateDto>) {
        CaptureTologFunc('processAddRegister-NotificationTemplate', response);
        this.serviceResponse = response;
        if (response?.errors?.length == 0) {
            this.modalSuccessAlert();
        } else {
            this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
        }
        this.goBackToList();
    }
    processAddRegisterErro(response: ServiceResponse<NotificationTemplateDto>) {
        CaptureTologFunc('processAddRegisterErro-NotificationTemplate', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
    }

    processUpdateRegister(response: ServiceResponse<NotificationTemplateDto>) {
        CaptureTologFunc('processUpdateRegister-NotificationTemplate', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<NotificationTemplateDto>) {
        CaptureTologFunc('processUpdateRegisterErro-NotificationTemplate', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<NotificationTemplateDto>) {
        CaptureTologFunc('processLoadRegister-NotificationTemplate', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
        this.isUpdateRegister = true && !this.isModeViewForm;
    }
    processLoadRegisterErro(response: ServiceResponse<NotificationTemplateDto>) {
        CaptureTologFunc('processLoadRegisterErro-NotificationTemplate', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.load.title'), response);
    }
    fillFieldsForm(): void {
        let responseData: any = this.serviceResponse?.data;
        let formsElement = this.registerForm;
        this.registerModel = {
            id: responseData?.id,
            subject: responseData?.subject,
            body: responseData?.body,
            description: responseData?.description,
            tagApi: responseData?.tagApi,
            language: responseData?.language,
            enable: responseData?.enable,
            links: responseData?.links
        };
        let modelEntity = this.registerModel;
        formsElement.controls['subject'].setValue(this.registerModel.subject);
        formsElement.controls['body'].setValue(this.registerModel.body);
        formsElement.controls['description'].setValue(this.registerModel.description);
        formsElement.controls['tagApi'].setValue(this.registerModel.tagApi);
        formsElement.controls['language'].setValue(this.registerModel.language);
        formsElement.controls['enableOpt'].setValue(this.registerModel.enable);
    }

    isValidFormSubject(): boolean {
        let isValid = this.registerForm.get('subject').errors?.required;
        return this.registerForm.controls['subject'].touched && this.registerForm.controls['subject'].invalid && isValid;
    }
    isValidFormBody(): boolean {
        let isValid = this.registerForm.get('body').errors?.required;
        return this.registerForm.controls['body'].touched && this.registerForm.controls['body'].invalid && isValid;
    }
    isValidFormDescription(): boolean {
        let isValid = this.registerForm.get('description').errors?.required;
        return this.registerForm.controls['description'].touched && this.registerForm.controls['description'].invalid && isValid;
    }
    isValidFormTagApi(): boolean {
        let isValid = this.registerForm.get('tagApi').errors?.required;
        return this.registerForm.controls['tagApi'].touched && this.registerForm.controls['tagApi'].invalid && isValid;
    }
    isValidFormLanguage(): boolean {
        let isValid = this.registerForm.get('language').errors?.required;
        return this.registerForm.controls['language'].touched && this.registerForm.controls['language'].invalid && isValid;
    }

    gerateFormRegister() {
        this.registerForm = this.fb.group({
            id: new FormControl(),
            description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            tagApi: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            subject: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            body: new FormControl('', [Validators.required, Validators.minLength(3)]),
            language: new FormControl('', Validators.required),
            enableOpt: new FormControl(false, Validators.required),
        });
    }
    getValuesForm() {
        let formElement = this.registerForm;
        this.registerModel = {
            id: this.registerId ? this.registerId : 0,
            description: formElement.controls['description']?.value,
            tagApi: formElement.controls['tagApi']?.value,
            language: formElement.controls['language']?.value,
            subject: formElement.controls['subject']?.value,
            body: formElement.controls['body']?.value,
            enable: formElement.controls['enableOpt']?.value,
        };
    }
    createEmptyRegister(): void {
        this.registerModel = {
            id: 0,
            subject: '',
            body: '',
            enable: false,
            description: '',
            tagApi: '',
            language: '',
            links: []
        }
    }
    onSelect(selectedValue: string) {
        //demo
    }
    goBackToList() {
        this.router.navigate(['/administrative/notificationtemplate']);
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
    modalErroAlert(msgErro: string, response: ServiceResponse<NotificationTemplateDto>) {
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