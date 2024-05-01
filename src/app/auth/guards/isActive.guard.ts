import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Observable, map, tap } from "rxjs";
import { AuthServiceService } from "../services/auth-service.service";

@Injectable({ providedIn: "root" })
export class isAuthGuard implements CanMatch, CanActivate {


    constructor(
        private readonly authService: AuthServiceService,
        private router: Router
    ) { }

    // si ya esta autenticado, no peude entrar a la pagina de login
    private isActive() {
        return this.authService.checkAuthentication().pipe(
            tap(isAuthenticated => {
                if (isAuthenticated) {
                    this.router.navigate(["/"])
                }
            }),
            map(isAuth => !isAuth)
        )
    }


    canMatch(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> {
        return this.isActive()
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.isActive()
    }

}