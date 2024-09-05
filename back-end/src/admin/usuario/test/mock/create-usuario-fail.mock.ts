export const createUsuarioFail = {
  idkey_tipo_usuario: 1,
  email: 'test@test.com',
  // Faltando a senha
};

export const createUsuarioFailPassword = {
  idkey_tipo_usuario: 1,
  email: 'test@test.com',
  password: '12345', 
  // Senha com menos de 6 caracteres
};
