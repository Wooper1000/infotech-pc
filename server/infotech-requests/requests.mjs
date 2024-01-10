import instance from "../midddleware/auth-request.mjs";
import dateFormat from "dateformat";
import equipmentSchedule from "../equipmentTable/equipment.json" assert { type: "json" };
import axios from "axios";
import parser from '../2gis/parser.mjs'
export const test = async ()=>{
    let response = await instance.get(`Services/get?format=v2`)
    return response?.data['Answer']
}
export const getJobList = async () => {
    try{
        let response = await instance.post(`joblist/get`);
        return response?.data['Answer'];
    }
   catch (e){
       console.log(e.data.exception)
   }
};


export const getTicket = async (order)=>{
let response = await instance.get(`Tickets/get?number=${order}`)
    return response?.data['Answer']
}
export const makeCall = async (key)=>{
let response = await instance.get(`/call/ticket?Key=${key}`)
    console.log('Звоним ',key)
    return response?.data
}
export const getPortsListByObit = async (obit)=>{
    try {
        let response = await instance.get(`/netobject/get_sw_ports?obitnumber=OBIT-${obit}`)
        return response?.data['Answer']
    }
    catch (err){
        console.log(err)
        return err
    }
}
export const getPortsListWithDescriptionByObit = async (obit)=>{
    try {
        let response = await instance.get(`netobject/telem_srv?act=get_sw_report&obitnumber=OBIT-${obit}`)
        return response?.data['Answer']
    }
    catch (err){
        console.log(err)
        return err
    }
}
export const getCabdiagByObitAndPort = async (obit,port)=>{
        let response =  await instance.get(`netobject/telem_srv?obitnumber=OBIT-${obit}&act=cab_diag&port=${port}`)
        return response?.data['Answer']

}
export const getAddressUid = async (uid)=>{
    let promise = await instance.post(`/addresses/getbyphaddress?full&uid=${uid}`).catch(err=>console.log('Ошибка получения UID',uid))
    return {
        uid: promise?.data['Список'][0]['Ссылка'],
        name: promise?.data['Список'][0]['Наименование'],
        street: promise?.data['Список'][0]['Улица'],
        home: promise?.data['Список'][0]['Дом'],
        additionalInfo: promise?.data['Список'][0]['ДопДанные'],
        coordinates: {lon:promise?.data['Список'][0]['Долгота'],lat:promise?.data['Список'][0]['Широта']}
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
    return promise?.data['Answer']
}
export const getOrderIP = async (order) => {
    let promise =  await instance.get(`tickets/getsettings?number=${order}`)
    return promise?.data?.['Answer']?.data
}
export const getContractStatus = async (contracts) => {
    let promise =  await instance.post(`home/contractstatus`,contracts)
    return promise?.data['Answer']
}
export const getContractInfo = async (contract) => {
    let promise =  await instance.get(`Tickets/FillByContract?number=${contract}`).catch(err=>console.log(err))
    return promise?.data['Answer']
}
export const getReport = async (start,finish,variant) => {
    let startDate = dateFormat(start, "yyyy-mm-dd") + "T00:00:00"
    let endDate = dateFormat(finish, "yyyy-mm-dd") + "T23:59:59"
    try{
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
        return promise?.data['Answer']
    }
  catch (e){
      console.log(e.data.exception)
  }
}
export const getJobHistory = async(orderNumber) => {
    let promise = await instance.get(`/job/history?number=${orderNumber}`)
    return promise?.data['Answer']
}
export const getFvnoPort = async(portDescription) => {
    let promise = await instance.post(`/netobject/get_fvno_port`,{"PortDesc":portDescription})
    return promise?.data['Answer']
}
export const getEquipmentList = async() => {
    try{
        let promise = await instance.get(`trade/getEquipmentByOrders`)
        let equipmentList =  promise?.data['Answer']
        let activeEquipment = equipmentList
            .filter(equipment=>{
                // return equipmentSchedule.hasOwnProperty(equipment['Номенклатура']['uid'])
                return equipment['Номенклатура'].Parent.Parent.Presentation === 'Сетевое оборудование' || equipment['Номенклатура'].Parent.Presentation === 'МТС'
            })
            .map(equipment=>{
                return {
                    'Заявка':equipment['Заявка'],
                    'СерийныйНомер':equipment['СерийныйНомер'],
                    Presentation:equipment['Номенклатура'].Presentation
                }
            })
        let groupBy = function(xs, key) {
            return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
            }, {});
        };
        return groupBy(activeEquipment,'Presentation')
    }
    catch (e){
        console.log(e.exception)
    }



}
export const getAddressStructure = async(addressUid)=>{
    let coordinates = null
    let address = null
    try{
        let response = await getAddressUid(addressUid)
        coordinates = response.coordinates
        address = response.street +' '+response.home
    }
  catch (e) {
      return console.log(e)
  }
    try {
        let response = await parser.getAddrInfo(coordinates.lat,coordinates.lon,address)
       if(response.status === 'ok'){
           return {data:response.lounges,status:200}
       }
        else {
            return {data:'Ошибочка вышла при запросе к 2gis внутри requests.mjs',status:404}
       }
    }
    catch (error){
        console.log('Ошибка запроса к серверу gis у романа на сервере',error)
        return error
    }
}
