import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import multer from 'multer'
import {
    getAddressUid,
    getContractsByAddress,
    getJobList,
    getOrderIP,
    getTicket,
    makeCall,
    getContractInfo,
    getReport,
    getJobHistory,
    test, getEquipmentList
} from "./infotech-requests/requests.mjs";

import PhotoUploader from "./infotech-requests/Photo-uploader.mjs";




const app = express()
const upload = multer({
    dest: "./photos"
});
app.use(cors())
app.use(bodyParser.json(
    {
        extended: true
        , limit: '50mb'
    }));

const PORT = 3001

app.listen(PORT, () => console.log('App is listening on port ', PORT))
let start = null
app.get('/get-order-list', async (req, res) => {
    start = new Date().getTime()
    let orders = await getJobList()
    res.json(orders)
})
app.post('/get-additional-orders-info', async (req, res) => {
    let orders = req.body
    let ordersWithTickets = await Promise.all(orders.map(async (order) => {
        return {...order, ticket: await getTicket(order['РегистрационныйНомерВСистемеИсточникеЗаявки'])}
    }))
    let ordersWithTicketsAndConfigurations = await Promise.all(ordersWithTickets.map(async (order) => {
        if (order['ТипРабот'] === 'Аварийные работы') {
            return order
        }
        return {...order, configurations: await getOrderIP(order['РегистрационныйНомерВСистемеИсточникеЗаявки'])}
    }))
    console.log('Заняло ',(new Date().getTime() - start) /1000)
    res.json(ordersWithTicketsAndConfigurations)
})
app.get('/make-call', async (req, res) => {
    let promise = await makeCall(req.query.key)
    res.send(promise)
})
app.get('/get-contracts-in-range-of-flats', async (req, res) => {
    const start = new Date().getTime()
    let min = req.query.min
    let max = req.query.max
    let physUid = req.query.uid
    let uid = await getAddressUid(physUid)
    const flatsRange = []
    for (let i = min; i <= max; i++) {
        flatsRange.push(i)
    }
    const findClosedContracts = async (flat, uid) => {
        return new Promise((resolve, reject) => {
            getContractsByAddress(uid, flat).then( async contracts => {
                if (contracts) {
                    let activeContract = null
                    let disabledContractTelephone = null
                    let disabled = false
                    let isCableAvailable = !!(contracts.length && !contracts.filter(contract => {
                        return (contract['Значение']['Status'] === 'Активен')
                    }).length)
                    let isActive = !!contracts.filter(contract => {
                        if (contract['Значение']['Status'] === 'Активен' && contract['Значение']['Number'].match(/^\d+$/)) activeContract = contract['Значение']['Number']
                        return (contract['Значение']['Status'] === 'Активен')
                    }).length
                    if (isActive && activeContract) {
                        let activeContractInfo = await getContractInfo(activeContract)
                        if (activeContractInfo['СтатусДоговора'] === 'Отключен по задолженности более 30 дней') {
                            disabled = true
                            disabledContractTelephone=activeContractInfo['КИ'].find(type=>type['Вид']==='Телефон')['Представление']
                        }
                    }
                    if (contracts.length) {
                        resolve({
                            msg: `В ${flat} было ${contracts.length} договоров. ${disabled ? 'Задолжность' : isActive ? 'Активна' : 'Отключена'}`,
                            isActive,
                            disabled,
                            isCableAvailable,
                            disabledContractTelephone,
                            flat, contracts: contracts
                        })
                    } else if (contracts) {
                        resolve({msg: `В ${flat} не было договора`, isActive, isCableAvailable, flat})
                    } else reject(`Ошибочка вышла во время запроса квартиры ${flat}`)
                } else reject('Ошибка запросов')
            })
        }).catch(err => console.log(`Ошибочка вышла во время запроса квартиры ${flat}`))
    }




    let promises = []
    flatsRange.forEach(flat => {
        promises.push(findClosedContracts(flat, uid))
    })
    Promise.all(promises).then(resolves => {
    res.json(resolves)
    })

})
app.get('/get-test-ip', async (req, res) => {
})
app.post('/upload-photo', upload.array('files', 10), async (req, res) => {
    console.log('Зашёл в обработчик фото')
    let result = await PhotoUploader.uploadPhotos(req.files, req.query.uid)
    res.json(result)
})
app.get('/get-report', async (req, res) => {
    let report = await getReport(req.query.start,req.query.finish,req.query.variant)
    let buff = new Buffer(report, 'base64');
    let text = buff.toString('utf8');
    res.send(text.split('{16,')[20].split(',')[4].replace(/[^0-9]/g, ""))
})
app.get('/get-job-history', async (req, res) => {
    let history = await getJobHistory(req.query['order-number'])
    res.send(history)
})
app.get('/get-equipment-list', async (req, res) => {
    let equipment = await getEquipmentList()
    res.send(equipment)
})



app.get('/test', async (req, res) => {
    console.log('Получили запрос на получение заявок')
   setTimeout(()=> {
       console.log('отдаём заявки')
       res.json('Выполнили запрос заявок')
   },10000)
})
    app.get('/test2', async (req, res) => {
        console.log('получили запрос на обработку заявок')
        setTimeout(()=> {
            console.log('Выполнили обработку заявок')
            res.json('Выполнили обработку заявок')
        },100)
})
    app.get('/test3', async (req, res) => {
        console.log('получили запрос на зарплату')
        setTimeout(()=> {
            console.log('Выполнили запрос зарплаты')
            res.json('Выполнили запрос зарплаты')
        },4000)
})

