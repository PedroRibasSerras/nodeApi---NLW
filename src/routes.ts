import { Router } from "express";
import { AnswerController } from "./controllers/AnswerController";
import { NpsController } from "./controllers/NpsController";
import { SurveyController } from "./controllers/SurveyController";
import { Survey_UserController } from "./controllers/Survey_UserController";
import { UserController } from "./controllers/UserController";

const router = Router();

const userController = new UserController();
const surveyController = new SurveyController();
const survey_userController = new Survey_UserController();
const answerController = new AnswerController();
const npsController = new NpsController();


router.post("/users", userController.create);
router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);
router.post("/sendMail", survey_userController.sendEmail);
router.get("/answers/:value", answerController.execute);
router.get("/nps/:survey_id", npsController.execute);

export { router };