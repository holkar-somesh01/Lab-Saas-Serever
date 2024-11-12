const router = require("express").Router()
const cityAdmin = require("./../controllers/cityAdmin.controller")

router

    // LAB
    .get("/fetch-lab", cityAdmin.getAllLabs)
    .get("/fetch-lab-details/:labId", cityAdmin.getLabDetails)
    .post("/create-lab", cityAdmin.registerLab)
    .put("/update-lab/:labId", cityAdmin.updateLab)
    .put("/activate-lab/:labId", cityAdmin.activateLab)
    .put("/deactivate-lab/:labId", cityAdmin.deActivateLab)

    // ORDERS
    .get("/fetch-orders", cityAdmin.getAllOrders)
    .get("/fetch-order-details/:orderId", cityAdmin.getOrderDetails)

    // ORDER ASSIGN
    .put("/assign-lab/:orderId", cityAdmin.assignOrderToLab)
    .put("/change-assign-lab/:orderId", cityAdmin.changeAssignOrderToLab)
//

module.exports = router