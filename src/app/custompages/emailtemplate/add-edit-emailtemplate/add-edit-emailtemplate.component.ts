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
import { EmailTemplateService } from 'app/services/general/principals/emailTemplate.service';
import { EmailTemplateDto } from 'app/models/modelsbyswagger/models';
@Component({
    moduleId: module.id,
    selector: 'add-edit-emailtemplate',
    templateUrl: 'add-edit-emailtemplate.component.html'
})

export class AddEditEmailTemplateComponent implements OnInit {
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: EmailTemplateDto;
    serviceResponse: ServiceResponse<EmailTemplateDto>;
    public languages = LanguageOptions;
    public resourceKeyOpts = ResourceKeyOptions;
    estadoBotao_goBackToList = 'inicial';
    estadoBotao_addRegister = 'inicial';
    estadoBotao_updateRegister = 'inicial';

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        , @Inject(EmailTemplateService) private registerService: EmailTemplateService
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
            formsElement.controls['subject'].disable();
            formsElement.controls['body'].disable();
            formsElement.controls['enableOpt'].disable();
        }
        this.registerId = Number(paramsUrl.get('id'));

        if (this.registerId > 0) { 
            formsElement.controls['language'].disable();
        } 
    }
    loadRegister() {
        console.log('loadRegister', this.registerId);
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<EmailTemplateDto>) => { this.processLoadRegister(response); }, error: (err) => { this.processLoadRegisterErro(err); },
        });
    }
    addRegister() {
        this.getValuesForm();
        this.registerService.add(this.registerModel).subscribe({
            next: (response: ServiceResponse<EmailTemplateDto>) => { this.processAddRegister(response); }, error: (err) => { this.processAddRegisterErro(err); },
        });
    }
    updateRegister() {
        this.getValuesForm();
        this.registerService.update(this.registerModel).subscribe({
            next: (response: ServiceResponse<EmailTemplateDto>) => { this.processUpdateRegister(response); }, error: (err) => { this.processUpdateRegisterErro(err); },
        });
    }
    processAddRegister(response: ServiceResponse<EmailTemplateDto>) {
        CaptureTologFunc('processAddRegister-EmailTemplate', response);
        this.serviceResponse = response;
        if (response?.errors?.length == 0) {
            this.modalSuccessAlert();
        } else {
            this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
        }
        this.goBackToList();
    }
    processAddRegisterErro(response: ServiceResponse<EmailTemplateDto>) {
        CaptureTologFunc('processAddRegisterErro-EmailTemplate', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
    }

    processUpdateRegister(response: ServiceResponse<EmailTemplateDto>) {
        CaptureTologFunc('processUpdateRegister-EmailTemplate', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<EmailTemplateDto>) {
        CaptureTologFunc('processUpdateRegisterErro-EmailTemplate', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<EmailTemplateDto>) {
        CaptureTologFunc('processLoadRegister-EmailTemplate', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
        this.isUpdateRegister = true && !this.isModeViewForm;
    }
    processLoadRegisterErro(response: ServiceResponse<EmailTemplateDto>) {
        CaptureTologFunc('processLoadRegisterErro-EmailTemplate', response);
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
            language: responseData?.language,
            enable: responseData?.enable,
            links: responseData?.links
        };
        let modelEntity = this.registerModel;
        formsElement.controls['subject'].setValue(this.registerModel.subject);
        formsElement.controls['body'].setValue(this.registerModel.body);
        formsElement.controls['description'].setValue(this.registerModel.description);
        formsElement.controls['language'].setValue(this.registerModel.language);
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
    isValidFormLanguage(): boolean {
        let isValid = this.registerForm.get('language').errors?.required;
        return this.registerForm.controls['language'].touched && this.registerForm.controls['language'].invalid && isValid;
    }

    gerateFormRegister() { 
        this.registerForm = this.fb.group({
            id: new FormControl(),
            description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
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
            language: '',
            links: []
        }
    }
    onSelect(selectedValue: string) {
        //demo
    }
    goBackToList() {
        this.router.navigate(['/administrative/emailtemplate']);
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
    modalErroAlert(msgErro: string, response: ServiceResponse<EmailTemplateDto>) {
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