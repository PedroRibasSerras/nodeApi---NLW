import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { Survey_UserRepository } from "../repositories/Survey_UserRepository";

class NpsController{
    async execute(request:Request, response:Response){
        const survey_userRepository = getCustomRepository(Survey_UserRepository);
        const {survey_id} = request.params;

        const surveysUsers = await survey_userRepository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractor = surveysUsers.filter(survey => 
            survey.value >= 0 && survey.value <=6 ).length;
        
        const promoters = surveysUsers.filter(survey => 
            survey.value >= 9 && survey.value <=10 ).length ;

        const passives = surveysUsers.filter(survey => 
            survey.value >= 7 && survey.value <=8 ).length ;
        
        const totalAnswers = surveysUsers.length;

        const result = Number((100 * (promoters - detractor) / totalAnswers).toFixed(2));

        return response.json({
            detractor,
            promoters,
            passives,
            totalAnswers,
            nps: result
        })


    }
}

export { NpsController }