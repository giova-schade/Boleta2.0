import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SasjsLogsComponent } from './sasjs-logs.component'

describe('SasjsLogsComponent', () => {
  let component: SasjsLogsComponent
  let fixture: ComponentFixture<SasjsLogsComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SasjsLogsComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(SasjsLogsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
