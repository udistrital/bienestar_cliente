import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ValidationService } from '../../../@core/data/validators.service';

@Component({
  selector: 'npx-control-messages',
  template: `<div *ngIf="errorMessage !== null" class="alert alert-danger">{{errorMessage}}</div>`
})
export class ControlMessages {

  @Input() control: FormControl;
  constructor() { }

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
        return ValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
    return null;
  }
}
