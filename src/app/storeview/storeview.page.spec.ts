import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreviewPage } from './storeview.page';

describe('StoreviewPage', () => {
  let component: StoreviewPage;
  let fixture: ComponentFixture<StoreviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
