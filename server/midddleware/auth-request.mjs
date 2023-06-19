import axios from "axios"
import fs from 'fs'

const instance = axios.create({
    baseURL: "https://ext.obit.ru/crm/hs/extaccess/",
    headers: {
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/octet-stream",
        MobAppName: "0JjQvdGE0L7QotC10YUNCg==",
        MobAppVersion: "0.3.89",
        'User-Agent': '1C+Enterprise/8.3',
        Host: 'ext.obit.ru',
        Connection: 'keep-alive',
    }
})
instance.interceptors.response.use((response) => {
    // console.log('Получилось с существующей сессией')
    return response
}, async function (error) {
    const originalRequest = error.config;
    let ibSessionPath = './config/ibSession'
    if(originalRequest){
        originalRequest.headers['Cookie'] = fs.readFileSync(ibSessionPath, "utf-8")
            }
        return await axios(originalRequest)
        .then(result=>{
            // console.log('Используем полученную куку',originalRequest.headers.Cookie);
            return result})
        .catch(async err=> {
            originalRequest.headers['Cookie']=null
            originalRequest.headers['Authorization'] = 'Basic 0KjQsNCx0LDQvdGB0LrQuNC50JTQkjphV0hSQ09scjh6'
            originalRequest.headers['IBSession'] = 'start'
            return await axios(originalRequest)
                .then(result=>{
                let cookie = result.headers?.['set-cookie'][0].split(';')[0]
                instance.defaults.headers.common['Cookie'] = cookie
                // console.log('Получили новый КУКИ ',cookie);
                fs.writeFileSync(ibSessionPath, cookie)
                    return axios(originalRequest)
            }).catch(err=>console.log(err.response.data))
        })
})
export default instance