import { prop  ,getModelForClass} from "@typegoose/typegoose";
import { IsEmail, MaxLength, MinLength } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class User {

    @Field(()=>String)
    _id:string

    @Field(()=>String)
    @prop({required:true})
    name:string

    @Field(()=>String)
    @prop({required:true,unique:true})
    email:string

    @prop({required:true})
    password:string

}

export const UserModal = getModelForClass(User)


@InputType()
export class CreateUserInput{
    @Field(()=>String)
    name:string

    @IsEmail()
    @Field(()=>String)
    email:string
    
    @MinLength(6,{
        message:"password length must be 6 chars"
    })
    @MaxLength(10,{
        message:"password length must be lessthan 10 chars"
    })
    @Field(()=>String)
    password:string

}