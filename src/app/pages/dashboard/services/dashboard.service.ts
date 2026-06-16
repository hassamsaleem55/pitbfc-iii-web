import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ServiceItem } from "../../../shared/models/service-item.model";

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiBaseUrl;

  getDashboardData() {
    const token = localStorage.getItem('authToken');
    return this.http.get<ServiceItem[]>(`${this.API_URL}/api/Dashboard/Services`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
