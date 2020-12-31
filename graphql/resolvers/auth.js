const bcrypt = require("bcryptjs");

const User = require("../../model/UserModel");

module.exports = {
  createUser: async (args) => {
    try {
      const userFetched = await User.findOne({ email: args.userInput.email });
      if (userFetched) {
        throw new Error("User already exists");
      }

      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const newUser = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const result = await newUser.save();
      return { ...result._doc, password: null };
    } catch (error) {
      throw error;
    }
  },
};
