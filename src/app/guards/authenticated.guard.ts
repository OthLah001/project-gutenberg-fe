import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    const token = this.localStorageService.getItem('bearer_token');

    if (!(token && token.length > 0)) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    return true;
  }
}
