import {Pipe, PipeTransform} from '@angular/core';

/**
 * EXAMPLE
 *
 * {{ nameForm.get('field').errors | errorMessage:"Name Field" }}
 */

const validationMessages = {
  required: {
    message: '{label} es requerido.'
  },
  email: {
    message: 'Formato de {label} no válido.'
  },
  minlength: {
    message: '{label} debería contener al menos {requiredLength} caracter(es).',
    rExp: 'requiredLength'
  },
  maxlength: {
    message: '{label} debería contener como máximo {requiredLength} caracter(es).',
    rExp: 'requiredLength'
  },
  pattern: {
    message: '{label} tiene un formato inválido.'
  }
};

@Pipe({name: 'errorMessage'})
export class ErrorMessagePipe implements PipeTransform {

  transform(errors: any, label: string): string|null {
    if (errors === null) {
      return '';
    }

    for (const error in errors) {

      if (validationMessages[error] !== undefined) {

        let message = validationMessages[error].message.replace('{label}', label);

        if (validationMessages[error].rExp !== undefined) {

          const extraTexts = validationMessages[error].rExp.split('|');

          for (let index in extraTexts) message = message.replace(`{${extraTexts[index]}}`, errors[error][extraTexts[index]]);

        }

        return message;

      } else {

        return typeof errors[error] === 'string' ? errors[error] : JSON.stringify(errors[error]);

      }

    }

  }
}
