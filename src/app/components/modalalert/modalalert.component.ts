import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import swal from 'sweetalert2';
import { LanguageService } from 'app/services/general/language.service';
import { ModalData } from 'app/models/general/ModalData';

declare var $: any;
@Component({
  selector: 'custom-modalalert',
  templateUrl: './modalalert.component.html'
})

export class ModalAlertComponent implements OnInit {
  @Input() modalData: ModalData;
  //@Input() event: EventEmitter<any>;
  @Output() eventCallBackSuccess = new EventEmitter<void>();
  //@Output() meuEvento: EventEmitter<() => void> = new EventEmitter<() => void>();

  constructor(private languageService: LanguageService) { }

  ngAfterViewInit() {
    this.callShowModal();
  }
  ngOnInit() {

  }
  private callShowModal() {
    let dataAlert = this.modalData;
    if (dataAlert.show && dataAlert.typeModal === 'Success') {
      this._showSuccessAlert();
    }
  } 
  public ShowModalAlertSuccess() {
    this._showSuccessAlert();
  }

  private _showSuccessAlert() {
    swal
      .fire({
        title: this.getTranslateInformationAsync('modalalert.saved.title'),
        text: this.getTranslateInformationAsync('modalalert.saved.text'),
        timer: 5000,
        buttonsStyling: false,
        customClass: {
          confirmButton: 'btn btn-fill btn-success'
        },
        icon: 'success'
      })
      .then(() => {
        this.eventCallBackSuccess.emit();
      });
  }



  getTranslateInformationAsync(key: string): string {
    let result = this.languageService.translateInformationAsync([key])[0];
    return result;
  }
}