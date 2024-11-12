const router = require("express").Router()
const superAdmin = require("./../controllers/superAdmin.controller")

router

    // CITY ADMIN
    .get("/fetch-city-admin", superAdmin.getAllCityAdmin)
    .get("/fetch-city-admin-details/:adminId", superAdmin.getCityAdminDetails)
    .post("/create-city-admin", superAdmin.registerCityAdmin)
    .put("/activate-city-admin/:adminId", superAdmin.activateCityAdmin)
    .put("/deacitvate-city-admin/:adminId", superAdmin.deActivateCityAdmin)
    .put("/update-city-admin/:adminId", superAdmin.updateCityAdmin)
    .put("/restore-city-admin/:adminId", superAdmin.restoreCityAdmin)
    .delete("/delete-city-admin/:adminId", superAdmin.dleteCityAdmin)

    //------------------------------------------------------------------------------------
    // COMPANY
    .get("/fetch-company", superAdmin.getAllCompany)
    .get("/fetch-company-details/:companyId", superAdmin.getCompanyDetails)
    .post("/register-company", superAdmin.registerCompany)
    .put("/update-company/:companyId", superAdmin.updateCompany)
    .delete("/delete-company/:companyId", superAdmin.deleteCompany)

    //------------------------------------------------------------------------------------
    // CUSTOMER PACKAGE
    .post("/create-customer-package", superAdmin.createCustomerPackage)
    .get("/fetch-customer-package", superAdmin.getAllCustomerPackage)
    .get("/fetch-customer-package-details/:packageId", superAdmin.getCustomerPackageDetails)
    .put("/activate-customer-package/:packageId", superAdmin.activateCustomerPackage)
    .put("/deactivate-customer-package/:packageId", superAdmin.deActivateCustomerPackage)
    .put("/update-customer-package/:packageId", superAdmin.updateCustomerPackage)

    //------------------------------------------------------------------------------------
    // TESTS
    .get("/fetch-test", superAdmin.getAllTests)
    .post("/create-test", superAdmin.createTest)
    .put("/activate-test/:testId", superAdmin.activateTest)
    .put("/deactivate-test/:testId", superAdmin.deActivateTest)
    .put("/update-test/:testId", superAdmin.updateTest)
    .delete("/delete-test/:testId", superAdmin.deleteTest)

    //------------------------------------------------------------------------------------
    // LAB
    .get("/fetch-lab", superAdmin.getAllLabs)
    .get("/fetch-lab/:labId", superAdmin.getLabDetails)
    .put("/activate-lab/:labId", superAdmin.activateLab)
    .put("/deactivate-lab/:labId", superAdmin.deActivateLab)

    .get("/fetch-lab-packages", superAdmin.fetchLabPackages)
    .put("/update-lab/:labId", superAdmin.updateSuperLab)


    //------------------------------------------------------------------------------------
    // EMPLOYEE
    .get("/fetch-employee", superAdmin.getAllEmployee)
    .get("/fetch-employee-details/:employeeId", superAdmin.getEmployeeDetails)
    .put("/update-employee/:employeeId", superAdmin.updateEmployee)
    .put("/activate-employee/:employeeId", superAdmin.activateEmployee)
    .put("/deactivate-employee/:employeeId", superAdmin.deActivateEmployee)

    //------------------------------------------------------------------------------------
    // CUSTOMER
    .get("/fetch-customer", superAdmin.getAllCustomers)
    .get("/fetch-customer-details/:customerId", superAdmin.getCustomerDetails)
    .put("/update-customer/:customerId", superAdmin.updateCustomer)
    .put("/activate-customer/:customerId", superAdmin.activateCustomer)
    .put("/deacitvate-customer/:customerId", superAdmin.deactivateCustomer)

    //------------------------------------------------------------------------------------
    // ORDERS
    .get("/fetch-order", superAdmin.getAllOrders)
    .get("/fetch-order-details/:orderId", superAdmin.getOrderDetails)

    //------------------------------------------------------------------------------------
    // QNA
    .get("/fetch-qna", superAdmin.fetchQna)
    .post("/create-qna", superAdmin.createQna)
    .put("/update-qna/:qnaId", superAdmin.updateQna)
    .delete("/delete-qna/:qnaId", superAdmin.deleteQna)

    //------------------------------------------------------------------------------------
    // ORDER ASSIGN
    .put("/assign-admin/:orderId", superAdmin.assignOrderToAdmin)

    // Add CATEGORY
    .get("/category", superAdmin.FetchCategory)
    .post("/add-category", superAdmin.addCategory)
    .put("/update-category/:categoryId", superAdmin.UpdateCategory)
    .delete("/delete-category/:categoryId", superAdmin.deleteCategory)
    .put("/restore-category/:categoryId", superAdmin.restoreseDeleteCategory)
    //------------------------------------------------------------------------------------
    // DOCTOR Harsh
    .get("/fetch-doctors", superAdmin.getAllDoctors)
    .get("/fetch-doctors-details/:doctorId", superAdmin.getDoctorDetails)
    .put("/block-doctor/:doctorId", superAdmin.blockDoctor)
    .put("/unblock-doctor/:doctorId", superAdmin.unblockDoctor)

    .post("/add-doctor", superAdmin.registerDoctor)
    .get("/fetch-doctor", superAdmin.fetchAllDoctor)
    .get("/fetch-doctors-details/:doctorId", superAdmin.getDoctorDetails)
    .delete("/delete-doctor/:doctorId", superAdmin.deleteDoctor)
    .put("/restore-doctor/:doctorId", superAdmin.restoredeleteDoctor)
    .put("/activate-doctor/:doctorId", superAdmin.activateDoctor)
    .put("/deactivate-doctor/:doctorId", superAdmin.deactivateDoctor)

    .get("/fetch-doctors-speciality", superAdmin.fetchDoctorSpeciality)
    .post("/create-doctor-speciality", superAdmin.createDoctorSpeciality)
    .get("/fetch-doctors-city", superAdmin.fetchDoctorCity)
    .post("/create-doctor-city", superAdmin.createDoctorCity)

    //====================================================================================
    // Medical Komal
    .get("/fetch-getAllSuperMedical", superAdmin.getAllSuperMedical)
    .get("/fetch-SuperMedicalDeatils", superAdmin.getAllSuperMedicalDeatils)
    .get("/fetch-unblockMedical", superAdmin.unblockMedical)
    .put("/fetch-blockMedical", superAdmin.blockMedical)

module.exports = router

