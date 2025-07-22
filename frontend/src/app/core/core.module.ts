// superdupermart/frontend/src/app/core/core.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Generally needed for services

// SERVICES - Add your core services here if they are 'providedIn: "root"'
// If they are providedIn: 'root', they don't strictly need to be in 'providers' here,
// but explicitly listing them is sometimes done for clarity.
// import { AuthService } from './services/auth.service'; // Already providedIn: 'root'

// GUARDS - Add your guards here
// import { AuthGuard } from './guards/auth.guard'; // Already providedIn: 'root'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule // Often imported here if core services use it
  ],
  providers: [
    // If you remove 'providedIn: "root"' from your services/guards,
    // you would list them here:
    // AuthService,
    // AuthGuard,
  ],
  exports: [
    // Export any components/directives/pipes from Core that other modules need
  ]
})
export class CoreModule { }