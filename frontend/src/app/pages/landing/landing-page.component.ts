import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { HeroComponent } from './hero.component';
import { ServicesComponent } from './services.component';
import { AboutComponent } from './about.component';
import { TeamComponent } from './team.component';
import { TestimonialsComponent } from './testimonials.component';
import { ContactComponent } from './contact.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    AboutComponent,
    TeamComponent,
    TestimonialsComponent,
    ContactComponent,
    FooterComponent
  ],
  template: `
    <app-navbar></app-navbar>
    <app-hero></app-hero>
    <app-services></app-services>
    <app-about></app-about>
    <app-team></app-team>
    <app-testimonials></app-testimonials>
    <app-contact></app-contact>
    <app-footer></app-footer>
  `
})
export class LandingPageComponent {}
