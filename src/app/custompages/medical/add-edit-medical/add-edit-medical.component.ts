import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceResponse } from 'app/models/ServiceResponse';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
import { CaptureTologFunc } from 'app/common/errohandler/app-error-handler';
import { GetMsgServiceResponse } from 'app/common/helpers/GetMsgServiceResponse';
import { botaoAnimado } from 'app/common/animations/geral-trigger-animation';
import { MedicalModel } from 'app/models/principalsmodel/MedicalModel';
import { MedicalService } from 'app/services/general/principals/medical.service';
import { OfficeService } from 'app/services/general/simple/office.service';
import { OfficeModel } from 'app/models/simplemodel/OfficeModel';
import { ETypeAccreditationOptions } from 'app/common/enuns/etypeaccreditation-options';
import { SpecialtyService } from 'app/services/general/simple/specialty.service';
import { SpecialtyModel } from 'app/models/simplemodel/SpecialtyModel';
import { forkJoin } from 'rxjs';
import { LanguageService } from 'app/services/general/language.service';
import { FormHelperCalendar } from 'app/helpers/formHelperCalendar';

declare var $: any;

@Component({
    moduleId: module.id,
    selector: 'add-edit-medical',
    templateUrl: 'add-edit-medical.component.html',
    //styleUrls: ['./gender.component.css']
    animations: [
        botaoAnimado
    ]
})
//5-  a lista
export class AddEditMedicalComponent implements OnInit {
    registerId: number;
    registerForm: FormGroup;
    isUpdateRegister: boolean = false;
    isModeViewForm: boolean = false;
    registerModel: MedicalModel;
    serviceResponse: ServiceResponse<MedicalModel>;
    estadoBotao_goBackToList = 'inicial';
    estadoBotao_addRegister = 'inicial';
    estadoBotao_updateRegister = 'inicial';
    public officesOpts: OfficeModel[];
    public specialtiesOpts: SpecialtyModel[];
    public typeAccreditationOpts = ETypeAccreditationOptions;

    public daysOfWeeksOpts = [
        { value: 0, name: 'Sunday', selected: false },
        { value: 1, name: 'Monday', selected: false },
        { value: 2, name: 'Tuesday', selected: false },
        { value: 3, name: 'Wednesday', selected: false },
        { value: 4, name: 'Thursday', selected: false },
        { value: 5, name: 'Friday', selected: false },
        { value: 6, name: 'Saturday', selected: false }
    ];

