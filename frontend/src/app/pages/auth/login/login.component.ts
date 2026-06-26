import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      
      this.authService.login(username, password).subscribe({
        next: (result) => {
          this.isLoading = false;
          if (result.success) {
            Swal.fire({
              icon: 'success',
              title: '¡Bienvenido!',
              text: `Hola, ${result.user?.nombre}`,
              timer: 2000,
              showConfirmButton: false
            });
            const redirectPath = result.user?.redirect ?? '/app/dashboard';
            this.router.navigateByUrl(redirectPath).catch(err => {
              console.error('Navigation error', err, redirectPath);
              Swal.fire('Error', 'No se pudo navegar a la vista principal.', 'error');
            });
          } else {
            Swal.fire('Error', result.message, 'error');
          }
        },
        error: () => {
          this.isLoading = false;
          Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
      });
    }
  }
}
