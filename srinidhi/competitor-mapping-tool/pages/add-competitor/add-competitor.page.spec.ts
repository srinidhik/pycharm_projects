import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompetitorPage } from './add-competitor.page';

describe('AddCompetitorPage', () => {
  let component: AddCompetitorPage;
  let fixture: ComponentFixture<AddCompetitorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompetitorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompetitorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
