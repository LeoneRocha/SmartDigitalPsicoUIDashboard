// componentemodelo.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentemodeloComponent } from './app.componentmodelo';
//jasmine e karma

describe('ComponentemodeloComponent', () => {
  let component: ComponentemodeloComponent;
  let fixture: ComponentFixture<ComponentemodeloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentemodeloComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentemodeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a default title', () => {
    expect(component.title).toBe('default title');
  });

  it('should change the title when setTitle is called', () => {
    component.setTitle('new title');
    expect(component.title).toBe('new title');
  });
});
