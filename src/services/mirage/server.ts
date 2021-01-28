import { Server, Model, Factory, belongsTo, hasMany, Response } from "miragejs";

import user from "./routes/user";
import * as diary from './routes/diary';

export const handleError = (error: any, messege = "An Error ocurred") => {
    return new Response(400, undefined, {
        data: {
            messege,
            isError: true,
        }
    })
}

export const setupServer = (env?: string): Server => {
    return new Server({
        environment: env ?? "development",
        models: {
            entry: Model.extend({
                diary: belongsTo()
            }),
            diary: Model.extend({
                entry: hasMany(),
                user: belongsTo()
            }),
            user: Model.extend({
                diary: hasMany()
            })
        },

        factories: {
            user: Factory.extend({
                userName: "test",
                password: "password",
                email: "test@email.com",
            })
        },

        seeds: (server): any => {
            server.create("user");
        },

        //update the server’s route property with the routes we want to handle:
        routes(): void {
            this.urlPrefix = "https://diaries.app";

            this.get('/diaries/entries/:id', diary.getEntries);
            this.get('/diaries/:id', diary.getDiary);

            this.post('/auth/login', user.login);
            this.post('/auth/signup', user.signup);

            this.post('/diaries/', diary.create);
            this.post('/diaries/entry/:id', diary.addEntry);

            this.put('/diaries/entry/:id', diary.updateEntry);
            this.put('/diaries/:id', diary.updateDiary);

        }
    })
}