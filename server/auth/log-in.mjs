import axios from "axios";
import fs from "fs";

function generateUUID() {
    let uuid = "";
    const chars = "abcdef0123456789";
    const sections = [8, 4, 4, 4, 12];

    for (let i = 0; i < sections.length; i++) {
        for (let j = 0; j < sections[i]; j++) {
            uuid += chars[Math.floor(Math.random() * chars.length)];
        }
        if (i < sections.length - 1) {
            uuid += "-";
        }
    }
    return uuid;
}

class LoginProcess {
    constructor() {
        this.credentials = {
            phone: null,
            login: null,
            password: null,
            id:generateUUID()
        };
    }

    async loginStep1(phone) {
        console.log(this.credentials.id)
        this.credentials.phone = phone;
        try {
            const response = await instance.get(
                `/autorize/step1?app=%D0%98%D0%BD%D1%84%D0%BE%D0%A2%D0%B5%D1%85&phone=${phone}&id=${this.credentials.id}`,
                {
                    headers: {
                        ibsession: "start",
                        authorization: "Basic d3NfZXh0Z3Vlc3Q6ZXh0Z3Vlc3Rmcm9tTW9iaWxlQVBQ",
                    },
                }
            );
            const { data } = response;
            if (data.ReturnCode === 0) {
                this.credentials.login=data.Answer.login;
                this.credentials.user=data.Answer.user
                return response;
            }
            else{
                console.log(data)
                return response
            }
        } catch (err) {
            console.log(err);
        }
    }

    async loginStep2(codeData) {
        try {
            const response = await instance.get(
                `autorize/step2?app=%D0%98%D0%BD%D1%84%D0%BE%D0%A2%D0%B5%D1%85&tempCode=${codeData.code}&id=${this.credentials.id}&user=${encodeURIComponent(this.credentials.user)}`,
                {
                    headers: {
                        ibsession: "use",
                        cookie: codeData.ibsession,
                    },
                }
            );
            const { data } = response;
            if (data.ReturnCode === 0) {
                this.credentials.password = data.Answer;
                const existingCredentials = JSON.parse(fs.readFileSync('./auth/passwords.json', 'utf8'));
                const existingUser = existingCredentials.users.find(user => user.phone === this.credentials.phone);
                if (existingUser) {
                    existingUser.login = this.credentials.login;
                    existingUser.password = this.credentials.password;
                } else {
                    existingCredentials.users.push(this.credentials);
                    console.log('Добавлен новый пользователь ',this.credentials.login)
                }
                fs.writeFileSync('./auth/passwords.json', JSON.stringify(existingCredentials, null, 2))
                return response;
            }
            else {
                console.log(data)
                return response
            }

        } catch (err) {
            console.log(err);
        }
    }
}

const instance = axios.create({
    baseURL: "https://ext.obit.ru/crm/hs/extaccess/",
    headers: {
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/octet-stream",
        MobAppName: "0JjQvdGE0L7QotC10YUNCg==",
        MobAppVersion: "0.3.90",
        "User-Agent": "1C+Enterprise/8.3",
        Host: "ext.obit.ru",
        Connection: "keep-alive",
    },
});

export default LoginProcess;