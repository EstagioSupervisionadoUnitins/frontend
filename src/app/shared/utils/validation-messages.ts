export const ValidationMessages: { [key: string]: string | ((params: any) => string) } = {
  required: 'Este campo é obrigatório.',
  email: 'Por favor, insira um endereço de e-mail válido.',
  minlength: (params: any) => `O mínimo de caracteres exigido é ${params.requiredLength}.`,
  maxlength: (params: any) => `O máximo de caracteres permitido é ${params.requiredLength}.`,
  pattern: 'O formato deste campo é inválido.',
  passwordMismatch: 'As senhas inseridas não coincidem.'
};
