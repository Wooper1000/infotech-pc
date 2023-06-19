import axios from "axios"
import {encode} from 'js-base64'

const instance = axios.create({
    baseURL: "https://ext.obit.ru/crm/hs/extaccess/",
    headers: {
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/octet-stream",
        MobAppName: "0JjQvdGE0L7QotC10YUNCg==",
        MobAppVersion: "0.3.90",
        'User-Agent': '1C+Enterprise/8.3',
        Host: 'ext.obit.ru',
        Connection: 'keep-alive',
    }
})
const setupInstance = (authData) => {
    let login = decodeURIComponent(authData.login)
    let password = authData.password
    let ibsession = authData.ibsession
    const token = encode(`${login}:${password}`);
    instance.interceptors.response.use((response) => {
        // console.log('Получилось с существующей сессией')
        return response
    }, async function (error) {
        const originalRequest = error.config;
        if(originalRequest){
            originalRequest.headers['Cookie'] = ibsession
        }
        return await axios(originalRequest)
            .then(result=>{
                console.log('Используем полученную куку',originalRequest.headers.Cookie);
                if(result.data.ReturnCode!==0) throw new Error
                return result})
            .catch(async err=> {
                originalRequest.headers['Cookie']=null
                originalRequest.headers['Authorization'] = `Basic ${token}`
                originalRequest.headers['IBSession'] = 'start'
                return await axios(originalRequest)
                    .then(result=>{
                        let cookie = result.headers?.['set-cookie'][0].split(';')[0]
                        instance.defaults.headers.common['Cookie'] = cookie
                         console.log('Получили новый КУКИ ',cookie);
                        return axios(originalRequest)
                    }).catch(err=>console.log(err))
            })
    })
    return instance
};

export default setupInstance