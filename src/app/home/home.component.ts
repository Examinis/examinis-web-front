import { Component } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { Testimonial } from '../shared/interfaces/testimonial';
import { CommonModule } from '@angular/common';
import { Feature } from '../shared/interfaces/feature';

@Component({
  selector: 'app-home',
  imports: [ToolbarModule, ButtonModule, CardModule, CarouselModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  testimonials: Testimonial[] = [
    {
      icon: 'pi pi-star',
      feedback: 'This is a great site!',
      name: 'John Doe'
    },
    {
      icon: 'pi pi-star',
      feedback: 'I love this site!',
      name: 'Jane Doe'
    }
  ];

  features: Feature[] = [
    {
      icon: 'pi pi-check',
      title: 'Feature 1',
      description: 'This is feature 1'
    },
    {
      icon: 'pi pi-check',
      title: 'Feature 2',
      description: 'This is feature 2'
    },
    {
      icon: 'pi pi-check',
      title: 'Feature 3',
      description: 'This is feature 3'
    }
  ];
}
