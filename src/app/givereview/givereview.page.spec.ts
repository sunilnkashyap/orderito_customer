import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GivereviewPage } from './givereview.page';

describe('GivereviewPage', () => {
  let component: GivereviewPage;
  let fixture: ComponentFixture<GivereviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GivereviewPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GivereviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
