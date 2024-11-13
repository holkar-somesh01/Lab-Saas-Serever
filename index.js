const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv")
dotenv.config({ path: "./.env" })
const mongoose = require("mongoose")
const { superAdminProtected, cityAdminProtected, labProtected, customerProtected, employeeProtected, medicalProtected, doctorProtected } = require("./middleware/protected")
mongoose.connect(process.env.MONGO_URL)

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.static("uploads"))
app.use(cors({
    origin: process.env.NODE_ENV === "production"
        ? process.env.LIVE_SERVER
        : process.env.LOCAL_SERVER,
    credentials: true,
}))

//ROUTES
app.use("/api/v1/super-admin", superAdminProtected, require("./routes/superAdmin.routes"))
app.use("/api/v1/city-admin", cityAdminProtected, require("./routes/cityAdmin.routes"))
app.use("/api/v1/lab", labProtected, require("./routes/lab.routes"))
app.use("/api/v1/auth", require("./routes/auth.route"))
app.use("/api/v1/public", require("./routes/public.route"))
app.use("/api/v1/employee", employeeProtected, require("./routes/employee.route"))
// app.use("/api/v1/customer", customerProtected, require("./routes/customer.route"))
app.use("/api/v1/customer", customerProtected, require("./routes/customer.route"))
app.use("/api/v1/medical", medicalProtected, require("./routes/medical.route"))
app.use("/api/v1/doctor", doctorProtected, require("./routes/doctor.route"))

app.use("*", (req, res) => {
    res.status(404).json({ message: "resource not found" })
});
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ message: err.message || "something went wrong" })
});

mongoose.connection.once("open", () => {
    console.log("MONGO SERVER RUNNING");
    app.listen(process.env.PORT, console.log(`http://localhost:${process.env.PORT}`))
});
