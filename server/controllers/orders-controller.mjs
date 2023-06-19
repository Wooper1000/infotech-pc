import express from "express";
import {getJobList, getOrderIP, getTicket} from "../infotech-requests/requests.mjs";
const router = express.Router();

router.get('/all', async (req, res) => {
    let promise = await getJobList(req.headers)
    res.json(promise.data.Answer)

});

// GET /orders/config
router.post('/config', async (req, res) => {
    let orders = req.body.filter(order => order['ВидИсточникаЗаявки'] === 'HT');
    let ordersWithTickets = await Promise.all(orders.map(async (order) => {
        let promise = await getTicket(req.headers,order['РегистрационныйНомерВСистемеИсточникеЗаявки'])
        let ticket = promise.data.Answer
        return {...order, ticket}
    }))
    let ordersWithTicketsAndConfigurations = await Promise.all(ordersWithTickets.map(async (order) => {
        let promise = await getOrderIP(req.headers,order['РегистрационныйНомерВСистемеИсточникеЗаявки'])
        let configurations = promise.data.Answer.data
        return {...order, configurations }
    }))
    res.json(ordersWithTicketsAndConfigurations)
});

export default router