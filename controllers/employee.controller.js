const asyncHandler = require("express-async-handler")
const Orders = require("../models/Orders")
const OrderHistory = require("../models/OrderHistory")


//TODO: ORDERS CRUD START

exports.getAllOrders = asyncHandler(async (req, res) => {
    console.log(req.userId)
    const result = await OrderHistory.find({ employee: req.userId })
        .populate("employee", { name: 1, email: 1, mobile: 1 })
        .populate({
            path: "order",
            populate: [
                {
                    path: "package",
                    model: "customerPackage",
                    select: { name: 1, amount: 1, mrp: 1, desc: 1, hero: 1, company: 1 },
                    populate: {
                        path: "company",
                        model: "company",
                        select: { name: 1, desc: 1, logo: 1 }
                    }
                },
                {
                    path: "customer",
                    model: "customer",
                    select: { name: 1, email: 1, mobile: 1 }
                }
            ],
            select: { createdAt: 0, updatedAt: 0, __v: 0 }
        })
    return res.json({ messsage: "Orders Fetch Success", result })

})
exports.getOrderDetails = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const result = await Orders.findById(orderId)
    return res.json({ messsage: "Order Details Fetch Success", result })
})
exports.sampleCollectedStatus = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const result = await Orders.findByIdAndUpdate(orderId, { isSampleCollected: true })
    return res.json({ messsage: "Sample collection is Done", result })

})

//TODO: ORDERS CRUD End