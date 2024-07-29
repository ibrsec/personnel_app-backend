const { Personnel } = require("./src/models/personnelModel")
const { Department } = require("./src/models/departmentModel")

module.exports = async() => {
    await Personnel.deleteMany();
    await Department.deleteMany();
    console.log('Personnels adn Departments are cleaned!');
}