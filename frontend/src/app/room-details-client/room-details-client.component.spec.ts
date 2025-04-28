import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomDetailsClientComponent } from './room-details-client.component';

describe('RoomDetailsClientComponent', () => {
  let component: RoomDetailsClientComponent;
  let fixture: ComponentFixture<RoomDetailsClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoomDetailsClientComponent]
    });
    fixture = TestBed.createComponent(RoomDetailsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
