import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import axios from "axios";
import { LoginJwt } from "src/types/login.type";

export const Authorization = createParamDecorator(
    async (data: string, ctx: ExecutionContext): Promise<LoginJwt> => {
        let authorizationHeader = ctx.switchToHttp().getRequest().headers.authorization;
        let loginJwt: LoginJwt;

        try {
            loginJwt = (await axios.get(process.env.VALIDATE_URL, { headers: { Authorization: authorizationHeader } })).data as LoginJwt;
        } catch {
            ctx.switchToHttp().getResponse().status(401).send();
        }
        
        return loginJwt; 
    }
);
