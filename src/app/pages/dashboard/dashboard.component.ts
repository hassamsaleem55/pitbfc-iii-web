import { Component, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DashboardService } from './services/dashboard.service';
import { ServiceItem } from "../../shared/models/service-item.model";

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private router = inject(Router);
  private dashboardService = inject(DashboardService);
  searchTerm = signal('');
  services = signal<ServiceItem[]>([]);
  isLoading = signal(true); // Add this signal

  ngOnInit() {
    this.loadServices();
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  onCardClick(service: ServiceItem) {
    if (service.url) {
      this.router.navigate([service.url]);
    } else {
      // Temporary alert for cards that don't have pages built yet
      alert(`${service.title} is currently under construction.`);
    }
  }

  loadServices() {
    this.isLoading.set(true); // Set loading to true before the call
    this.dashboardService.getDashboardData().subscribe({
      next: (data: ServiceItem[]) => {
        this.services.set(data);
        this.isLoading.set(false); // Set loading to false after data is received
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.isLoading.set(false); // Also set loading to false on error
      }
    });
  }

  filteredServices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.services().filter(s => s.title.toLowerCase().includes(term));
  });
}
