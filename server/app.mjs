import express from 'express';
import https from 'https';
import fs from 'fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import config from './config/config.json' assert { type: "json" }
import { getAddressUid, getContractsByAddress, getJobList, getOrderIP, getTicket, makeCall, getContractInfo, getReport, getJobHistory, test, getEquipmentList, getPortsListByObit, getCabdiagByObitAndPort, getPortsListWithDescriptionByObit, getAddressStructure, getContractStatus, getFvnoPort } from "./infotech-requests/requests.mjs";
import PhotoUploader from "./infotech-requests/Photo-uploader.mjs";
import WebSocket, { WebSocketServer } from 'ws';


const PORT = config.PORT;
const app = express();
const upload = multer({ dest: "./photos" });

app.use(cors());
app.use(bodyParser.json({ extended: true, limit: '50mb' }));

// Загрузка SSL-сертификатов
const options = {
    key: fs.readFileSync('../client/src/config/cert/secret.key'),
    cert: fs.readFileSync('../client/src/config/cert/public.crt')
};


const server = https.createServer(options, app);

const wss = new WebSocketServer({server});
server.listen(PORT, () => {
    console.log(`App is listening on port ${PORT} over HTTPS`);
});
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
app.get('/get-ports', async (req, res) => {
    const filePath = './switches/switches.json';

    // Читаем текущее содержимое файла
        let fileContent = await fs.promises.readFile(filePath, 'utf8', (err,data)=>{return data});
    let switchesData = {};
        if(fileContent){
            try {
                switchesData = JSON.parse(fileContent);
            }  catch (error) {
                console.error('Error parsing switches.json:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
        }
    let obit = req.query.obit
        if(switchesData[obit]){
            console.log('Есть такой')
          let result = JSON.stringify(switchesData[obit].ports)
            res.send(result);
            res.end()
            return

        }
        let ports = await getPortsListWithDescriptionByObit(obit);
    let stringifiedPorts = JSON.stringify(ports)
        ports = JSON.parse(ports);
        for(let port in ports){
            if(!ports[port].hasOwnProperty('description') || port.includes('TenGigabit')) delete ports[port]
        }
        // res.write(JSON.stringify(ports))
        let contractStatusArr ={
            contracts: Object.keys(ports).map(port=>{
                return ports[port].contract
            })
        }
        let contractStatusList = await getContractStatus(contractStatusArr)
        contractStatusList.forEach(contract=>{
            let portToEdit=Object.keys(ports).find(port=>{
                return  ports[port]['contract'] === contract['Договор']
            })
            ports[portToEdit] = {... ports[portToEdit],binding:contract['Статус']}
        })
        // res.write(JSON.stringify(ports))
        let fvnoContractsList = Object.keys(ports).filter(port=>{
            return ports[port].description?.includes('#FVNO')
        })

        let fvnoPromises = fvnoContractsList.map(contract => {
            return getFvnoPort(ports[contract].description).then(resolve => {
                ports[contract].fvno = resolve;
            });
        });
        // Ждем, пока все промисы разрешатся
        await Promise.all(fvnoPromises);
    // stringifiedPorts = JSON.stringify(ports)
    //     res.write(stringifiedPorts)
        let cabDiagPromises = Object.keys(ports).map(port => {
            if (!(ports[port].status.includes("100M") || ports[port].status.includes("1G") || ports[port].status.includes("10M"))) {
                return getCabdiagByObitAndPort(obit, port).then(async resolve=>{
                    ports[port].cabdiag=resolve
                    switchesData[obit] = {
                        ports,
                        updated: new Date().toLocaleString('ru-RU')
                    };
                   await fs.writeFile(filePath, JSON.stringify(switchesData, null, 2),()=>{});
                    stringifiedPorts = JSON.stringify(ports)
                    res.write(stringifiedPorts)
                })
            }
        });
        Promise.all(cabDiagPromises).then(async () => {
            // Добавляем или обновляем данные
            // Записываем обновленные данные в файл
            setTimeout(()=>{
                delete switchesData[obit];
                fs.writeFile(filePath, JSON.stringify(switchesData, null, 2),()=>{})
                console.log('Удалили switch ',obit)
            },86400000)
            res.end();
        });

});
app.get('/get-contracts-in-range-of-flats', async (req, res) => {
    const start = new Date().getTime();
    let min = req.query.min;
    let max = req.query.max;
    let physUid = req.query.uid;
    let uid = await getAddressUid(physUid);
    const flatsRange = [];
    for (let i = min; i <= max; i++) {
        flatsRange.push(i);
    }
    const findClosedContracts = async (flat, uid) => {
        return new Promise((resolve, reject) => {
            getContractsByAddress(uid, flat).then(async contracts => {
                if (contracts) {
                    let activeContract = null;
                    let disabledContractTelephone = null;
                    let disabled = false;
                    let isCableAvailable = !!(contracts.length && !contracts.filter(contract => {
                        return (contract['Значение']['Status'] === 'Активен');
                    }).length);
                    let isActive = !!contracts.filter(contract => {
                        if (contract['Значение']['Status'] === 'Активен' && contract['Значение']['Number'].match(/^\d+$/)) {
                            activeContract = contract['Значение']['Number'];
                        }
                        return (contract['Значение']['Status'] === 'Активен');
                    }).length;
                    if (isActive && activeContract) {
                        let activeContractInfo = await getContractInfo(activeContract);
                        if (activeContractInfo['СтатусДоговора'] === 'Отключен по задолженности более 30 дней') {
                            disabled = true;
                            disabledContractTelephone = activeContractInfo['КИ'].find(type => type['Вид'] === 'Телефон')['Представление'];
                        }
                    }
                    if (contracts.length) {
                        const data = {
                            msg: `В ${flat} было ${contracts.length} договоров. ${disabled ? 'Задолжность' : isActive ? 'Активна' : 'Отключена'}`,
                            isActive,
                            disabled,
                            isCableAvailable,
                            disabledContractTelephone,
                            flat,
                            contracts: contracts
                        };
                        resolve(data);
                    } else if (contracts) {
                        const data = {
                            msg: `В ${flat} не было договора`,
                            isActive,
                            isCableAvailable,
                            flat
                        };
                        resolve(data);
                    } else {
                        reject(`Ошибочка вышла во время запроса квартиры ${flat}`);
                    }
                } else {
                    reject('Ошибка запросов');
                }
            });
        }).catch(err => console.log(`Ошибочка вышла во время запроса квартиры ${flat}`));
    }

    res.setHeader('Content-Type', 'application/json');

    let currentIndex = min;

    const sendNextResponse = () => {
        if (currentIndex > max) {
            res.end();
            return;
        }

        findClosedContracts(currentIndex, uid)
            .then(resolve => {
                res.write(JSON.stringify(resolve) + '\n');
                currentIndex++;
                sendNextResponse();
            })
            .catch(err => console.log(err));
    };
    sendNextResponse();
});
app.get('/get-test-ip', async (req, res) => {
})

app.post('/upload-photo', upload.array('files', 10), async (req, res) => {
    console.log('Зашёл в обработчик фото')
    let result = await PhotoUploader.uploadPhotos(req.files, req.query.uid)
    res.json(result)
})
app.get('/get-report', async (req, res) => {
    let report = await getReport(req.query.start,req.query.finish,req.query.variant)
    if (report){let buff = new Buffer(report, 'base64');
        let text = buff.toString('utf8');
        res.send(text.split('{16,')[20].split(',')[4].replace(/[^0-9]/g, ""))}
})
app.get('/get-job-history', async (req, res) => {
    let history = await getJobHistory(req.query['order-number'])
    console.log(history)
    res.send(history)
})
app.get('/get-equipment-list', async (req, res) => {
    let equipment = await getEquipmentList()
    res.send(equipment)
})
app.get('/get-address-structure',async (req,res)=>{
    let address = req.query.address
        let structure = await getAddressStructure(address)
        res.status(structure.status).json(structure.data)
})
let savedOrders = null
let updateTime = null

wss.on('connection', function connection(ws) {
    console.log('WebSocket client connected');
    ws.on('message', async (msg) => {
        msg =  msg.toString()
        console.log('Получил ', msg, ' запрос')
        if (savedOrders && msg === 'refresh') {
            ws.send(JSON.stringify({ orders: savedOrders, updateTime }), () => {
                console.log('Отправил старые данные в ответ на рефреш')
            })
            ws.send(JSON.stringify({ orders: await updateOrders(), updateTime }), () => {
                console.log('Отправил результат в догонку к рефрешу')
            })
        } else {
            ws.send(JSON.stringify({ orders: await updateOrders(), updateTime }), () => {
                console.log('Отправил результат после update')
            })
            setInterval(async () => {
                ws.send(JSON.stringify({ orders: await updateOrders(), updateTime }), () => {
                    console.log('Отправил результат по интервалу')
                })
            }, 600000)
        }
    })
});
async function updateOrders() {
    let orders = await getJobList();
    if (orders) {
        let ordersWithTickets = await Promise.all(orders.map(async (order) => {
            return { ...order, ticket: await getTicket(order['РегистрационныйНомерВСистемеИсточникеЗаявки']) }
        }))
        let ordersWithTicketsAndConfigurations = await Promise.all(ordersWithTickets.map(async (order) => {
            if (order['ТипРабот'] === 'Аварийные работы') {
                return order
            }
            return { ...order, configurations: await getOrderIP(order['РегистрационныйНомерВСистемеИсточникеЗаявки']) }
        }))
        savedOrders = ordersWithTicketsAndConfigurations;
        updateTime = new Date().toLocaleString("ru");
        return ordersWithTicketsAndConfigurations;
    }
}

