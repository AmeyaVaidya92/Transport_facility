import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { RideListComponent } from './components/view-rides/view-rides.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'add-ride', component: AddRideComponent },
  { path: 'rides', component: RideListComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
