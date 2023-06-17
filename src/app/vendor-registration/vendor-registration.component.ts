import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environment';

type Category = {
  value: number;
  text: string;
};

@Component({
  selector: 'app-vendor-registration',
  templateUrl: './vendor-registration.component.html',
  styleUrls: ['./vendor-registration.component.css'],
})
export class VendorRegistrationComponent implements OnInit {
  apiUrl: string;
  vendorForm!: FormGroup;
  submitted = false;
  otherFiles: File[] | null = null;
  categories: Category[] = [];
  fromSubmitted = false;
  action = 'add-vendor';
  id: number | null = 0;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.apiUrl = environment.apiUrl;
  }

  ngOnInit() {
    this.vendorForm = this.formBuilder.group({
      businessName: ['', Validators.required],
      mainBusiness: ['', Validators.required],
      yearsInBusiness: [''],
      mainClients: [''],
      registeredEInvoice: ['', Validators.required],
      contactName: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      fax: [''],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      commercialRegistration: ['', Validators.required],
      taxId: ['', Validators.required],
      registrationFile: ['', [Validators.required]],
      registrationFileSource: ['', [Validators.required]],
      taxCardFile: ['', [Validators.required]],
      taxCardFileSource: ['', [Validators.required]],
      otherFiles: [''],
    });
    this.http.get<Category[]>(this.apiUrl + '/categories').subscribe({
      next: (res) => (this.categories = res),
    });

    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      if (token) {
        this.http
          .post<any>(this.apiUrl, {
            token,
            action: 'vendor-details',
          })
          .subscribe({
            next: (res) => {
              this.id = res.response.id;
              const mainBusinessString = res.response.mainBusiness;
              const selectedValues = mainBusinessString.split(',');
              this.action = 'update-vendor';
              this.vendorForm.patchValue({
                businessName: res.response.businessName,
                mainBusiness: selectedValues,
                yearsInBusiness: res.response.yearsInBusiness,
                mainClients: res.response.mainClients,
                registeredEInvoice: res.response.registeredEInvoice,
                contactName: res.response.contactName,
                phone: res.response.phone,
                address: res.response.address,
                fax: res.response.fax,
                email: res.response.email,
                commercialRegistration: res.response.commercial_registration,
                taxId: res.response.tax_id,
              });
              // Remove the 'required' validator from the 'registrationFile' control
              this.vendorForm.get('registrationFile')?.clearValidators();
              this.vendorForm.get('registrationFile')?.updateValueAndValidity();

              // Remove the 'required' validator from the 'registrationFileSource' control
              this.vendorForm.get('registrationFileSource')?.clearValidators();
              this.vendorForm
                .get('registrationFileSource')
                ?.updateValueAndValidity();

              // Remove the 'required' validator from the 'taxCardFile' control
              this.vendorForm.get('taxCardFile')?.clearValidators();
              this.vendorForm.get('taxCardFile')?.updateValueAndValidity();

              // Remove the 'required' validator from the 'taxCardFileSource' control
              this.vendorForm.get('taxCardFileSource')?.clearValidators();
              this.vendorForm
                .get('taxCardFileSource')
                ?.updateValueAndValidity();
            },
            error: (error: HttpErrorResponse) => {
              console.log(error);
              if (error.status === 422) {
                alert(error.error.response);
                this.router.navigate(['/vendor-restore']);
              } else {
                // Handle other error cases
                console.error('Error submitting form', error);
              }
            },
          });
      }
      // Do something with the query parameter value
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.vendorForm.controls;
  }

  // Function to handle file selection for commercial registration
  onCommercialRegistrationFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileSize = file ? file.size / 1024 / 1024 : 0; // Size in MB
      const maxSize = 5; // Maximum file size in MB
      if (fileSize > maxSize) {
        this.vendorForm
          .get('registrationFile')
          ?.setErrors({ fileSizeExceeded: true });
        return; // Prevent form submission if file size exceeds the limit
      }
      this.vendorForm.patchValue({
        registrationFileSource: file,
      });
    }
  }

  // Function to handle file selection for tax card
  onTaxCardFileSelected(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      const fileSize = file ? file.size / 1024 / 1024 : 0; // Size in MB
      const maxSize = 5; // Maximum file size in MB
      if (fileSize > maxSize) {
        this.vendorForm
          .get('taxCardFile')
          ?.setErrors({ fileCardSizeExceeded: true });
        return; // Prevent form submission if file size exceeds the limit
      }
      this.vendorForm.patchValue({
        taxCardFileSource: file,
      });
    }
  }

  // Function to handle file selection with file size validation
  handleFileSelection(
    file: File,
    maxSize: number,
    formControlName: string,
    errorKey: string
  ) {
    const fileSize = file ? file.size / 1024 / 1024 : 0; // Size in MB
    if (fileSize > maxSize) {
      this.vendorForm.get(formControlName)?.setErrors({ [errorKey]: true });
      return false;
    }
    return true;
  }

  // Function to handle file selection for others
  onOthersFileSelected(event: any) {
    this.vendorForm.get('otherFiles')?.setErrors(null);
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const maxSize = 5; // Maximum file size in MB
      let isValid = true;
      // Convert FileList to an array
      this.otherFiles = Array.from(fileList).filter((file: File) => {
        isValid =
          this.handleFileSelection(
            file,
            maxSize,
            'otherFiles',
            'otherFileSizeExceeded'
          ) && isValid;
        return isValid;
      });
    }
  }

  onSubmit() {
    this.submitted = true;

    // Stop if the form is invalid
    if (this.vendorForm.invalid) {
      return;
    }

    const formData: any = new FormData();
    formData.append('businessName', this.vendorForm.value.businessName);
    formData.append('mainBusiness', this.vendorForm.value.mainBusiness);
    formData.append('yearsInBusiness', this.vendorForm.value.yearsInBusiness);
    formData.append('mainClients', this.vendorForm.value.mainClients);
    formData.append(
      'registeredEInvoice',
      this.vendorForm.value.registeredEInvoice
    );
    formData.append('contactName', this.vendorForm.value.contactName);
    formData.append('phone', this.vendorForm.value.phone);
    formData.append('address', this.vendorForm.value.address);
    formData.append('fax', this.vendorForm.value.fax);
    formData.append('email', this.vendorForm.value.email);
    formData.append('website', this.vendorForm.value.website);
    formData.append(
      'commercialRegistration',
      this.vendorForm.value.commercialRegistration
    );
    formData.append('taxId', this.vendorForm.value.taxId);

    // Append uploaded files
    formData.append(
      'registrationFile',
      this.vendorForm.get('registrationFileSource')?.value
    );
    formData.append(
      'taxCardFile',
      this.vendorForm.get('taxCardFileSource')?.value
    );
    // Handle otherFiles when it is not empty
    if (this.otherFiles && this.otherFiles.length > 0) {
      for (const file of this.otherFiles) {
        formData.append('otherFiles[]', file);
      }
    }
    formData.append('action', this.action);
    formData.append('id', this.id);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    // ... rest of the submission logic
    this.http.post(this.apiUrl, formData, { headers }).subscribe({
      next: (value) => {
        this.fromSubmitted = true;
        // Reset form fields
        this.onReset();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 422 && error.error && error.error.email) {
          // Display the email already exists error to the user
          const emailError = error.error.email;
          // You can handle the error message based on your UI requirements, for example:
          this.vendorForm.controls['email'].setErrors({
            serverError: emailError,
          });
        } else {
          // Handle other error cases
          console.error('Error submitting form', error);
        }
      },
    });
  }

  onReset() {
    this.submitted = false;
    this.vendorForm.reset();
  }
}
