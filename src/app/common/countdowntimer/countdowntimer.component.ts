import { Component, Input, VERSION } from "@angular/core";

@Component({
  selector: "countdowntimer",
  templateUrl: "./countdowntimer.component.html",
  //styleUrls: ["./app.component.css"]
})
export class CountDownTimerComponent {
  //name = "Angular " + VERSION.major;
  display: any;
  @Input() timeSecond: number;


  constructor() {
    this.timerSecond();
  }
  timerSecond() {
    // let minute = 1;
    let seconds: number = this.timeSecond;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = this.timeSecond < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds)}:${textSec}`;

      if (seconds == 0) { 
        clearInterval(timer);
      }
    }, 1000);
  }

  timerMinute(minute) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) { 
        clearInterval(timer);
      }
    }, 1000);
  }
}
