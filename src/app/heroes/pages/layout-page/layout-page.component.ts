import { Component } from '@angular/core';
import { AuthServiceService } from '../../../auth/services/auth-service.service';
import { User } from '../../../auth/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent {
  public sidebarItems = [
    { label: "Listado", icon: "label", url: "./list" },
    { label: "Añadir", icon: "add", url: "./new-hero" },
    { label: "Buscar", icon: "search", url: "./search" }
  ]

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) { }

  onLogOut() {
    this.authService.logout()
    this.router.navigate(['/auth'])
  }

  get user(): User | undefined {
    return this.authService.currentUser
  }
}
