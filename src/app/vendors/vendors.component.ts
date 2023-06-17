import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { environment } from 'src/environment';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css'],
})
export class VendorsComponent implements OnInit {
  apiUrl: string;
  vendors: any[] = [];
  filteredVendors: any[] = [];
  mainBusinessOptions: string[] = [];
  selectedMainBusiness: string = '';
  searchTerm: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    this.getVendors();
  }

  getVendors() {
    const token = localStorage.getItem('token') || 'notfound';
    const headers = new HttpHeaders().set('Authorization', token);
    // Make an HTTP request to fetch the vendors data from the backend
    this.http.get<any[]>(this.apiUrl + '/vendors', { headers }).subscribe({
      next: (data) => {
        this.vendors = data;
        this.filteredVendors = data;
        this.populateMainBusinessOptions();
      },
      error: (error) => {
        if (error.status === 401 && error.error) {
          this.authService.logout();
        } else {
          // Handle other error cases
          console.error('Error submitting form', error);
        }
      },
    });
  }

  populateMainBusinessOptions() {
    // Extract all unique mainBusiness values from the vendors data
    const mainBusinessSet = new Set<string>();
    this.vendors.forEach((vendor) => {
      const mainBusinesses = vendor.category_names.split(',');
      mainBusinesses.forEach((mainBusiness: string) =>
        mainBusinessSet.add(mainBusiness.trim())
      );
    });
    this.mainBusinessOptions = Array.from(mainBusinessSet);
  }

  filterByMainBusiness() {
    if (this.selectedMainBusiness === '') {
      this.filteredVendors = this.vendors;
    } else {
      this.filteredVendors = this.vendors.filter((vendor) =>
        vendor.category_names.includes(this.selectedMainBusiness)
      );
    }
  }

  searchTable(searchTerm: string) {
    if (searchTerm === '') {
      this.filteredVendors = this.vendors;
    } else {
      this.filteredVendors = this.vendors.filter(
        (vendor) =>
          vendor.businessName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vendor.mainBusiness.includes(searchTerm.toLowerCase()) ||
          vendor.yearsInBusiness.includes(searchTerm.toLowerCase()) ||
          vendor.mainClients.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.contactName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  toggleDetails(vendor: any) {
    vendor.showDetails = !vendor.showDetails;
  }

  JSONparse(str: string) {
    return JSON.parse(str);
  }
}
