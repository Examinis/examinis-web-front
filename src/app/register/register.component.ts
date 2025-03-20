import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; // Adicionado para p-confirmdialog
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { PanelModule } from 'primeng/panel'; // Adicionado para p-panel
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api'; // Adicionado ConfirmationService
import { finalize } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    ConfirmDialogModule, // Adicionado para p-confirmdialog
    DividerModule,
    FileUploadModule,
    InputTextModule,
    MessageModule,
    MessagesModule,
    PanelModule, // Adicionado para p-panel
    PasswordModule,
    ProgressSpinnerModule,
    ToastModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService, ConfirmationService] // Adicionado ConfirmationService aos providers
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  
  registerForm: FormGroup;
  isSubmitting = false;
  identityProofFile: File | null = null;
  
  constructor() {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      institution: [''],
      identity_proof: [null, [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }
  
  // Validador personalizado para verificar se senhas são iguais
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    return password && confirmPassword && password !== confirmPassword 
      ? { passwordsNotMatch: true } 
      : null;
  }
  
  // Manipula o upload do arquivo de comprovante de identidade
  onFileSelect(event: any): void {
    if (event.files && event.files.length > 0) {
      const file = event.files[0];
      // Verifica se é um PDF
      if (file.type === 'application/pdf') {
        this.identityProofFile = file;
        this.registerForm.get('identity_proof')?.setValue(file);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro no arquivo',
          detail: 'Por favor, envie um arquivo PDF válido como comprovante de identidade'
        });
        // Limpa o arquivo inválido
        event.clear();
        this.identityProofFile = null;
        this.registerForm.get('identity_proof')?.setValue(null);
      }
    }
  }
  
  // Manipula o envio do formulário
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched(this.registerForm);
      return;
    }
    
    if (!this.identityProofFile) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Por favor, envie um comprovante de identidade (PDF)'
      });
      return;
    }
    
    this.isSubmitting = true;
    
    const userData = {
      first_name: this.registerForm.get('first_name')?.value,
      last_name: this.registerForm.get('last_name')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      institution: this.registerForm.get('institution')?.value || undefined,
      identity_proof: this.identityProofFile
    };
    
    this.authService.register(userData)
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: (user) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Registro realizado',
            detail: `Bem-vindo, ${user.firstName}! Seu cadastro foi realizado com sucesso.`
          });
          
          // Redirecionamento após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro no registro',
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
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
  
  // Obter mensagem de erro para um campo específico
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'Este campo é obrigatório';
    }
    
    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Este campo deve ter no mínimo ${minLength} caracteres`;
    }
    
    if (field.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Este campo deve ter no máximo ${maxLength} caracteres`;
    }
    
    if (field.hasError('email')) {
      return 'Por favor, insira um email válido';
    }
    
    return 'Campo inválido';
  }
  
  // Navegar para a página de login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}