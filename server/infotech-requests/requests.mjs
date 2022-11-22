import instance from "../midddleware/auth-request.mjs";
import fs from "fs";
import dateFormat from "dateformat";

export const getJobList = async ()=>{
let response = await instance.post(`joblist/get`)
    return response.data['Answer']
}
export const getTicket = async (order)=>{
let response = await instance.get(`Tickets/get?number=${order}`)
    return response.data['Answer']
}
export const makeCall = async (key)=>{
let response = await instance.get(`/call/ticket?Key=${key}`)
    console.log('Звоним ',key)
    return response.data
}
export const getAddressUid = async (uid)=>{
    let promise = await instance.post(`/addresses/getbyphaddress?full&uid=${uid}`).catch(err=>console.log('Ошибка получения UID',uid))
    return {
        uid: promise.data['Список'][0]['Ссылка'],
        name: promise.data['Список'][0]['Наименование'],
        street: promise.data['Список'][0]['Улица'],
        home: promise.data['Список'][0]['Дом'],
        additionalInfo: promise.data['Список'][0]['ДопДанные'],
    }
}
export const getContractsByAddress = async (uid,flat)=>{
    let address = {
        "Договор": "",
        "АдресАрендодателя": {
            "uid": uid.uid.toString(),
            "Code": "",
            "Name": uid.name.toString()
        },
        "АдресУлица": uid.street.toString(),
        "АдресДом": uid.home.toString(),
        "АдресЛитера": uid.additionalInfo.find(element => {
            return element['Тип'] === 'Литера'
        }) ? uid.additionalInfo.find(element => {
            return element['Тип'] === 'Литера'
        })['Значение'] : '',
        "АдресКорпус": uid.additionalInfo.find(element => {
            return element['Тип'] === 'Корпус'
        }) ? uid.additionalInfo.find(element => {
            return element['Тип'] === 'Корпус'
        })['Значение'] : '',
        "АдресКвартира": flat.toString()
    }
    let promise = await getClientsByAddress(address)
    return promise
}
export const getClientsByAddress = async (address) => {
    let promise = await instance.post(`/GetClientsByAddress/get`, address).catch(err=>{
        console.log(err)})
    return promise.data['Answer']
}
export const getOrderIP = async (order) => {
    let promise =  await instance.get(`tickets/getsettings?number=${order}`)
    return promise?.data?.['Answer']?.data
}
export const getContractStatus = async (contracts) => {
    let promise =  await instance.post(`home/contractstatus`,{"contracts":contracts})
    return promise.data['Answer']
}
export const getContractInfo = async (contract) => {
    console.log(contract)
    let promise =  await instance.get(`Tickets/FillByContract?number=${contract}`).catch(err=>console.log(err))
    return promise.data['Answer']
}

export const getReport = async (start,finish,variant) => {
    let startDate = dateFormat(start, "yyyy-mm-dd") + "T00:00:00"
    let endDate = dateFormat(finish, "yyyy-mm-dd") + "T23:59:59"
    let promise = await instance.post('Reports/Get', {
        "id": "c2f0ef93-c513-11ea-b976-005056b57a2d",
        "param": {
            "Filter": [],
            "Params": [
                {
                    "id": "d98ea70f-c5d9-4c44-9808-7d98f9971031",
                    "use": true,
                    "value": {
                        "Variant": variant ? variant: "Этотмесяц",
                        "StartDate": startDate,
                        "EndDate": endDate
                    }
                }
            ]
        }
    })
    return promise.data['Answer']
}

