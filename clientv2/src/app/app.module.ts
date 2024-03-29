import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { ListReservedAccommodationsComponent } from './list-reserved-accommodations/list-reserved-accommodations.component';
import { ManageAccommodationsComponent } from './manage-accommodations/manage-accommodations.component';
import { HomePageComponent } from './home-page/home-page.component';
import { InformationPageComponent } from './information-page/information-page.component';
import { CreateAccommodationComponent } from './create-accommodation/create-accommodation.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ListAccommodationsComponent } from './list-accommodations/list-accommodations.component';
import { ReserveAccommodationComponent } from './reserve-accommodation/reserve-accommodation.component';
import { ErrorsPipe } from './core/pipes/errors.pipe';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ConfirmAccommodationsComponent } from './confirm-accommodations/confirm-accommodations.component';
import { PaymentComponent } from './payment/payment.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchbarComponent,
    ListReservedAccommodationsComponent,
    ManageAccommodationsComponent,
    HomePageComponent,
    InformationPageComponent,
    CreateAccommodationComponent,
    LoginPageComponent,
    RegisterPageComponent,
    ListAccommodationsComponent,
    ReserveAccommodationComponent,
    ErrorsPipe,
    ConfirmAccommodationsComponent,
    PaymentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    NgxPaginationModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatGridListModule,
    MatTabsModule,
    MatExpansionModule,
    MatDividerModule,
    MatSelectModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
