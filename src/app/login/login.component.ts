import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../shared/services/auth.service';
import { finalize } from 'rxjs';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    PasswordModule,
    ProgressSpinnerModule,
    ToastModule,
    PanelModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  
  loginForm!: FormGroup;
  isSubmitting = false;
  
  ngOnInit(): void {
    // Redirecionar se já estiver autenticado
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/exams']);
      return;
    }
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }
    
    this.isSubmitting = true;
    
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    
    this.authService.login(email, password)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Login realizado',
            detail: 'Você foi autenticado com sucesso!'
          });
          
          // Redirecionamento após login bem-sucedido
          setTimeout(() => {
            this.router.navigate(['/exams']);
          }, 1000);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no login',
            detail: error.message
          });
        }
      });
  }
  
  // Utilitário para marcar todos os campos como touched para mostrar erros de validação
  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  // Verificar se o campo está inválido e tocado para exibir erros
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  
  // Obter mensagem de erro para um campo específico
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    
    if (field.hasError('email')) {
      return 'Por favor, insira um email válido';
    }
    
    return 'Campo inválido';
  }
  
  // Navegar para a página de registro
  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}