const App = require('../src/App');
const request = require('supertest');

describe('user routes', () => {
    let token;
    it('is possible register a user?', async () => {
        const response = await request(App).post('/register').send({
            name: "td",
            email: "td1@gmail.com",
            password: "test"
        });

        expect(response.ok).toBeTruthy();
        expect(response.body).toHaveProperty('token')
        expect(response.body).toHaveProperty('user')
        let user = response.body;
        token = user.token;
    });

    it('is possible login a user?', async () => {
        const response = await request(App).post('/login').send({
            email: "td1@gmail.com",
            password: "test"
        });
        expect(response.ok).toBeTruthy();
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        let user = response.body;
        token = user.token;
    });

    it('is possible modify a user?', async () => {
        const response = await request(App).put('/').set('access-token', token).send({
            name: "td modify",
            email: "nn@gmai.com"
        });
        expect(response.status).toBe(200);
    });

    it('is possible modify a password?', async () => {
        const response = await request(App).patch('/password').set('access-token', token).send({ password: "22134433" });
        expect(response.status).toBe(200);
    });

    it('is possible delete a user?', async () => {
        const response = await request(App).delete('/').set('access-token', token);
        expect(response.status).toBe(200);
    });
});