import * as mongoose from 'mongoose';
import {enumGender} from './users.enum';
import {validateCPF} from '../common/validators';
import * as bcrypt from 'bcrypt-nodejs';
import { enviroment } from '../common/environment';

export interface User extends mongoose.Document {
    name:string,
    email:string,
    password:string
}

export interface UserModel extends mongoose.Model<User>{
    findByEmail(email:string) : Promise<User>;
}

const user: User = this;

const userSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        maxlength:80,
        minlength:3
    },
    email:{
        type:String,
        unique:true,
        match:/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required:true

    },
    password:{
        type:String,
        select:false,
        required:true
    },
    gender:{
        type:String,
        required:false,
        enum:enumGender
    },
    cpf:{
        type:String,
        required:false,
        validate:{
            validator:validateCPF,
            message:'{PATH}: invalid CPF ({VALUE})'
        }
    }
});

userSchema.statics.findByEmail = function(email:string){
    this.findOne({email}) ; // email:email
}


/*
userSchema.pre<User>('save', function (next){
    console.log('this ',this);
    const user : User = this;
    console.log('user ',this); 
    if(!user.isModified('password')){
        next();
    }else{
        console.log('else ',this); 
        bcrypt.hash(user.password, enviroment.security.saltRounds,  (err, password)=>{
            console.log('err ',err)
            user.password = password;
            next();
        })
     //   user.password = 
    }
});*/

const hashPassword = (obj, next) => {    
  /*  bcrypt.hash(obj.password, enviroment.security.saltRounds, function (err, password){
        console.log('err ',err)
        user.password = password;
        next();
    })*/
    console.log('obj ',obj);
    let password:string = obj.password + "_1234";
    user.password = password;
    next();
}

const saveMiddleware = function (next){
    const user:User = this;
    if(!user.isModified('password')){
        next();
    } else {
        hashPassword(user, next);
    }
}

const updateMiddleware = function (next){
    if(!this.getUpdate().password){
        next();
    } else {
        hashPassword(this.getUpdate(), next);
    }
}


userSchema.pre<User>('save', saveMiddleware);
userSchema.pre('findOneAndUpdate', updateMiddleware);
userSchema.pre('update', updateMiddleware);

export const User = mongoose.model<User, UserModel>('User', userSchema);