    constructor(@Inject(ActivatedRoute) private route: ActivatedRoute
        , private fb: FormBuilder
        , @Inject(Router) private router: Router
        , @Inject(MedicalService) private registerService: MedicalService
        , @Inject(OfficeService) private officeService: OfficeService
        , @Inject(SpecialtyService) private specialtyService: SpecialtyService
        , @Inject(LanguageService) private languageService: LanguageService
    ) {

    }
    ngOnInit() {
        this.languageService.loadLanguage();
        this.gerateFormRegister();
        this.loadOfficesAndSpcialty();
        this.loadFormRegister();
        if (this.registerId)
            this.loadRegister();

        if (this.registerModel?.id)
            this.createEmptyRegister();
    }
    ngAfterContentInit() {
        this.loadBoostrap();

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
    loadOfficesAndSpcialty() {
        let request1 = this.officeService.getAll();
        let request2 = this.specialtyService.getAll();

        forkJoin([request1, request2]).subscribe(results => {
            this.officesOpts = results[0]['data'];
            this.specialtiesOpts = results[1]['data'];
            this.specialtiesOpts.forEach(opt => { opt.selected = false; });
        });
    }
    loadOffices() {
        this.officeService.getAll().subscribe({
            next: (response: any) => { this.officesOpts = response['data']; }, error: (err) => { console.log(err); },
        });
    }
    loadSpecialties() {
        this.specialtyService.getAll().subscribe({
            next: (response: any) => { this.specialtiesOpts = response['data']; }, error: (err) => { console.log(err); },
        });
    }
    loadFormRegister() {
        let formsElement = this.registerForm;
        let paramsUrl = this.route.snapshot.paramMap;
        this.isModeViewForm = paramsUrl.get('modeForm') === 'view';
        if (this.isModeViewForm) {
            formsElement.controls['name'].disable();
            formsElement.controls['email'].disable();
            formsElement.controls['accreditation'].disable();
            formsElement.controls['typeAccreditation'].disable();
            formsElement.controls['officeId'].disable();
            formsElement.controls['specialtiesIds'].disable();
            formsElement.controls['enableOpt'].disable();
            formsElement.controls['startWorkingTime'].disable();
            formsElement.controls['endWorkingTime'].disable();
            formsElement.controls['workingDays'].disable();
            formsElement.controls['patientIntervalTimeMinutes'].disable();
        }
        this.registerId = Number(paramsUrl.get('id'));
    }
    ngAfterViewInit() {
    }
    loadRegister() {
        this.registerService.getById(this.registerId).subscribe({
            next: (response: ServiceResponse<MedicalModel>) => { this.processLoadRegister(response); }, error: (err) => { this.processLoadRegisterErro(err); },
        });
    }
    addRegister() {
        this.getValuesForm();
        this.registerService.add(this.registerModel).subscribe({
            next: (response: ServiceResponse<MedicalModel>) => { this.processAddRegister(response); }, error: (err) => { this.processAddRegisterErro(err); },
        });
    }
    updateRegister() {
        this.getValuesForm();
        this.registerService.update(this.registerModel).subscribe({
            next: (response: ServiceResponse<MedicalModel>) => { this.processUpdateRegister(response); }, error: (err) => { this.processUpdateRegisterErro(err); },
        });
    }
    processAddRegister(response: ServiceResponse<MedicalModel>) {
        CaptureTologFunc('processAddRegister-Medical', response);
        this.serviceResponse = response;
        if (response?.errors?.length == 0) {
            this.modalSuccessAlert();
            this.goBackToList();
        } else {
            this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
        }

    }
    processAddRegisterErro(response: ServiceResponse<MedicalModel>) {
        CaptureTologFunc('processAddRegisterErro-Medical', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erro'), response);
    }

    processUpdateRegister(response: ServiceResponse<MedicalModel>) {
        CaptureTologFunc('processUpdateRegister-Medical', response);
        this.serviceResponse = response;
        this.modalSuccessAlert();
    }
    processUpdateRegisterErro(response: ServiceResponse<MedicalModel>) {
        CaptureTologFunc('processUpdateRegisterErro-Medical', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.saved.erroupdate'), response);
    }

    processLoadRegister(response: ServiceResponse<MedicalModel>) {
        CaptureTologFunc('processLoadRegister-Medical', response);
        this.serviceResponse = response;
        this.fillFieldsForm();
        this.isUpdateRegister = true && !this.isModeViewForm;
    }
    processLoadRegisterErro(response: ServiceResponse<MedicalModel>) {
        CaptureTologFunc('processLoadRegisterErro-Medical', response);
        this.modalErroAlert(this.gettranslateInformationAsync('modalalert.load.title'), response);
    }
    fillFieldsForm(): void {
        let responseData: MedicalModel = this.serviceResponse?.data;
        let formsElement = this.registerForm;
        this.registerModel = {
            id: responseData?.id,
            name: responseData?.name,
            email: responseData?.email,
            accreditation: responseData?.accreditation,
            typeAccreditation: responseData?.typeAccreditation,
            officeId: responseData?.office?.id,
            specialtiesIds: responseData?.specialties.map(ent => Number(ent.id) ?? null),
            enable: responseData?.enable,
            startWorkingTime: responseData?.startWorkingTime,
            endWorkingTime: responseData?.endWorkingTime,
            workingDays: responseData?.workingDays,
            patientIntervalTimeMinutes: responseData?.patientIntervalTimeMinutes,
        };
        let modelEntity = this.registerModel;
        formsElement.controls['name'].setValue(modelEntity?.name);
        formsElement.controls['email'].setValue(modelEntity?.email);
        formsElement.controls['accreditation'].setValue(modelEntity?.accreditation);
        formsElement.controls['typeAccreditation'].setValue(modelEntity?.typeAccreditation);
        formsElement.controls['officeId'].setValue(modelEntity?.officeId);
        formsElement.controls['enableOpt'].setValue(modelEntity?.enable);
        formsElement.controls['startWorkingTime'].setValue(modelEntity?.startWorkingTime);
        formsElement.controls['endWorkingTime'].setValue(modelEntity?.endWorkingTime);
        formsElement.controls['patientIntervalTimeMinutes'].setValue(modelEntity?.patientIntervalTimeMinutes);

        //todo:ver como melhorar isso precisarei carregar os compos via store do redux antes de gerar o html 
        setTimeout(() => { this.setSpecialtiesOptsChecked(modelEntity); }, 500);
        setTimeout(() => { this.setWorkingDaysOptsChecked(modelEntity); }, 500);

        this.registerForm.patchValue({
            ...modelEntity,
            startWorkingTime: this.formatTime(modelEntity.startWorkingTime),
            endWorkingTime: this.formatTime(modelEntity.endWorkingTime)
        }); 
    }

    formatTime(time: string): string {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    }

    isValidFormName(): boolean {
        let isRequired = this.registerForm.get('name').errors?.required;
        return this.registerForm.controls['name'].touched && this.registerForm.controls['name'].invalid && isRequired;
    }
    isValidFormEmail(): boolean {
        let isRequired = this.registerForm.get('email').errors?.required;
        return this.registerForm.controls['email'].touched && this.registerForm.controls['email'].invalid && isRequired;
    }
    isValidFormTypeAccreditation(): boolean {
        let isRequired = this.registerForm.get('typeAccreditation').errors?.required;
        return this.registerForm.controls['typeAccreditation'].touched && this.registerForm.controls['typeAccreditation'].invalid && isRequired;
    }
    isValidFormAccreditation(): boolean {
        let isRequired = this.registerForm.get('accreditation').errors?.required;
        let formValid = this.registerForm.controls['accreditation'].touched && this.registerForm.controls['accreditation'].invalid && isRequired
        return formValid;
    }
    isValidFormOfficeId(): boolean {
        let isRequired = this.registerForm.get('officeId').errors?.required;
        return this.registerForm.controls['officeId'].touched && this.registerForm.controls['officeId'].invalid && isRequired;
    }
    isValidFormSpecialtiesIds(): boolean {
        let isRequired = this.registerForm.get('specialtiesIds').errors?.required;
        return this.registerForm.controls['specialtiesIds'].touched && this.registerForm.controls['specialtiesIds'].invalid && isRequired;
    }

    isValidFormStartWorkingTime(): boolean {
        const control = this.registerForm.get('startWorkingTime');
        return control && control.invalid && (control.dirty || control.touched);
    }
    isValidFormEndWorkingTime(): boolean {
        const control = this.registerForm.get('endWorkingTime');
        return control && control.invalid && (control.dirty || control.touched);
    }
    isValidFormWorkingDays(): boolean {
        let isRequired = this.registerForm.get('workingDays').errors?.required;
        return this.registerForm.controls['workingDays'].touched && this.registerForm.controls['workingDays'].invalid && isRequired;
    }
    isValidFormPatientIntervalTimeMinutes(): boolean {
        let isRequired = this.registerForm.get('patientIntervalTimeMinutes').errors?.required;
        return this.registerForm.controls['patientIntervalTimeMinutes'].touched && this.registerForm.controls['patientIntervalTimeMinutes'].invalid && isRequired;
    }

    gerateFormRegister() {
        this.registerForm = this.fb.group({
            id: new FormControl<number>(0),
            name: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]),
            email: new FormControl<string>('', [Validators.required, Validators.email, Validators.maxLength(100)]),
            typeAccreditation: new FormControl<number>(null, [Validators.required]),
            accreditation: new FormControl<string>('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]),
            officeId: new FormControl<number>(null, [Validators.required]),//Quando for numerico a validacao deve ser do tipo 
            specialtiesIds: this.fb.array<number>([]),
            enableOpt: new FormControl<boolean>(false, Validators.required),
            startWorkingTime: new FormControl('08:00', [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)]),
            endWorkingTime: new FormControl('18:00', [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/)]),
            workingDays: this.fb.array<number>([]),
            patientIntervalTimeMinutes: new FormControl<number>(null, [Validators.required]),//Quando for numerico a validacao deve ser do tipo 
        });
    }
    getValuesForm() {
        let formElement = this.registerForm;

        this.registerModel = {
            id: this.registerId ? this.registerId : 0,
            name: formElement.controls['name']?.value,
            email: formElement.controls['email']?.value,
            accreditation: formElement.controls['accreditation']?.value,
            typeAccreditation: Number(formElement.controls['typeAccreditation']?.value),
            officeId: Number(formElement.controls['officeId']?.value),
            specialtiesIds: formElement.controls['specialtiesIds']?.value,
            enable: formElement.controls['enableOpt']?.value,
            startWorkingTime: formElement.controls['startWorkingTime']?.value + ":00",
            endWorkingTime: formElement.controls['endWorkingTime']?.value + ":00",
            workingDays: formElement.controls['workingDays']?.value,
            patientIntervalTimeMinutes: formElement.controls['patientIntervalTimeMinutes']?.value
        }; 
    }

