"use strict";
const { Personnel } = require("../models/personnelModel");
const { mongoose } = require("../config/dbConnection");
const { Department } = require("../models/departmentModel");

module.exports.personnel = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Personnels"]
        #swagger.summary = "List Personnels"
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
    const personnels = await res.getModelList(Personnel);
    res.status(200).json({
      error: false,
      message: "Personnels are listed!",
      details: await res.getModelListDetails(Personnel),
      result: personnels,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Personnels"]
        #swagger.summary = "Create new Personnel"
        #swagger.parameters['body'] = {
            in: 'body',
            description: '<ul> Description: departmentId,username,password,firstName,lastName, phone, email, title fields are required!  Other ones optional -> salary,description,isAdmin,isLead,isActive,startedAt,adminkey!:
                <li><b>For admin modification a correct adminkey field is required!</b></li>
                <li><b>Creating a lead personnel of a department, converts old lead of asked department to a normal user!</b></li>
                <li><b>Password length should be 4 to 16</b></li>
            </ul>
            ',
            schema: { $ref: '#/definitions/Personnel' }
        }
    */
    const {
      username,
      password,
      firstName,
      lastName,
      phone,
      email,
      title,
      salary,
      description,
      isAdmin,
      isLead,
      isActive,
      startedAt,
      adminkey,
    } = req.body;
    
    let { departmentId } = req.body;

    if (
      !departmentId ||
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !title
    ) {
      res.errorStatusCode = 400;
      throw new Error(
        "departmentId,username,password,firstName,lastName, phone, email, title fields are required!  Other ones optional -> salary,description,isAdmin,isLead,isActive,startedAt,adminkey!"
      );
    }

    //admin key check for admin crate operation
    if (isAdmin === true) {
      if (!adminkey) {
        res.errorStatusCode = 401;
        throw new Error("Admin modification operations need a adminkey field!");
      }
      if (adminkey !== process.env.ADMIN_KEY) {
        res.errorStatusCode = 401;
        throw new Error(
          "Admin modification operations need a correct adminkey field!"
        );
      }
      const adminDepartment = await Department.findOne({ name: "admin" });
      if (!adminDepartment) {
        const data = await Department.create({ name: "admin" });
        departmentId = data._id;
      } else {
        departmentId = adminDepartment?._id;
      }
    }

    //department check
    const department = await Department.findOne({ _id: departmentId });
    if (!department) {
      res.errorStatusCode = 404;
      throw new Error("Department not found!");
    }

    //department lead check
    if (isLead === true) {
      const makeOldLeadOff = await Personnel.updateMany(
        { departmentId, isLead: true },
        { isLead: false }
      );
    }

    const newPersonnel = await Personnel.create({
      departmentId,
      username,
      password,
      firstName,
      lastName,
      phone,
      email,
      title,
      salary,
      description,
      isAdmin,
      isLead,
      isActive,
      startedAt,
    });

    res.status(201).json({
      error: false,
      message: "New Personnel is created!",
      result: newPersonnel,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Personnels"]
        #swagger.summary = "Get a Personnel"
        #swagger.description = "Get a Personnel with id"
        #swagger.parameters['id'] = {
            description: 'Provide a id of a personnel(objectId)',
        }
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }
    const personnel = await Personnel.findOne({ _id: req.params?.id });
    if (!personnel) {
      res.errorStatusCode = 404;

      throw new Error("Personnel not Found!");
    }
    res.status(200).json({
      error: false,
      message: "Your Personnel is here!",
      result: personnel,
    });
  },

  update: async (req, res) => {
    /*
        #swagger.tags = ["Personnels"]
        #swagger.summary = "Update a Personnel"
        #swagger.description = `
            Update personnel
        `

        #swagger.parameters['id'] = {
            description: 'Provide a id of a personnel(objectId)',
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: '<ul> Description: departmentId,username,password,firstName,lastName, phone, email, title fields are required!  Other ones optional -> salary,description,isAdmin,isLead,isActive,startedAt,adminkey!:
                <li><b>For admin modification a correct adminkey field is required!</b></li>
                <li><b>Updating a user to a lead personnel of a department, converts old lead of asked department to a normal user!</b></li>

                <li><b>Password length should be 4 to 16</b></li>
            </ul>
            ',
            schema: { $ref: '#/definitions/Personnel' }
        }
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }
    const {
      departmentId,
      username,
      password,
      firstName,
      lastName,
      phone,
      email,
      title,
      salary,
      description,
      isAdmin,
      isLead,
      isActive,
      startedAt,
      adminkey,
    } = req.body;

    if (
      !departmentId ||
      !username ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !email ||
      !title
    ) {
      res.errorStatusCode = 400;
      throw new Error(
        "departmentId,username,password,firstName,lastName, phone, email, title fields are required! Other ones optional -> salary,description,isAdmin,isLead,isActive,startedAt,adminkey!"
      );
    }

    const personnel = await Personnel.findOne({ _id: req.params?.id });
    if (!personnel) {
      res.errorStatusCode = 404;
      throw new Error("Personnel not Found!");
    }

    //admin key check for admin update operation
    if (isAdmin === true) {
      if (!adminkey) {
        res.errorStatusCode = 401;
        throw new Error("Admin modification operations need a adminkey field!");
      }
      if (adminkey !== process.env.ADMIN_KEY) {
        res.errorStatusCode = 401;
        throw new Error(
          "Admin modification operations need a correct adminkey field!"
        );
      }
    }

    //department check
    const department = await Department.findOne({ _id: departmentId });
    if (!department) {
      res.errorStatusCode = 404;
      throw new Error("Department not found!");
    }

    //department lead check
    if (isLead === true) {
      const makeOldLeadOff = await Personnel.updateMany(
        { departmentId, isLead: true },
        { isLead: false }
      );
    }

    const { modifiedCount } = await Personnel.updateOne(
      { _id: req.params?.id },
      {
        departmentId,
        username,
        password,
        firstName,
        lastName,
        phone,
        email,
        title,
        salary,
        description,
        isAdmin,
        isLead,
        isActive,
        startedAt,
      },
      { runValidators: true }
    );

    if (modifiedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error(
        "Something went wrong! - personnel is exist but could't update! - Issue at the last step!"
      );
    }

    res.status(202).json({
      error: false,
      message: "Personnel is updated!!",
      result: await Personnel.findOne({ _id: req.params.id }),
    });
  },

  patchUpdate: async (req, res) => {
    /*
        #swagger.tags = ["Personnels"]
        #swagger.summary = "Partial update Personnel"
        #swagger.description = `
            Partial update Personnel
        `
        #swagger.parameters['id'] = {
            description: 'Provide a id of a personnel(objectId)',
        }
        #swagger.parameters['body'] = {
            in: 'body',
            description: '<ul> Description: At least one of the departmentId,username,password,firstName,lastName, phone, email, title, salary,description,isAdmin,isLead,isActive,startedAt is required!:
                <li><b>For admin modification a correct adminkey field is required!</b></li>
                <li><b>Updating a user to a lead personnel of a department, converts old lead of asked department to a normal user!</b></li>
                <li><b>Password length should be 4 to 16</b></li>
            </ul>
            ',
            schema: { $ref: '#/definitions/Personnel' }
        }
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }
    const {
      departmentId,
      username,
      password,
      firstName,
      lastName,
      phone,
      email,
      title,
      salary,
      description,
      isAdmin,
      isLead,
      isActive,
      startedAt,
      adminkey,
    } = req.body;

    if (
      !(
        departmentId ||
        username ||
        password ||
        firstName ||
        lastName ||
        phone ||
        email ||
        title ||
        salary ||
        description ||
        isAdmin ||
        isLead ||
        isActive ||
        startedAt
      )
    ) {
      res.errorStatusCode = 400;
      throw new Error(
        "At least one of the departmentId,username,password,firstName,lastName, phone, email, title, salary,description,isAdmin,isLead,isActive,startedAt is required!"
      );
    }

    if (departmentId) {
      if (!mongoose.Types.ObjectId.isValid(departmentId)) {
        res.errorStatusCode = 400;
        throw new Error("Invalid departmentId type!");
      }
    }
    const personnel = await Personnel.findOne({ _id: req.params?.id });
    if (!personnel) {
      res.errorStatusCode = 404;
      throw new Error("Personnel not Found!");
    }

    //admin key check for admin update operation
    if (isAdmin === true) {
      if (!adminkey) {
        res.errorStatusCode = 401;
        throw new Error("Admin modification operations need a adminkey field!");
      }
      if (adminkey !== process.env.ADMIN_KEY) {
        res.errorStatusCode = 401;
        throw new Error(
          "Admin modification operations need a correct adminkey field!"
        );
      }
    }

    //department check
    if (departmentId) {
      const department = await Department.findOne({ _id: departmentId });
      if (!department) {
        res.errorStatusCode = 404;
        throw new Error("Department not found!");
      }
    }

    //department lead check
    if (isLead === true) {
      const makeOldLeadOff = await Personnel.updateMany(
        { departmentId, isLead: true },
        { isLead: false }
      );
    }

    const { modifiedCount } = await Personnel.updateOne(
      { _id: req.params?.id },
      req.body,
      { runValidators: true }
    );

    if (modifiedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error(
        "Something went wrong! - personnel is exist but could't update! - Issue at the last step!"
      );
    }

    res.status(202).json({
      error: false,
      message: "Personnel is updated!!",
      result: await Personnel.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
        #swagger.tags = ["Personnels"]
        #swagger.summary = "Delete a Personnel"
        #swagger.description = "Delete a Personnel with id"
        #swagger.parameters['id'] = {
            description: 'Provide a id of a personnel(objectId)',
        }
    */
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.errorStatusCode = 400;
      throw new Error("Invalid id type!");
    }

    const personnel = await Personnel.findOne({ _id: req.params?.id });
    if (!personnel) {
      res.errorStatusCode = 404;
      throw new Error("Personnel not Found!");
    }

    const { deletedCount } = await Personnel.deleteOne({ _id: req.params?.id });

    if (deletedCount < 1) {
      res.errorStatusCode = 500;
      throw new Error(
        "Something went wrong! - personnel is exist but could't delete! - Issue at the last step!"
      );
    }

    res.sendStatus(204);
  },
};
