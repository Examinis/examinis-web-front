import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { Testimonial } from '../shared/interfaces/testimonial';
import { CommonModule } from '@angular/common';
import { Feature } from '../shared/interfaces/feature';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [ToolbarModule, ButtonModule, CardModule, CarouselModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  router: Router;
  showMenu = false; // Para controle do menu mobile

  testimonials = [
    {
      icon: 'pi pi-user',
      feedback: 'A plataforma é excelente, economiza muito tempo na criação de provas!',
      name: 'Maria Silva',
    },
    {
      icon: 'pi pi-user',
      feedback: 'Adorei a facilidade de uso e a variedade de recursos.',
      name: 'João Pereira',
    },
  ];

  constructor (router: Router) {
    this.router = router;
  }

  toListPage = () => {
    this.router.navigate(['/list-question']);
  }
}