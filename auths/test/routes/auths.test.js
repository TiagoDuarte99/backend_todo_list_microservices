const request = require('supertest');
const app = require('../../src/app');

//TODO ACABAR ISTO

beforeAll(async () => {
  await app.services.user.save({
    email: mail,
    password: 'A12345a!',
    confirmPassword: 'A12345a!',
  });
});

// Remover o usuário no final
afterAll(async () => {
  await app.db('users').where({ email: mail }).del();
});

let mail = `au${Date.now()}@ipca.pt`;

test('Teste auths #1 - Receber token ao autenticar Freelancer já criado', () => {
  return request(app).post('/signin')
    .send({ email: 'tiago_10@gmail.com', password: 'Abc/1234' })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Teste auths #2 - Login a enviar os dados a null', () => {
  return request(app).post('/signin')
    .send({
      email: null,
      password: null,
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Tem de preencher os dados de login');
    });
});

test('Teste auths #2 - Receber token ao autenticar', () => {
  return app.services.user.save(
    { email: mail, password: 'A12345a!', confirmPassword: 'A12345a!' },
  ).then(() => request(app).post('/signin')
    .send({ email: mail, password: 'A12345a!', confirmPassword: 'A12345a!' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Teste auths #3 - Tentativa autenticação errada', () => {
  mail = `au${Date.now()}@ipca.pt`;
  return app.services.user.save(
    { email: mail, password: 'A12345a!', confirmPassword: 'A12345a!' },
  ).then(() => request(app).post('/signin')
    .send({ email: mail, password: '123435', confirmPassword: 'A12345a!' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação inválida!');
    });
});

test('Teste auths #4 - Tentativa autenticação de utilizador que nao existe', () => {
  mail = `au${Date.now()}@ipca.pt`;
  return request(app).post('/signin')
    .send({ email: mail, password: '213123', confirmPassword: 'A12345a!' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação inválida!');
    });
});

test('Teste auths #5 - Tentativa autenticação com utilizador inativo', () => {
  mail = `au${Date.now()}@ipca.pt`;
  return app.services.user.save(
    {
      email: mail, password: 'A12345a!', confirmPassword: 'A12345a!', active: false,
    },
  ).then(() => request(app).post('/signin')
    .send({
      email: mail, password: 'A12345a!', confirmPassword: 'A12345a!', active: false,
    }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Utilizador Inativado!');
    });
});

/* test('Teste auths #6 - Aceder a rotas protegidas', () => {
  return request(app).get('/users')
    .then((res) => {
      expect(res.status).toBe(401);
    });
}); */