    setSpecialtiesOptsChecked(modelEntity): void {
        if (modelEntity?.specialtiesIds) {
            modelEntity?.specialtiesIds.forEach(specialtyId => {
                if (this.specialtiesOpts && this.specialtiesOpts.length > 0) {
                    const specialty = this.specialtiesOpts.find(opt => opt.id === specialtyId);
                    if (specialty) {
                        specialty.selected = true;
                    }
                }
            });
        }
        // Inicializa o FormArray com os valores selecionados
        const specialtiesFormArray = this.registerForm.get('specialtiesIds') as FormArray;
        this.specialtiesOpts.forEach((specialty) => {
            if (specialty.selected) {
                specialtiesFormArray.push(new FormControl(specialty.id));
            }
        });
    }

    setWorkingDaysOptsChecked(modelEntity): void {
        if (modelEntity?.workingDays) {
            modelEntity?.workingDays.forEach(wd => {
                if (this.daysOfWeeksOpts && this.daysOfWeeksOpts.length > 0) {
                    const valueOpt = this.daysOfWeeksOpts.find(opt => opt.value === wd);
                    if (valueOpt) {
                        valueOpt.selected = true;
                    }
                }
            });
        }
        // Inicializa o FormArray com os valores selecionados
        const daysOfWeeksFormArray = this.registerForm.get('workingDays') as FormArray;
        this.daysOfWeeksOpts.forEach((opt) => {
            if (opt.selected) {
                daysOfWeeksFormArray.push(new FormControl(opt.value));
            }
        });
    }

    createEmptyRegister(): void {
        this.registerModel = {
            id: 0,
            name: '',
            email: '',
            accreditation: '',
            typeAccreditation: 0,
            officeId: 0,
            specialtiesIds: [],
            enable: false,
            startWorkingTime: '',
            endWorkingTime: '',
            workingDays: [],
            patientIntervalTimeMinutes: 0
        }
    }
    onSelect(selectedValue: string) {
    }
    goBackToList() {
        this.router.navigate(['/medical/manage/']);
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
    modalErroAlert(msgErro: string, response: ServiceResponse<MedicalModel>) {
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
    onCheckboxChange(e, controlName) {
        const checkArray: FormArray = this.registerForm.get(controlName) as FormArray;
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
        FormHelperCalendar.logFormErrors(this.registerForm);
    }
    getSelectedCheckboxes(controlName) {
        const selectedValues = (this.registerForm.get(controlName) as FormArray).value;
        return selectedValues;
    } 
}