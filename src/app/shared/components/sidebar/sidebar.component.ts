import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    PanelMenuModule, 
    ButtonModule, 
    RippleModule,
    TooltipModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  items: MenuItem[] = [];
  userName: string = "";
  
  // Propriedade para verificar se o usuário está autenticado
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // Propriedade para obter o email do usuário
  get userEmail(): string {
    return this.authService.getUsername();
  }
  
  ngOnInit() {
    this.loadUserData();
    this.setupMenuItems();
  }
  
  loadUserData() {
    // Carregar os dados do usuário do serviço de autenticação
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = `${user.firstName} ${user.lastName}`;
    }
  }
  
  setupMenuItems() {
    // Configuração dos itens do menu (manter o código existente)
    this.items = [
      {
        label: 'Questões',
        icon: 'pi pi-book',
        items: [
          {
            label: 'Listar',
            icon: 'pi pi-list',
            routerLink: '/questions'
          },
          {
            label: 'Criar',
            icon: 'pi pi-pencil',
            routerLink: '/questions/create'
          }
        ]
      },
      {
        label: 'Provas',
        icon: 'pi pi-file',
        items: [
          {
            label: 'Listar',
            icon: 'pi pi-list',
            routerLink: '/exams'
          },
          {
            label: 'Criar manual',
            icon: 'pi pi-pencil',
            routerLink: '/exams/create-manual'
          },
          {
            label: 'Criar automático',
            icon: 'pi pi-cog',
            routerLink: '/exams/create-automatic'
          }
        ]
      }
    ];
    
    // Opcional: ajustar o menu com base no estado de autenticação
    // Você pode optar por mostrar/ocultar certos itens do menu
    // dependendo se o usuário está logado ou não
  }
  
  logout() {
    this.authService.logout();
  }
}
