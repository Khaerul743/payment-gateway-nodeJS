const express = require("express")
const midtransClient = require("midtrans-client")
require("dotenv").config()
const app = express()
app.use(express.json())

const snap = new midtransClient.Snap({
    isProduction:false,
    serverKey:process.env.SERVER_KEY
})

app.post("/create_transaction",async (req,res) => {
    try {
        const parameter = {
            transaction_details:{
                order_id:"ORDER-" + Math.floor(Math.random() * 100000),
                gross_amount:100
            },
            customer_details: {
                first_name:"erul",
                email:"khaerullutfi433@gmail.com"
            }
        }
        const transaction = await snap.createTransaction(parameter);
        res.json({paymentUrl:transaction.redirect_url})
    } catch (error) {
        res.status(500).json("error : "+error)
    }
})

app.post("/midtrans-notification",async (req,res) => {
    try {
        const {order_id,transaction_status} = req.body
        if(transaction_status == "settlement"){
            console.log(`✅ Pembayaran sukses! Order ID: ${order_id}`);
            res.status(200).send("ok")
        }else if(transaction_status == "pending"){
            console.log(`⌛ Pembayaran pending: ${order_id}`);
        }else{
            console.log(`❌ Pembayaran gagal / dibatalkan: ${order_id}`);
        }
    } catch (error) {
        console.error("❌ Error Webhook:", error);
        res.status(500).json({ error: error.message });
    }
})

app.get("/",(req,res) => {
    res.send("hello")
})

app.listen(3000,() => {
    console.log("Server is listening on port 3000")
})