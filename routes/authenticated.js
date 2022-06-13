const express = require("express");
const router = express.Router();
const employee = require("../api/employee.js");
const upload = require("../middleware/multerStorage.js");

router.post("/employee", employee.addEmployees);
router.get("/employee_by_number/:phoneNumber", employee.getEmployeeByNumber);
router.put(
  "/employee_picture",
  upload.single("file"),
  employee.addEmployeePicture
);
router.get("/employee_by_email/:email", employee.getEmployeeByEmail);
router.post("/mail", employee.sendEmail);

router.use("*", (req, res) => {
  res.status(404).json({
    code: "404 : page not found'",
  });
});
module.exports = router;
