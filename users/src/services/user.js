const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');
const ForbiddenError = require('../errors/forbiddenError');
const { getPasswdHash, isValidEmail, isValidPassword } = require('../utils');

module.exports = (app) => {
  const findAll = async (page, filter = {}) => {
    const currentPage = page || 1;
    const pageSize = 12;
    const offset = (currentPage - 1) * pageSize;

    const users = await app.db('users')
      .where(filter)
      .select(['id', 'email', 'lastTimeLogin', 'active'])
      .orderBy('id')
      .limit(pageSize)
      .offset(offset);

    const totalCount = await app.db('users').where(filter).count('id').first();
    const totalResults = parseInt(totalCount.count, 10);

    return { users, totalResults };
  };

  const findOne = (filter = {}) => {
    return app.db('users').where(filter).first();
  };

  const findOneWithoutPassword = async (filter = {}) => {
    const result = await app.db('users')
      .where(filter)
      .select(['id', 'email', 'lastTimeLogin', 'active'])
      .first();
    if (!result) {
      throw new ValidationError('Utilizador nao encontrado');
    }
    return result;
  };

  const save = async (user) => {
    const userBD = await findOne({ email: user.email });
    if (userBD) throw new ValidationError('Email duplicado na Bd');

    const newUser = { ...user };
    delete newUser.confirmPassword;
    newUser.password = getPasswdHash(user.password);

    return app.db('users').insert(newUser, ['id', 'email']);
  };

  const update = async (id, user, userAuths) => {
    const idUser = userAuths.id.toString();

    if (idUser !== id && idUser !== "1") {
      throw new ForbiddenError('Não tem autorização para editar outro utilizador');
    }
    if (user !== undefined && Object.keys(user).length > 0) {
      const resultado = await findOne({ id });
      if (!resultado) {
        throw new ValidationError('Utilizador não encontrado');
      }

      const updateUser = resultado;
      if (user.newEmail) {
        if (!isValidEmail(user.newEmail)) {
          throw new ValidationError('O email deve ser válido');
        }
        const userBD = await findOne({ email: user.newEmail });
        if (userBD) throw new ValidationError('Email duplicado na Bd');
        updateUser.email = user.newEmail;
      }

      if (user.newPassword) {
        if (!user.password) {
          throw new ValidationError("A senha atual é obrigatória para alterar a senha.");
        }
        if (!user.confirmNewPassword) {
          throw new ValidationError("O confirmar senha é obrigatório para alterar a senha.");
        }
        if (user.newPassword !== user.confirmNewPassword) {
          throw new ValidationError('A nova password não corresponde à confirmação de password');
        }
      }

      if (user.password && user.newPassword) {
        const oldPassword = user.password;
        const newPassword = user.newPassword;
        if (!bcrypt.compareSync(oldPassword, updateUser.password)) {
          throw new ValidationError('Password antiga inválida');
        }

        if (bcrypt.compareSync(newPassword, updateUser.password)) {
          throw new ValidationError('Password antiga igual a nova');
        }

        if (!isValidPassword(newPassword)) {
          throw new ValidationError('A password deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um dígito e um caractere especial');
        }
        const newPasswordUser = getPasswdHash(newPassword);
        updateUser.password = newPasswordUser;
      }

      if (user.hasOwnProperty("lastTimeLogin")) {
        updateUser.lastTimeLogin = user.lastTimeLogin;
      }

      if (user.hasOwnProperty("active")) {
        updateUser.active = user.active;
      }

      await app.db('users').where({ id }).update(updateUser);

      const userAtualizado = await findOneWithoutPassword({ id });
      return userAtualizado;
    }
    throw new ValidationError('Utilizador não foi atualizado');
  }; // TODO ver isto do admin

  const deleteUser = async (id, userAuths) => {
    const idUser = userAuths.id.toString();

    if (idUser !== id && idUser !== "1") {
      throw new ForbiddenError('Não tem autorização para editar outro utilizador');
    }

    const resultado = await findOne({ id });

    if (!resultado) {
      throw new ValidationError('Utilizador não encontrado');
    }

    const userDeleted = app.db('users').where({
      id,
    }).del();
    return userDeleted;
  }; // TODO ver isto do admin

  return {
    findAll, save, findOne, update, deleteUser, findOneWithoutPassword,
  };
};
