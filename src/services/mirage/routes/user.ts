import { Response, Request } from "miragejs";
import { handleError } from "../server";
import { User } from "../../../interfaces/user.interface";
import { randomBytes } from "crypto";


const generateToken = () => randomBytes(8).toString("hex");

export interface AuthResponse {
    token: string;
    user: User;
}

const login = (schema: any, req: Request): AuthResponse | Response => {
    const { username, password } = JSON.parse(req.requestBody);
    const user = schema.users.findBy({ username });
    if (!user) {
        return handleError(null, "No user With that username exists");
    }
    if (password !== user.password) {
        return handleError(null, "Password is incorrect");
    }
    const token = generateToken();
    return {
        user: user.attrs as User,
        token,
    }
};


const signup = (schema: any, req: Request): AuthResponse | Response => {
    const data = JSON.parse(req.requestBody);
    const exUser = schema.users.findBy({ usrname: data.username })
    if (exUser) {
        return handleError(null, "A user with that username already exisist");
    }
    const user = schema.users.create(data);
    const token = generateToken();

    return {
        user: user.attrs as User,
        token
    }
}
export default {
    login,
    signup
}