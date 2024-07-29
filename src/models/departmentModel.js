const {mongoose} = require('../config/dbConnection');

const DepartmentSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        maxLength:100,
        required:true,
    }
},{
    collection:'departments',
    timestamps:true
})
DepartmentSchema.set('toJSON',{
    transform:(doc,ret)=> {
        delete ret.__v;
        ret.createdAt = ret?.createdAt.toLocaleDateString("tr-TR");
        ret.updatedAt = ret?.updatedAt.toLocaleDateString("tr-TR");
    }
})

module.exports.Department = mongoose.model('Department',DepartmentSchema)