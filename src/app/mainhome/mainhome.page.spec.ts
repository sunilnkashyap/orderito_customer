import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainhomePage } from './mainhome.page';

describe('MainhomePage', () => {
  let component: MainhomePage;
  let fixture: ComponentFixture<MainhomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainhomePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainhomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
