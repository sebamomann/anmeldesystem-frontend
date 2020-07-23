import {FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export function ValidatorUtil() {
}


ValidatorUtil.username = (): ValidatorFn => {
  return (control: FormControl): ValidationErrors => {
    const val = control.value;

    // throw error if not in format and not at least 3 non-digit characters
    return (!val.match(/^([a-z0-9])+([_]?[a-z0-9]+)*$/g)
      || (val.replace(new RegExp('[0-9_]', 'g'), '').length < 3))
      ? {invalidUsername: true}
      : null;
  };
};


ValidatorUtil.displayname = (): ValidatorFn => {
  return (control: FormControl): ValidationErrors => {
    const val = control.value;

    // throw error if not in format and not at least 3 non-digit characters
    return (!val.match(/^([A-Za-z0-9äüöß])+([ ]?[A-Za-z0-9äüöß]+)*$/g)
      || (val.replace(new RegExp('[0-9 ]', 'g'), '').length < 3))
      ? {invalidUsername: true}
      : null;
  };
};


ValidatorUtil.password = (): ValidatorFn => {
  return (control: FormGroup): ValidationErrors => {
    const pass = control.controls.password.value;
    const passVerify = control.controls.passwordVerify.value;

    return (passVerify !== pass)
      ? {mismatch: true}
      : null;
  };
};
