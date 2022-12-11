import axios from "axios";
import config from './config/config.json'

export const api = {
    instance : axios.create({
        baseURL:config.serverURL
    }),
    async getJobHistory(orderNumber){
let history = await this.instance.get(`/get-job-history?order-number=${orderNumber}`)
        return history.data
    }
}