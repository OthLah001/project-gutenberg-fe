import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './guards/authenticated.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'books',
    loadComponent: () =>
      import('./books/components/search-book/search-book.component').then(
        (m) => m.SearchBookComponent
      ),
    canActivate: [AuthenticatedGuard],
  },
];
