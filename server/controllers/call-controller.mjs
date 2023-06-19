import { Router } from 'express';
import {makeCall} from "../infotech-requests/requests.mjs";


const router = Router();


router.get('/', async (req, res) => {

    let number = req.query.number
    try{
        let promise = await makeCall(req.headers,number)
        console.log(promise.data)
        if(promise.status===200 && promise.data.ReturnCode!==0){
            res.json({
                message: promise.data.ReturnText
            })
        }
        else  res.json({
            message: 'Звоним клиенту'
        })
    }
    catch (err)
    {
        res.json({
            message:err.data
        })
    }

});
export default router
