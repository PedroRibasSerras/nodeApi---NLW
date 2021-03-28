import { EntityRepository, Repository } from "typeorm";
import { Survey_User } from "../models/Survey_User";

@EntityRepository(Survey_User)
class Survey_UserRepository extends Repository<Survey_User>{

}

export { Survey_UserRepository };