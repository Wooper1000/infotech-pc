import mongoose, {Schema} from "mongoose";

await mongoose.connect("mongodb://localhost:27017/Addresses")
let address = mongoose.model('Address',new Schema({"Наименование":String}, { collection : 'Addresses' }))

let result = await address.find({"Наименование": /ЛО, Мурино г./i})

console.log(result)
