import { Router } from 'express';
import LoginProcess from '../auth/log-in.mjs';

const router = Router();
const loginProcess = new LoginProcess();

router.get('/step1', async (req, res) => {
    console.log(req.query.tel + ' запросил авторизацию');
    const promise = await loginProcess.loginStep1(req.query.tel);
    if (promise.data.ReturnCode !== 0) {
        res.json({ message: promise.data['ReturnText'] });
    }
    const login = promise.data['Answer'].login;
    const ibsession = promise.headers['set-cookie'][0].split(';')[0];
    if (login) {
        res.status(200);
        res.json({
            message: 'СМС отправлено на номер ' + req.query.tel,
            success: true,
            login,
            ibsession,
        });
    }
});

router.get('/step2', async (req, res) => {
    const promise = await loginProcess.loginStep2({
        code: req.query.code,
        ibsession: req.query.ibsession,
    });
    const password = promise?.data['Answer'];
    if (password) {
        res.status(200);
        res.json({
            password,
            success: true,
        });
    } else {
        res.json({
            success: false,
            message: promise.data.ReturnText,
        });
    }
});

export default router;