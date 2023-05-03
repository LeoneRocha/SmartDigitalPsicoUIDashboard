import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { LanguageOptions } from 'app/common/enuns/language-options';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { GetMsgServiceResponse } from 'app/common/helpers/GetMsgServiceResponse';
import { UserModel } from 'app/models/principalsmodel/UserModel';
import { UserService } from 'app/services/general/principals/user.service';
import { SimpleGeneralModel } from 'app/models/contracts/SimpleModel';
import { GlobalizationCultureService } from 'app/services/general/simple/globalizationculture.service';
import { GlobalizationTimeZonesService } from 'app/services/general/simple/globalizationtimezone.service';
import { RoleOptions } from 'app/common/enuns/role-options';
import { MedicalService } from 'app/services/general/principals/medical.service';
import { MedicalModel } from 'app/models/principalsmodel/MedicalModel';
import { LanguageService } from 'app/services/general/language.service';
import { RoleGroupModel } from 'app/models/simplemodel/RoleGroupModel';
import { RoleGroupService } from 'app/services/general/simple/rolegroup.service';
@Component({
    moduleId: module.id,
    selector: 'add-edit-usermanagement',
    templateUrl: 'add-edit-usermanagement.component.html'
    //styleUrls: ['./usermanagement.component.css']
})
//5-  a lista

export class AddEditUserManagementComponent implements OnInit {
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: UserModel;
    serviceResponse: ServiceResponse<UserModel>;
    public languages = LanguageOptions;
    public rolesOpts = RoleOptions;
    public languagesGlobal: SimpleGeneralModel[];
    public timeZonesGlobal: SimpleGeneralModel[];
    public medicalsOpts: MedicalModel[];
    public roleGroupOpts: RoleGroupModel[];

