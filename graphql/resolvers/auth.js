const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User does not exist");

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) throw new Error("Password is incorrect");

    const token = await jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return {
      userId: user.id,
      token,
      tokenExpiration: 1,
    };
  },
};
