import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environment';

@Component({
  selector: 'app-vendor-restore',
  templateUrl: './vendor-restore.component.html',
  styleUrls: ['./vendor-restore.component.css'],
})
export class VendorRestoreComponent {
  apiUrl: string;
  formData = {
    email: '',
    commercialRegistration: '',
    action: 'vendor-token',
  };
  isLoading: boolean = false;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  onFormSubmit() {
    this.isLoading = true;
    if (
      this.formData.email == '' ||
      this.formData.commercialRegistration == ''
    ) {
      alert(
        'Please enter a valid email address and a commercial registration number'
      );
      this.isLoading = false;
      return;
    }
    this.http.post<any>(this.apiUrl, this.formData).subscribe({
      next: (value) => {
        if (value.response == 'sent') alert('Update link sent to your email');
        if (value.response == 'failed') alert('please try again');
        if (value.response == '404')
          alert(
            'No registration found under this email and commercial registration number'
          );
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = true;
      },
    });
  }
}
