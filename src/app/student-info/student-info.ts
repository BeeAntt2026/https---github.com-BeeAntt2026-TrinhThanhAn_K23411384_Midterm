import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-info',
  standalone: false,
  templateUrl: './student-info.html',
  styleUrl: './student-info.css',
})
export class StudentInfo implements OnInit, OnDestroy {
  public studentId: string = 'K234111384';
  public studentName: string = 'Trịnh Thanh An';
  public studentImage: string = '/assets/avatar.jpg';
  public profilePic: string = '/assets/avatar.jpg';
  public className: string = 'ABW02';

  public positionY: number = 0;
  public direction: number = 1;
  private intervalId: any;

  ngOnInit() {
    // Tạo hiệu ứng di chuyển lên xuống bằng setInterval
    this.intervalId = setInterval(() => {
      this.positionY += this.direction * 2;
      if (this.positionY >= 50) this.direction = -1;
      if (this.positionY <= 0)  this.direction = 1;
    }, 30);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