    estadoBotao_goBackToList = 'inicial';
    estadoBotao_addRegister = 'inicial';
    estadoBotao_updateRegister = 'inicial';

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        , private fb: FormBuilder
        , @Inject(Router) private router: Router
        , @Inject(UserService) private registerService: UserService
        , @Inject(MedicalService) private medicalService: MedicalService
        , @Inject(RoleGroupService) private roleGroupService: RoleGroupService
        , @Inject(GlobalizationCultureService) private globalizationCultureService: GlobalizationCultureService
        , @Inject(GlobalizationTimeZonesService) private globalizationTimeZonesService: GlobalizationTimeZonesService
        , @Inject(LanguageService) private languageService: LanguageService
    ) {
        this.gerateFormRegister();
    }
    ngOnInit() {
        this.languageService.loadLanguage();
        this.loadGlobalization();
        this.loadMedicals();
        this.loadRoleGroups();
        this.loadFormParameters();
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
    loadMedicals() {
        this.medicalService.getAll().subscribe({
            next: (response: any) => { this.medicalsOpts = response['data']; }, error: (err) => { console.log(err); },
        });
    }
    loadRoleGroups() {
        this.roleGroupService.getAll().subscribe({
            next: (response: any) => { this.roleGroupOpts = response['data']; }, error: (err) => { console.log(err); },
        });
    }
    loadGlobalization() {
        this.globalizationCultureService.getAll().subscribe({
            next: (response: SimpleGeneralModel[]) => { this.languagesGlobal = response; }, error: (err) => { console.log(err); },
        });

        this.globalizationTimeZonesService.getAll().subscribe({
            next: (response: SimpleGeneralModel[]) => { this.timeZonesGlobal = response; }, error: (err) => { console.log(err); },
        });
    }
    loadFormParameters() {
        let paramsUrl = this.route.snapshot.paramMap;
        this.isModeViewForm = paramsUrl.get('modeForm') === 'view';
        this.registerId = Number(paramsUrl.get('id'));
        this.isUpdateRegister = this.registerId > 0 && !this.isModeViewForm;
    }
    loadFormRegister() {
        let formsElement = this.registerForm;

        if (this.isUpdateRegister) {
            formsElement.controls['email'].disable();
            formsElement.controls['login'].disable();
        }

        if (this.isModeViewForm) {
            formsElement.controls['name'].disable();
            formsElement.controls['email'].disable();
            formsElement.controls['login'].disable();
            formsElement.controls['password'].disable();
            formsElement.controls['language'].disable();
            formsElement.controls['timezone'].disable();
            formsElement.controls['medicalId'].disable();
            formsElement.controls['adminOpt'].disable();
            formsElement.controls['enableOpt'].disable();
            formsElement.controls['role'].disable();
        }
    }
    loadRegister() {
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<UserModel>) => { this.processLoadRegister(response); }, error: (err: any) => { this.processLoadRegisterErro(err); },
        });
    }
    addRegister() {
        this.getValuesForm();
        this.registerService.add(this.registerModel).subscribe({
            next: (response: ServiceResponse<UserModel>) => { this.processAddRegister(response); }, error: (err: any) => { this.processAddRegisterErro(err); },
        });
    }
    updateRegister() {
        this.getValuesForm();
        this.registerService.update(this.registerModel).subscribe({
            next: (response: ServiceResponse<UserModel>) => { this.processUpdateRegister(response); }, error: (err: any) => {
                this.processUpdateRegisterErro(err);
            },
        });
    }
    processAddRegister(response: ServiceResponse<UserModel>) {
        CaptureTologFunc('processAddRegister-usermanagement', response);
        this.serviceResponse = response;
        if (response?.errors?.length == 0) {
            this.modalSuccessAlert();
            this.goBackToList();
        } else {
            this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
        }
    }
    processAddRegisterErro(response: ServiceResponse<UserModel>) {
        CaptureTologFunc('processAddRegisterErro-usermanagement', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
    }

    processUpdateRegister(response: ServiceResponse<UserModel>) {
        CaptureTologFunc('processUpdateRegister-usermanagement', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<UserModel>) {
        CaptureTologFunc('processUpdateRegisterErro-usermanagement', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<UserModel>) {
        CaptureTologFunc('processLoadRegister-usermanagement', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
        this.isUpdateRegister = true && !this.isModeViewForm;
    }
    processLoadRegisterErro(response: ServiceResponse<UserModel>) {
        CaptureTologFunc('processLoadRegisterErro-usermanagement', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.load.title'), response);
    }
    fillFieldsForm(): void {
        let responseData: any = this.serviceResponse?.data;
        let formsElement = this.registerForm;
        this.registerModel = {
            id: responseData?.id,
            name: responseData?.name,
            email: responseData?.email,
            login: responseData?.login,
            password: responseData?.password,
            language: responseData?.language,
            timeZone: responseData?.timeZone,
            medicalId: responseData?.medicalId,
            enable: responseData?.enable,
            admin: responseData?.admin,
            role: responseData?.role,
            roleGroupsIds: responseData?.roleGroups?.map(roleGroup => roleGroup.id)
        };
        let modelEntity = this.registerModel;
        formsElement.controls['name'].setValue(modelEntity?.name);
        formsElement.controls['email'].setValue(modelEntity?.email);
        formsElement.controls['login'].setValue(modelEntity?.login);
        formsElement.controls['password'].setValue(modelEntity?.password);
        formsElement.controls['language'].setValue(modelEntity?.language);
        formsElement.controls['timezone'].setValue(modelEntity?.timeZone);
        formsElement.controls['medicalId'].setValue(modelEntity?.medicalId);
        formsElement.controls['enableOpt'].setValue(modelEntity?.enable);
        formsElement.controls['adminOpt'].setValue(modelEntity?.admin);
        formsElement.controls['role'].setValue(modelEntity?.role);
        //formsElement.controls['roleGroupsIds'].setValue(modelEntity?.roleGroupsIds);
        setTimeout(() => { this.setCheckedRoleGroupsIds(modelEntity); }, 500);

    }
    isValidFormName(): boolean {
        let isValid = this.registerForm.get('name').errors?.required;
        return this.registerForm.controls['name'].touched && this.registerForm.controls['name'].invalid && isValid;
    }
    isValidFormEmail(): boolean {
        let isValid = this.registerForm.get('email').errors?.required;
        return this.registerForm.controls['email'].touched && this.registerForm.controls['email'].invalid && isValid;
    }
    isValidFormRole(): boolean {
        let isValid = this.registerForm.get('role').errors?.required;
        return this.registerForm.controls['role'].touched && this.registerForm.controls['role'].invalid && isValid;
    }
    isValidFormLogin(): boolean {
        let isValid = this.registerForm.get('login').errors?.required;
        return this.registerForm.controls['login'].touched && this.registerForm.controls['login'].invalid && isValid;
    }
    isValidFormPassword(): boolean {
        let isValid = this.registerForm.get('password').errors?.required;
        if (this.isUpdateRegister) {
            isValid = false;
        }
        isValid = this.registerForm.controls['password'].touched && this.registerForm.controls['password'].valid && isValid

        return isValid;
    }
    isValidFormLanguage(): boolean {
        let isValid = this.registerForm.get('language').errors?.required;
        return this.registerForm.controls['language'].touched && this.registerForm.controls['language'].invalid && isValid;
    }
    isValidFormMedicalId(): boolean {
        let isValid = false;
        return isValid;
    }
    isValidFormTimezone(): boolean {
        let isValid = this.registerForm.get('timezone').errors?.required;
        return this.registerForm.controls['timezone'].touched && this.registerForm.controls['timezone'].invalid && isValid;
    }
    isValidFormRoleGroupsIds(): boolean {
        let isRequired = this.registerForm.get('roleGroupsIds').errors?.required;
        return this.registerForm.controls['roleGroupsIds'].touched && this.registerForm.controls['roleGroupsIds'].invalid && isRequired;
    }
    gerateFormRegister() {
        let isPasswordRequired: boolean = true;

        if (this.isUpdateRegister) {
            isPasswordRequired = false;
        }

        let formElement = this.registerForm;
        this.registerForm = this.fb.group({
            id: new FormControl(),
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
            login: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]),
            password: new FormControl(),
            language: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
            timezone: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            enableOpt: new FormControl(false, Validators.required),
            adminOpt: new FormControl(false, Validators.required),
            role: new FormControl(false, Validators.required),
            medicalId: new FormControl(),
            roleGroupsIds: this.fb.array<number>([]),
            //roleGroupsIds: new FormControl(false, Validators.required), 
        });

    }
    getValuesForm() {
        let formElement = this.registerForm;
        this.registerModel = {
            id: this.registerId ? this.registerId : 0,
            name: formElement.controls['name']?.value,
            email: formElement.controls['email']?.value,
            login: formElement.controls['login']?.value,
            password: formElement.controls['password']?.value ? formElement.controls['password']?.value : null,
            language: formElement.controls['language']?.value,
            timeZone: formElement.controls['timezone']?.value,
            medicalId: formElement.controls['medicalId']?.value ? formElement.controls['medicalId']?.value : null,
            enable: formElement.controls['enableOpt']?.value,
            admin: formElement.controls['adminOpt']?.value,
            role: formElement.controls['role']?.value,
            roleGroupsIds: formElement.controls['roleGroupsIds']?.value,
        };
    }
    setCheckedRoleGroupsIds(modelEntity): void {
        if (modelEntity?.roleGroupsIds) {
            modelEntity?.roleGroupsIds.forEach(specialtyId => {
                if (this.roleGroupOpts && this.roleGroupOpts.length > 0) {
                    const roleGroup = this.roleGroupOpts.find(opt => opt.id === specialtyId);
                    if (roleGroup) {
                        roleGroup.selected = true;
                    }
                }
            });
        }
    }
    onCheckboxChange(e) {
        const checkArray: FormArray = this.registerForm.get('roleGroupsIds') as FormArray;
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
        }
    }
    createEmptyRegister(): void {
        this.registerModel = {
            id: 0,
            name: '',
            email: '',
            login: '',
            password: '',
            language: '',
            timeZone: '',
            medicalId: null,
            enable: false,
            admin: false,
            role: '',
            roleGroupsIds: [],
        };
    }
    onSelect(selectedValue: string) {
        //demo
    }
    goBackToList() {
        this.router.navigate(['/administrative/usermanagement']);
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
    modalErroAlert(msgErro: string, response: ServiceResponse<UserModel>) {
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