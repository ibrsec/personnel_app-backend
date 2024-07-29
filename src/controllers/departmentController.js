"use strict";
const { Department } = require("../models/departmentModel");
const { Personnel } = require("../models/personnelModel");
const { mongoose } = require("../config/dbConnection");
module.exports.department = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Departments"]
        #swagger.summary = "List Departments"
        #swagger.description = `
            You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>
        `
        #swagger.parameters['filter'] = {
            in: 'query',
            description: 'url?filter[fieldName]=fieldValue',
            schema: { type: 'object', additionalProperties: { type: 'string' } }
        }
        #swagger.parameters['search'] = {
            in: 'query',
            description: 'url?search[fieldName]=searchValue',
            schema: { type: 'object', additionalProperties: { type: 'string' } }
        }
        #swagger.parameters['sort'] = {
            in: 'query',
            description: 'url?sort[fieldName]=asc or desc',
            schema: { type: 'object', additionalProperties: { type: 'string' } }
        }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'The page number for pagination, page=2',
            schema: { type: 'integer' }
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'The number of items per page, limit=25',
            schema: { type: 'integer' }
        }
        #swagger.parameters['skip'] = {
            in: 'query',
            description: 'The number of items will be skipped, skip=25, - if page is provided then it is no need ',
            schema: { type: 'integer' }
        }
    */

    const departments = await res.getModelList(Department);
    res.status(200).json({
      error: false,
      message: "Departments are listed!",
      details: await res.getModelListDetails(Department),
      result: departments,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Departments"]
        #swagger.summary = "Create new Department"
        #swagger.parameters['body'] = {
            in: 'body',
            description: '<ul> Description: name field is required!',
            schema: { $ref: '#/definitions/Department' }
        }
    */
    const { name } = req.body;
    if (!name) {
      res.errorStatusCode = 400;
      throw new Error("Department name is required!");
    }

    const newDepartment = await Department.create({ name });

    res.status(201).json({
      error: false,
      message: "New Department is created!",
      result: newDepartment,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Departments"]
        #swagger.summary = "Get a Department"
        #swagger.description = "Get a Department with id"
        #swagger.parameters['id'] = {
            description: 'Provide a id of a department(objectId)',
        }
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }
    const department = await Department.findOne({ _id: req.params?.id });
    if (!department) {
      res.errorStatusCode = 404;

      throw new Error("Department not Found!");
    }
    res.status(200).json({
      error: false,
      message: "Your Department is here!",
      result: department,
    });
  },

  update: async (req, res) => {
    /*
        #swagger.tags = ["Departments"]
        #swagger.summary = "Update Department"
        #swagger.description = `
            Update a department
        `

        #swagger.parameters['id'] = {
            description: 'Provide a id of a department(objectId)',
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: '<ul> Description: name field is required!:',
            schema: { $ref: '#/definitions/Department' }
        }
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }

    const { name } = req.body;
    if (!name) {
      res.errorStatusCode = 400;
      throw new Error("Department name is required for update!");
    }

    const department = await Department.findOne({ _id: req.params?.id });
    if (!department) {
      res.errorStatusCode = 404;
      throw new Error("Department not Found!");
    }

    const { modifiedCount } = await Department.updateOne(
      { _id: req.params?.id },
      { name },
      { runValidators: true }
    );

    if (modifiedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error(
        "Something went wrong! - department is exist but could't update! - Issue at the last step!"
      );
    }

    res.status(202).json({
      error: false,
      message: "Department is updated!!",
      result: await Department.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
        #swagger.tags = ["Departments"]
        #swagger.summary = "Delete a Department"
        #swagger.description = "Delete a Department with id"
        #swagger.parameters['id'] = {
            description: 'Provide a id of a department(objectId)',
        }
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }

    const department = await Department.findOne({ _id: req.params?.id });
    if (!department) {
      res.errorStatusCode = 404;
      throw new Error("Department not Found!");
    }

    const { deletedCount } = await Department.deleteOne({
      _id: req.params?.id,
    });

    if (deletedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error(
        "Something went wrong! - department is exist but could't delete! - Issue at the last step!"
      );
    }

    res.sendStatus(204);
  },
  getPersonnelsOfDepartment: async (req, res) => {
    /* 
        #swagger.tags = ["Departments"]
        #swagger.summary = "List the Personnels of a Departments"
        #swagger.description = `
            You can send query with endpoint for search[], sort[], page and limit.
            <ul> Examples:
                <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                <li>URL/?<b>page=2&limit=1</b></li>
            </ul>
        `
        #swagger.parameters['filter'] = {
            in: 'query',
            description: 'url?filter[fieldName]=fieldValue',
            schema: { type: 'object', additionalProperties: { type: 'string' } }
        }
        #swagger.parameters['search'] = {
            in: 'query',
            description: 'url?search[fieldName]=searchValue',
            schema: { type: 'object', additionalProperties: { type: 'string' } }
        }
        #swagger.parameters['sort'] = {
            in: 'query',
            description: 'url?sort[fieldName]=asc or desc',
            schema: { type: 'object', additionalProperties: { type: 'string' } }
        }
        #swagger.parameters['page'] = {
            in: 'query',
            description: 'The page number for pagination, page=2',
            schema: { type: 'integer' }
        }
        #swagger.parameters['limit'] = {
            in: 'query',
            description: 'The number of items per page, limit=25',
            schema: { type: 'integer' }
        }
        #swagger.parameters['skip'] = {
            in: 'query',
            description: 'The number of items will be skipped, skip=25, - if page is provided then it is no need ',
            schema: { type: 'integer' }
        }
      */

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }

    const department = await Department.findOne({ _id: req.params.id });
    const personnels = await res.getModelList(Personnel, {
      departmentId: req.params.id,
    });
    res.status(200).json({
      error: false,
      message: `personnels  of the ${department?.name} department  are listed!`,
      details: await res.getModelListDetails(Personnel, {
        departmentId: req.params.id,
      }),
      result: personnels,
    });
  },
};
