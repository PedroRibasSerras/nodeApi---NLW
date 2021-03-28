import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { Survey_UserRepository } from "../repositories/Survey_UserRepository";

class AnswerController {

    async execute(request:Request,response:Response){
        const { value } = request.params;
        const { id } = request. query;

        const survey_userRepository = getCustomRepository(Survey_UserRepository);

        const survey_user = await survey_userRepository.findOne({
            id: String(id),
        })

        if(!survey_user){
            throw new AppError("Survey User does not exist!")
        }

        survey_user.value = Number(value);

        await survey_userRepository.save(survey_user);

        return response.json(survey_user)

    }
}

export  { AnswerController }