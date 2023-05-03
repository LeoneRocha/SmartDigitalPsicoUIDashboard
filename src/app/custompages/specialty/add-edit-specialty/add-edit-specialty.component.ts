import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { LanguageOptions } from 'app/common/enuns/language-options';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { GetMsgServiceResponse } from 'app/common/helpers/GetMsgServiceResponse';
import { SpecialtyModel } from 'app/models/simplemodel/SpecialtyModel';
import { Store, select } from '@ngrx/store';
import { Appstate } from 'app/storereduxngrx/shared/appstate';
import { invokeLoadSpecialtyAPI, invokeSaveNewSpecialtyAPI, invokeUpdateSpecialtyAPI } from 'app/storereduxngrx/actions/specialty.action';
import { selectAppState } from 'app/storereduxngrx/shared/app.selector';
import { selectOneSpecialty } from 'app/storereduxngrx/selectors/specialty.selector';
import { switchMap } from 'rxjs';
import { setAPIStatus } from 'app/storereduxngrx/shared/app.action';
import { LanguageService } from 'app/services/general/language.service';
@Component({
    moduleId: module.id,
    selector: 'add-edit-specialty',
    templateUrl: 'add-edit-specialty.component.html'
    //styleUrls: ['./specialty.component.css']
})
export class AddEditSpecialtyComponent implements OnInit {
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: SpecialtyModel;
    serviceResponse: ServiceResponse<SpecialtyModel>;
    public languages = LanguageOptions;
    estadoBotao_goBackToList = 'inicial';
    estadoBotao_addRegister = 'inicial';
    estadoBotao_updateRegister = 'inicial';
    entityLoad$ = this.store.select(selectOneSpecialty);

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        //@Inject(SpecialtyService) private registerService: SpecialtyService,
        , private store: Store
        , private appStore: Store<Appstate>
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
    loadFormRegister() {
        let formsElement = this.registerForm;
        let paramsUrl = this.route.snapshot.paramMap;
        this.isModeViewForm = paramsUrl.get('modeForm') === 'view';

        if (this.isModeViewForm) {
            formsElement.controls['description'].disable();
            formsElement.controls['language'].disable();
            formsElement.controls['enableOpt'].disable();
            formsElement.controls['rolePolicyClaimCode'].disable();
        }
        this.registerId = Number(paramsUrl.get('id'));
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
    loadRegister() {
        /*
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<SpecialtyModel>) => { this.processLoadRegister(response); }, error: (err) => { this.processLoadRegisterErro(err); },
        });*/
        this.store.dispatch(invokeLoadSpecialtyAPI({ id: this.registerId }));
        let apiStatus$ = this.appStore.pipe(select(selectAppState));

        apiStatus$.subscribe({
            next: (response) => {
                if (response.apiStatus === 'success' && response.apiResponseMessage === 'invokeLoadSpecialtyAPI') {
                    this.processLoadRegister(response.resultAPI)
                }
                if (response.apiStatus === 'error' && response.apiResponseMessage === 'invokeLoadSpecialtyAPI') {
                    this.processLoadRegisterErro(response.errors);
                }
            },
            //error: (err) => { this.modalErroAlert('Error of delete.'); }
        });
    }

    addRegister() {
        this.getValuesForm();
        /* this.getValuesForm();
         this.registerService.add(this.registerModel).subscribe({
             next: (response: ServiceResponse<SpecialtyModel>) => { this.processAddRegister(response); }, error: (err) => { this.processAddRegisterErro(err); },
         });*/
        this.store.dispatch(invokeSaveNewSpecialtyAPI({ newSpecialty: { ...this.registerModel } }));

        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((apState) => {
            if (apState.apiResponseMessage === 'invokeSaveNewSpecialtyAPI') {

                if (apState.apiStatus == 'success') {

                    this.processAddRegister(apState.resultAPI)
                    this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } }));
                } else {
                    this.processAddRegisterErro(apState?.resultAPI);
                }
            }
        });

    }
    updateRegister() {
        this.getValuesForm();

        /*  this.getValuesForm();
          this.registerService.update(this.registerModel).subscribe({
              next: (response: ServiceResponse<SpecialtyModel>) => { this.processUpdateRegister(response); }, error: (err) => 
              { this.processUpdateRegisterErro(err); },
          });*/
        this.store.dispatch(invokeUpdateSpecialtyAPI({ updateSpecialty: { ...this.registerModel } }));

        let apiStatus$ = this.appStore.pipe(select(selectAppState));
        apiStatus$.subscribe((apState) => {
            if (apState.apiResponseMessage === 'invokeUpdateSpecialtyAPI') {

                if (apState.apiStatus == 'success') {

                    this.processUpdateRegister(apState.resultAPI);
                    this.appStore.dispatch(setAPIStatus({ apiStatus: { apiResponseMessage: '', apiStatus: '' } }));
                    //this.router.navigate(['/']);['errors']
                } else {
                    this.processUpdateRegisterErro(apState.resultAPI['errors'])
                }
            }
        });
    }
    processAddRegister(response: ServiceResponse<SpecialtyModel>) {
        CaptureTologFunc('processAddRegister-specialty', response);
        this.serviceResponse = response;
        if (response?.errors?.length == 0) {
            this.modalSuccessAlert();
            this.goBackToList();
        } else {
            this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
        }
    }
    processAddRegisterErro(response: ServiceResponse<SpecialtyModel>) {
        CaptureTologFunc('processAddRegisterErro-specialty', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
    }

    processUpdateRegister(response: ServiceResponse<SpecialtyModel>) {
        CaptureTologFunc('processUpdateRegister-specialty', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<SpecialtyModel>) {
        CaptureTologFunc('processUpdateRegisterErro-specialty', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<SpecialtyModel>) {
        CaptureTologFunc('processLoadRegister-specialty', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
        this.isUpdateRegister = true && !this.isModeViewForm;
    }
    processLoadRegisterErro(response: ServiceResponse<SpecialtyModel>) {
        CaptureTologFunc('processLoadRegisterErro-specialty', response);
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
        };
        let modelEntity = this.registerModel;
        formsElement.controls['description'].setValue(modelEntity?.description);
        formsElement.controls['language'].setValue(modelEntity?.language);
        //this.registerModel_Enable = modelEntity?.enable;
        formsElement.controls['enableOpt'].setValue(modelEntity?.enable);
    }
    isValidFormRolePolicyClaimCode(): boolean {
        let isValid = this.registerForm.get('rolePolicyClaimCode').errors?.required;
        return this.registerForm.controls['rolePolicyClaimCode'].touched
            && this.registerForm.controls['rolePolicyClaimCode'].invalid && isValid;
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
            language: new FormControl('', Validators.required),
            enableOpt: new FormControl(false, Validators.required),
            rolePolicyClaimCode: new FormControl(false, Validators.required),
        });
    }
    getValuesForm() {
        let formElement = this.registerForm;
        this.registerModel = {
            id: this.registerId ? this.registerId : 0,
            description: formElement.controls['description']?.value,
            language: formElement.controls['language']?.value,
            enable: formElement.controls['enableOpt']?.value,//this.registerModel_Enable, 
        }; 
    }
    createEmptyRegister(): void {
        this.registerModel = {
            id: 0,
            description: '',
            language: '',
            enable: false,
        }
    }
    onSelect(selectedValue: string) { 
        //demo
    }
    goBackToList() {
        this.router.navigate(['/administrative/specialty']);
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
    modalErroAlert(msgErro: string, response: ServiceResponse<SpecialtyModel>) {
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