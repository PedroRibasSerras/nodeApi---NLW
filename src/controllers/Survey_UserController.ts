import { Request,Response } from "express";
import { resolve } from "path";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { Survey_UserRepository } from "../repositories/Survey_UserRepository"
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";


class Survey_UserController{

    async sendEmail(request:Request,response:Response){
        const { email, survey_id } = request.body;
        
        
        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const survey_userRepository = getCustomRepository(Survey_UserRepository);

        const userExists = await usersRepository.findOne({email});

        if(!userExists)
            throw new AppError("User does not exists!");
            
        const surveyExists = await surveysRepository.findOne({id: survey_id});

        if(!surveyExists)
            throw new AppError("Survey does not exists!")
    

        const survey_userAlreadyExists = await survey_userRepository.findOne({
            where:{user_id: userExists.id, value: null},
            relations:["user","survey"]
        });

        const variables = {
            name: userExists.name,
            title: surveyExists.title,
            description: surveyExists.description,
            id: "",
            link: process.env.URL_MAIL
        }

        const npsPath = resolve(__dirname,"..","views","emails","npsMail.hbs");

        if(survey_userAlreadyExists){
            variables.id = survey_userAlreadyExists.id;
            await SendMailService.execute(email,surveyExists.title,variables,npsPath)
            return response.json(survey_userAlreadyExists)
        }

        const survey_user = survey_userRepository.create({
            user_id: userExists.id,
            survey_id
        });

        
        await survey_userRepository.save(survey_user);
        
        variables.id = survey_user.id;
        
        await SendMailService.execute(email, surveyExists.title ,variables,npsPath);

        return response.status(201).json(survey_user);


    }

}

export { Survey_UserController };