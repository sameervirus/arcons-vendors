import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';
import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import { VendorsComponent } from './vendors/vendors.component';
import { VendorRestoreComponent } from './vendor-restore/vendor-restore.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'home',
    component: VendorsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'vendors',
    component: VendorsComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'vendor-register',
    component: VendorRegistrationComponent,
  },
  {
    path: 'vendor-restore',
    component: VendorRestoreComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
