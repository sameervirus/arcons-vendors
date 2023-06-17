import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRestoreComponent } from './vendor-restore.component';

describe('VendorRestoreComponent', () => {
  let component: VendorRestoreComponent;
  let fixture: ComponentFixture<VendorRestoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorRestoreComponent]
    });
    fixture = TestBed.createComponent(VendorRestoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
