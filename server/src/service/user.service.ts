import { CreateUserInput, User, UserModal } from "../schmea/user.schema";
import bcrypt from "bcrypt";
import { validate } from "class-validator";
import { UserResponse } from "../resolvers/user.resolver";
import { MessageFormatter } from "../helper/errorformate";

export default class UserService {
  async createUser(input: CreateUserInput): Promise<UserResponse> {
    let user;
    try {
      //validate userdata
      const error = await validate(input);
      const formatedError = MessageFormatter.format(error);

      if (formatedError.length > 0) return { errors: formatedError };

      //hash pass
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(input.password, salt);
      input.password = hash;

      user = await UserModal.create(input);
    } catch (err) {
      if (err.code === "11000") {
        return {
          errors: [
            {
              field: "email",
              message: "username already taken",
            },
          ],
        };
      }
      return {
        errors: [
          {
            field: "globle",
            message: "Somethig Went Wrong",
          },
        ],
      };
    }
    return { user };
  }

  me = async (id: string): Promise<User | null> => {
  const user = await UserModal.findById(id);
  return user
  };

  async login(email: User["email"], password: string): Promise<UserResponse> {
    const user = await UserModal.findOne({ email });
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "email is not register",
          },
        ],
      };
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }
    return { user };
  }

  forgotpassword = async (email: string): Promise<User | null> => {
    try {
      const user = await UserModal.findOne({ email });
      return user;
    } catch (error) {
      return null;
    }
  };

  changepassword = async (
    id: string,
    password: string
  ): Promise<UserResponse> => {
    const user = await UserModal.findOne({ _id :id});
    if (!user) {
      return {
        errors: [
          {
            field: "email",
            message: "email is not register",
          },
        ],
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await UserModal.updateOne(
      { id },
      {
        password: hash,
      }
    );

    return { user };
  };
}
