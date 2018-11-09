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
});


export const User = mongoose.model<User>('User', userSchema);
