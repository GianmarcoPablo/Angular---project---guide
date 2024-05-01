import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, CanMatch, GuardResult, MaybeAsync, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from "@angular/router";
import { Observable, tap } from "rxjs";
import { AuthServiceService } from "../services/auth-service.service";

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanMatch, CanActivate {


    constructor(
        private readonly authService: AuthServiceService,
        private router: Router
    ) { }


    private checkAuthStatus(): boolean | Observable<boolean> {
        return this.authService.checkAuthentication().pipe(
            tap(isAuthenticated => {
                if (!isAuthenticated) {
                    this.router.navigate(["/auth/login"])
                }
            }),
            tap(isAuth => console.log(isAuth))
        )
    }

    canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
        return this.checkAuthStatus()
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
        return this.checkAuthStatus()
    }

}