const { mongoose } = require("../config/dbConnection");
const passwordEncryptor = require("../helpers/passwordEncryptor");

const PersonnelSchema = new mongoose.Schema(
  {
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      maxLength: 100,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
      set: (password) => {
        if(password.length >= 4 && password.length <= 16){
          return passwordEncryptor(password);

        }else{
          return 'Invalid password length! - [4 to 16]';
        }
      },
      validate:(password)=> {
        if(password == 'Invalid password length! - [4 to 16]'){
          return false
        }else{
          return true;
        }
      }
    },
    firstName: {
      type: String,
      trim: true,
      maxLength: 100,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      maxLength: 100,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      minLength: 1,
      maxLength: 11,
      match: /^\d+$/,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      maxLength: 100,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxLength: 100,
      required: true,
    },
    salary: {
      type: Number,
      required: true,
      max: 1000000,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 1000,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isLead: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "personnels",
    timestamps: true,
  }
);

PersonnelSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    ret.createdAt = ret?.createdAt.toLocaleDateString("tr-TR");
    ret.updatedAt = ret?.updatedAt.toLocaleDateString("tr-TR");
  },
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

PersonnelSchema.virtual("fullname").get(function () {
  //   return `${this.firstname} ${this.lastname}`;
  return `${capitalize(this.firstname)} ${capitalize(this.lastname)}`;
});

module.exports.Personnel = mongoose.model("Personnel", PersonnelSchema);
