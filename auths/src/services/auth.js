const axios = require('axios');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');
const { isValidEmail, isValidPassword } = require('../utils');

const expiresIn = Date.now() + (24 * 60 * 60 * 1000);

module.exports = () => {
  const createUser = async (user) => {
    if (!user.email) {
      throw new ValidationError('O email é um atributo obrigatório');
    } else if (!isValidEmail(user.email)) {
      throw new ValidationError('O email deve ser válido');
    }

    if (!user.password) {
      throw new ValidationError('A password é obrigatória');
    } else if (!isValidPassword(user.password)) {
      throw new ValidationError('A password deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um dígito e um caractere especial');
    }

    if (user.password !== user.confirmPassword) {
      throw new ValidationError('A password não corresponde à confirmação de password.');
    }

    const result = await axios.post('http://localhost:3000/users/signup', user);
    if (!result) {
      throw new ValidationError('Erro ao criar Utilizador');
    }
    return result;
  };

  const login = async (reqUser) => {
    if (!reqUser.email || !reqUser.password) {
      throw new ValidationError('Tem de preencher os dados de login');
    }

    // Chama o serviço de users para verificar o usuárioapp.services.auth.createUser(req.body)
    const result = await axios.get(`http://localhost:3000/users/signin/email/${reqUser.email}`);
    const user = result.data;

    if (!user) {
      throw new ValidationError('Autenticação inválida!');
    }
    if (user.active === false) {
      throw new ValidationError('Utilizador Inativado!');
    }
    

    // Verifica se a senha está correta
    if (bcrypt.compareSync(reqUser.password, user.password)) {
      const payload = {
        id: user.id,
        email: user.email,
      };

      const privateKey = process.env.PRIVATE_KEY;
      const token = jwt.encode(payload, privateKey, 'HS256', { expiresIn });
      return { token, payload };
    }
    throw new ValidationError('Autenticação inválida!');
  };
  return { createUser, login };
};
