import createConnection  from '../database'
import { app } from '../app'
import  request from 'supertest';
import { getConnection } from 'typeorm';


describe("Surveys",()=>{
    beforeAll(async ()=> {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async ()=> {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to create a new survey", async() => {
        const response = await request(app).post("/surveys").send({
            title:"Test",
            description:"Was that a good test?"
        })

        expect(response.status).toBe(201);
    })

    it("Should be able to get all surveys", async ()=>{
        await request(app).post("/surveys").send({
            title:"Test2",
            description:"Was that a good test too?"
        })

        const response = await request(app).get("/surveys");

        expect(response.body.length).toBe(2);
    })

})