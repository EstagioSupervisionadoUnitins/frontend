import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl } from '@angular/forms';
import { ValidationMessages } from '../../utils/validation-messages';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (errorMessage()) {
      <small class="text-red-500 text-xs font-semibold mt-1 ml-1 block animate-fade-in">
        {{ errorMessage() }}
      </small>
    }
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-3px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fadeIn 0.15s ease-out forwards;
    }
  `]
})
export class FormError {
  control = input<AbstractControl | null>(null);

  errorMessage(): string | null {
    const ctrl = this.control();
    if (ctrl && ctrl.errors && (ctrl.touched || ctrl.dirty)) {
      const firstErrorKey = Object.keys(ctrl.errors)[0];
      const getMessage = ValidationMessages[firstErrorKey];
      if (typeof getMessage === 'function') {
        return getMessage(ctrl.errors[firstErrorKey]);
      }
      return getMessage || 'Campo inválido.';
    }
    return null;
  }
}
export default FormError;
