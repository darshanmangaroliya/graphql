import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constent/constent";
import { MyContext } from "src/types/mycontext";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Field,
  ObjectType,
  Ctx,
} from "type-graphql";
import { CreateUserInput, User } from "../schmea/user.schema";
import UserService from "../service/user.service";
import { v4 } from "uuid";
import { sendEmail } from "../helper/sendMail";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  @Mutation(() => UserResponse)
  async addUser(
    @Arg("input") input: CreateUserInput,
    @Ctx() { req }: MyContext
  ) {
    const data = await this.userService.createUser(input);
    if (data.errors) return data;
    req.session.UserId = data.user?._id;
    return data;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const response = await this.userService.login(email, password);
    if (response.errors) return response;
    req.session.UserId = response.user?._id;
    return response;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.UserId) {
      return null;
    }

    return this.userService.me(req.session.UserId);
  }

  @Mutation(() => Boolean)
  async forgotpassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<boolean> {
    console.log(email)
    const user = await this.userService.forgotpassword(email);
    if (!user) return true;
    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user?._id,
      "EX",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(
      email,
      `<a href="http://localhost:5173/change-password/${token}">reset password</a>`
    );

    return true;
  }

  @Mutation(() => UserResponse)
  async changepassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() {redis,req}: MyContext
  ):Promise<UserResponse> {
    if (newPassword.length <= 5) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    let key = FORGET_PASSWORD_PREFIX + token
    let   userId = await redis.get(key)
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }
   const user = await this.userService.changepassword(userId,newPassword)
   if (user.errors) return user;

    await redis.del(key);

    // log in user after change password
    req.session.UserId = user.user?._id;
    return user
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }
}
