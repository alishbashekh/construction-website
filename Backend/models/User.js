import mongoose from "mongoose";
import bcrypt from "bcrypt"; // used to hide/encrypt passwords

const UserSchema = new mongoose.Schema(
  {
    // unique id for the employee
    userId: { type: String, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String },

    // roles for the office staff
    role: {
      type: String,
      enum: ["system_admin", "accounts_officer", "booking_officer"],
      required: true,
    },

    status: { type: Boolean, default: true }, // active or disabled
    lastLogin: { type: Date },

    // for soft delete
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

// This runs before saving the user to the database
UserSchema.pre("save", async function (next) {
  try {
    // 1. If password is new or changed, encrypt it
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    // 2. Generate a User ID like USR-00001
    if (!this.userId) {
      const count = await mongoose.model("User").countDocuments();
      this.userId = `USR-${String(count + 1).padStart(5, "0")}`;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Function to check if the password is correct during login
UserSchema.methods.comparePassword = async function (passwordInput) {
  return bcrypt.compare(passwordInput, this.password);
};

// This hides the password when we send user data to the frontend
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model("User", UserSchema);
export default User;
