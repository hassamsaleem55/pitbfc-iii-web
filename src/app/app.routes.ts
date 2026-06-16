import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { CnicCancellationComponent } from './pages/fc-services/cnic-cancellation/cnic-cancellation.component';

// Auth Components
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
// import { ForgotPassword } from './pages/forgot-password/forgot-password';

// Guards
import { authGuard, guestGuard } from './core/auth/gaurds/auth.guard';

export const routes: Routes = [
    // PUBLIC ROUTES (Only accessible if NOT logged in)
    { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
    // { path: 'forgot-password', component: ForgotPassword, canActivate: [guestGuard] },

    // PROTECTED ROUTES (Only accessible if logged in)
    {
        path: '',
        canActivate: [authGuard],
        children: [
            { path: '', component: DashboardComponent },
            { path: 'cnic-cancellation', component: CnicCancellationComponent },
        ]
    },

    // Catch-all route to redirect invalid URLs
    { path: '**', redirectTo: '' }
];