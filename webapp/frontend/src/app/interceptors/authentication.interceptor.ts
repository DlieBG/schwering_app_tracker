import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable } from "rxjs";
import { LoginService } from "src/app/services/login/login.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(
        private loginService: LoginService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {  
        return next
            .handle(
                req.clone(
                    { 
                        setHeaders: {
                            Authorization: `Bearer ${this.loginService.getJwt()}`
                        }
                    }
                )
            )
            .pipe(
                catchError(
                    (error) => {
                        if(error.status === 401) {
                            this.loginService.resetJwt();
                        }

                        throw error;
                    }
                )
            );
    }

}