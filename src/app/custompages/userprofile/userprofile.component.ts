import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { DataTable, RouteEntity } from 'app/models/general/DataTable';
import { UserService } from 'app/services/general/principals/user.service';
import { UserProfileModel } from 'app/models/principalsmodel/UserModel';
import { LanguageService } from 'app/services/general/language.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import swal from 'sweetalert2';
import { GetMsgServiceResponse } from 'app/common/helpers/GetMsgServiceResponse';
import { MedicalModel } from 'app/models/principalsmodel/MedicalModel';
import { AuthService } from 'app/services/auth/auth.service';
import { UserAutenticateView } from 'app/models/usermodels/UserAutenticateView';
import { SimpleGeneralModel } from 'app/models/contracts/SimpleModel';
import { GlobalizationCultureService } from 'app/services/general/simple/globalizationculture.service';
import { GlobalizationTimeZonesService } from 'app/services/general/simple/globalizationtimezone.service';
import { forkJoin } from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'userprofile-cmp',
    templateUrl: 'userprofile.component.html'
})

export class UserProfileComponent implements OnInit {
    serviceResponse: ServiceResponse<UserProfileModel>;
    public dataTable: DataTable;
    entityRoute: RouteEntity;
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: UserProfileModel;
    userLoged: UserAutenticateView;
    public languagesGlobal: SimpleGeneralModel[];
    public timeZonesGlobal: SimpleGeneralModel[];

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        , private fb: FormBuilder
        , @Inject(Router) private router: Router
        , @Inject(LanguageService) private languageService: LanguageService
        , @Inject(UserService) private registerService: UserService
        , @Inject(AuthService) private authService: AuthService
        , @Inject(GlobalizationCultureService) private globalizationCultureService: GlobalizationCultureService
        , @Inject(GlobalizationTimeZonesService) private globalizationTimeZonesService: GlobalizationTimeZonesService
    ) {
        this.gerateFormRegister();
    }
    ngOnInit() {
        this.languageService.loadLanguage();
        this.loadGlobalization();
        this.loadFormRegister();
        if (this.registerId)
            this.loadRegister();
    }
    ngAfterViewInit() {
    }

    loadGlobalization() {
        /*
                let request1 = this.globalizationCultureService.getAll();
                let request2 = this.globalizationTimeZonesService.getAll();
                forkJoin([request1, request2]).subscribe(results => {
                    this.languagesGlobal = results[0]['data'];
                    this.timeZonesGlobal = results[1]['data']; 
                });
        */
        this.globalizationCultureService.getAll().subscribe({
            next: (response: SimpleGeneralModel[]) => { this.languagesGlobal = response; }, error: (err) => { console.log(err); },
        });
        this.globalizationTimeZonesService.getAll().subscribe({
            next: (response: SimpleGeneralModel[]) => { this.timeZonesGlobal = response; }, error: (err) => { console.log(err); },
        });
    }

    loadFormRegister() {
        let formsElement = this.registerForm;
        let paramsUrl = this.route.snapshot.paramMap;
        //formsElement.controls['description'].disable(); 
        this.userLoged = this.authService.getLocalStorageUser();
        this.registerId = this.userLoged.id;
    }
    loadRegister() {
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<UserProfileModel>) => { this.processLoadRegister(response); }, error: (err) => { this.processLoadRegisterErro(err); },
        });
    }
    updateRegister() {
        this.getValuesForm();
        this.registerService.updateProfile(this.registerModel).subscribe({
            next: (response: ServiceResponse<UserProfileModel>) => { this.processUpdateRegister(response); }, error: (err) => { this.processUpdateRegisterErro(err); },
        });

    }
    processUpdateRegister(response: ServiceResponse<UserProfileModel>) {
        CaptureTologFunc('processUpdateRegister-specialty', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<UserProfileModel>) {
        CaptureTologFunc('processUpdateRegisterErro-specialty', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<UserProfileModel>) {
        CaptureTologFunc('processLoadRegister-specialty', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
    }
    processLoadRegisterErro(response: ServiceResponse<UserProfileModel>) {
        CaptureTologFunc('processLoadRegisterErro-specialty', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.load.title'), response);
    }
    fillFieldsForm(): void {
        let responseData: any = this.serviceResponse?.data;
        let formsElement = this.registerForm;
        this.registerModel = {
            id: responseData?.id,
            medicalId: responseData?.medicalId,
            email: responseData?.email,
            name: responseData?.name,
            password: responseData?.password,
            language: responseData?.language,
            timeZone: responseData?.timeZone,
            medical: responseData?.medical,
        };
        let modelEntity = this.registerModel;  
        //User
        formsElement.controls['email'].setValue(modelEntity?.email);
        formsElement.controls['name'].setValue(modelEntity?.name);
        formsElement.controls['password'].setValue(modelEntity?.password);
        formsElement.controls['language'].setValue(modelEntity?.language);
        formsElement.controls['timeZone'].setValue(modelEntity?.timeZone);  
    }
    isValidFormEmail(): boolean {
        let isValid = this.registerForm.get('email').errors?.required;
        return this.registerForm.controls['email'].touched && this.registerForm.controls['email'].invalid && isValid;
    }
    isValidFormName(): boolean {
        let isValid = this.registerForm.get('name').errors?.required;
        return this.registerForm.controls['name'].touched && this.registerForm.controls['name'].invalid && isValid;
    }
    isValidFormPassword(): boolean {
        let isValid = this.registerForm.get('password').errors?.required;
        return this.registerForm.controls['password'].touched && this.registerForm.controls['password'].invalid && isValid;
    }
    isValidFormLanguage(): boolean {
        let isValid = this.registerForm.get('language').errors?.required;
        return this.registerForm.controls['language'].touched && this.registerForm.controls['language'].invalid && isValid;
    }
    isValidFormTimeZone(): boolean {
        let isValid = this.registerForm.get('timeZone').errors?.required;
        return this.registerForm.controls['timeZone'].touched && this.registerForm.controls['timeZone'].invalid && isValid;
    }
    gerateFormRegister() {
        this.registerForm = this.fb.group({
            id: new FormControl(),
            name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            email: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
            password: new FormControl(),
            language: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
            timeZone: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            medicalId: new FormControl(),
        });
    }
    getValuesForm() {
        let formElement = this.registerForm;
        let medicalUpdate: MedicalModel;
        //medicalUpdate.id = 1;
        //medicalUpdate.accreditation = formElement?.controls['accreditation']?.value;
        this.registerModel = {
            id: this.registerId ? this.registerId : 0,
            name: formElement?.controls['name']?.value,
            email: formElement?.controls['email']?.value,
            password: formElement?.controls['password']?.value,
            language: formElement?.controls['language']?.value,
            timeZone: formElement?.controls['timeZone']?.value,
            // medical: medicalUpdate,
        };
    }
    createEmptyRegister(): void {
        this.registerModel = {
            id: 0,
            name: '',
            email: '',
            password: '',
            language: '',
            timeZone: '',
        }
    }
    onSelect(selectedValue: string) {
        //demo
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
    modalErroAlert(msgErro: string, response: ServiceResponse<UserProfileModel>) {
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
