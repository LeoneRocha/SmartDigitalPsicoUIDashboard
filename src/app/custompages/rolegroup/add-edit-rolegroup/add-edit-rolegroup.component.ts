import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { LanguageOptions } from 'app/common/enuns/language-options';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { GetMsgServiceResponse } from 'app/common/helpers/GetMsgServiceResponse';
import { RoleGroupModel } from 'app/models/simplemodel/RoleGroupModel';
import { RoleGroupService } from 'app/services/general/simple/rolegroup.service';
import { LanguageService } from 'app/services/general/language.service';
@Component({
    moduleId: module.id,
    selector: 'add-edit-rolegroup',
    templateUrl: 'add-edit-rolegroup.component.html'
    //styleUrls: ['./RoleGroup.component.css']
})
//5-  a lista

export class AddEditRoleGroupComponent implements OnInit {
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: RoleGroupModel;
    serviceResponse: ServiceResponse<RoleGroupModel>;
    public languages = LanguageOptions;
    estadoBotao_goBackToList = 'inicial';
    estadoBotao_addRegister = 'inicial';
    estadoBotao_updateRegister = 'inicial';

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        , @Inject(RoleGroupService) private registerService: RoleGroupService
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
            formsElement.controls['enableOpt'].disable();
            formsElement.controls['enableOpt'].disable();
        }
        this.registerId = Number(paramsUrl.get('id'));
    }
    
    loadRegister() {
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<RoleGroupModel>) => { this.processLoadRegister(response); }, error: (err) => { this.processLoadRegisterErro(err); },
        });
    }
    addRegister() {
        this.getValuesForm();
        this.registerService.add(this.registerModel).subscribe({
            next: (response: ServiceResponse<RoleGroupModel>) => { this.processAddRegister(response); }, error: (err) => { this.processAddRegisterErro(err); },
        });
    }
    updateRegister() {
        this.getValuesForm();
        this.registerService.update(this.registerModel).subscribe({
            next: (response: ServiceResponse<RoleGroupModel>) => { this.processUpdateRegister(response); }, error: (err) => { this.processUpdateRegisterErro(err); },
        });
    }
    processAddRegister(response: ServiceResponse<RoleGroupModel>) {
        CaptureTologFunc('processAddRegister-RoleGroup', response);
        this.serviceResponse = response;
        if (response?.errors?.length == 0) {
            this.modalSuccessAlert();
            this.goBackToList();
        } else {
            this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
        }

    }
    processAddRegisterErro(response: ServiceResponse<RoleGroupModel>) {
        CaptureTologFunc('processAddRegisterErro-RoleGroup', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
    }

    processUpdateRegister(response: ServiceResponse<RoleGroupModel>) {
        CaptureTologFunc('processUpdateRegister-RoleGroup', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<RoleGroupModel>) {
        CaptureTologFunc('processUpdateRegisterErro-RoleGroup', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<RoleGroupModel>) {
        CaptureTologFunc('processLoadRegister-RoleGroup', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
        this.isUpdateRegister = true && !this.isModeViewForm;
    }
    processLoadRegisterErro(response: ServiceResponse<RoleGroupModel>) {
        CaptureTologFunc('processLoadRegisterErro-RoleGroup', response);
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
            rolePolicyClaimCode: responseData?.rolePolicyClaimCode,
        };
        let modelEntity = this.registerModel;
        formsElement.controls['description'].setValue(modelEntity?.description);
        formsElement.controls['language'].setValue(modelEntity?.language);
        //this.registerModel_Enable = modelEntity?.enable;
        formsElement.controls['enableOpt'].setValue(modelEntity?.enable);
        formsElement.controls['rolepolicyclaimcode'].setValue(modelEntity?.rolePolicyClaimCode);

    }
    isValidFormDescription(): boolean {
        let isValid = this.registerForm.get('description').errors?.required;
        return this.registerForm.controls['description'].touched && this.registerForm.controls['description'].invalid && isValid;
    }
    isValidFormLanguage(): boolean {
        let isValid = this.registerForm.get('language').errors?.required;
        return this.registerForm.controls['language'].touched && this.registerForm.controls['language'].invalid && isValid;
    }
    isValidFormRolePolicyClaimCode(): boolean {
        let isValid = this.registerForm.get('rolepolicyclaimcode').errors?.required;
        return this.registerForm.controls['rolepolicyclaimcode'].touched && this.registerForm.controls['rolepolicyclaimcode'].invalid && isValid;
    }
    gerateFormRegister() {
        this.registerForm = this.fb.group({
            id: new FormControl(),
            description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            language: new FormControl('', Validators.required),
            enableOpt: new FormControl(false, Validators.required),
            rolepolicyclaimcode: new FormControl('', Validators.required),
        });
    }
    getValuesForm() {
        let formElement = this.registerForm;
        this.registerModel = {
            id: this.registerId ? this.registerId : 0,
            description: formElement.controls['description']?.value,
            language: formElement.controls['language']?.value,
            enable: formElement.controls['enableOpt']?.value,//this.registerModel_Enable,
            rolePolicyClaimCode: formElement.controls['rolepolicyclaimcode']?.value,//this.registerModel_Enable,
        };
    }
    createEmptyRegister(): void {
        this.registerModel = {
            id: 0,
            description: '',
            language: '',
            rolePolicyClaimCode: '',
            enable: false
        }
    }
    onSelect(selectedValue: string) {
        //demo
    }
    goBackToList() {
        this.router.navigate(['/administrative/rolegroup']);
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
    modalErroAlert(msgErro: string, response: ServiceResponse<RoleGroupModel>) {
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