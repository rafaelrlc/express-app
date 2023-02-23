const Employee = require("../model/Employee");

const getAllEmployees = (req, res) => {
  const employees = Employee.find();
  if (!employees) return res.send(204).json({ message: "No employees found." });
  console.log(employees);
};

const createEmployee = (req, res) => {
  if (req?.body.firstname || req?.body.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required." });
  }

  try {
    const result = Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (error) {
    console.log(error);
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = async (req, res) => {
  if (!req?.body.id) {
    return res.status(400).json({ message: `Employee ID required.` }).exec();
  }

  const employee = await Employee.findOne({ _id: req.body.id });

  if (!employee) {
    res
      .status(204)
      .json({ message: `No employee with the ${req.body.id} found.` });
  }

  if (req.body?.firstname) employee.firstname = req.body.firstname;
  if (req.body?.lastname) employee.lastname = req.body.lastname;
  const result = await employee.save();

  res.json(result);
};

const deleteEmployee = async (req, res) => {
  if (!req?.body.id) {
    return res.status(400).json({ message: `Employee ID required.` }).exec();
  }
  const employee = await Employee.findOne({ _id: req.body.id });
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found` });
  }

  const result = await Employee.deleteOne({ _id: req.body.id });
  res.json(result);
};

const getEmployee = async (req, res) => {
  if (!req?.params.id)
    return res.status(400).json({ message: `Employee ID required.` }).exec();

  const employee = await Employee.findOne({ _id: req.params.id });
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found` });
  }
  res.json(employee);
};

module.exports = {
  getAllEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
