import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { AddRideComponent } from './components/add-ride/add-ride.component';
import { ViewRidesComponent } from './components/view-rides/view-rides.component';
import { RideDetailsComponent } from './components/ride-details/ride-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddRideComponent,
    ViewRidesComponent,
    RideDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
