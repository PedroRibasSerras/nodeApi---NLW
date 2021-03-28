import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";
import { AppError } from "../errors/AppError";

class UserController{
    async create(request:Request,response:Response){
        let createError = "";
        const { name,email } = request.body;

        const schema = yup.object().shape({
            name: yup.string().required("Nome é obrigatório!"),
            email: yup.string().email().required("E-mail incorreto!")
        })
        
        try{
            await schema.validate(request.body, {abortEarly:false});
        }catch(err){
            throw new AppError(err);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        const user = usersRepository.create({
            name,
            email
        })

        await usersRepository.save(user).then(
            ()=>{},
            (reason)=>{ 
                createError = reason.message;
            })
        
        if(createError){
            throw new AppError(createError);
        }

        return response.status(201).json(user);
    }
}

export { UserController };
