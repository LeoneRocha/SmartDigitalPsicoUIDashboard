export class AutoRefreshHelper {
    private refreshInterval: any;
    private countdownInterval: any;
    public minutesUntilRefresh: number;
    public secondsUntilRefresh: number;
  
    constructor(
      private callback: () => void, 
      private intervalInMinutes: number = 30
    ) {
      this.minutesUntilRefresh = intervalInMinutes;
      this.secondsUntilRefresh = 0;
    }
  
    startAutoRefresh(): void {
      const intervalInMilliseconds = this.intervalInMinutes * 60 * 1000;
      this.startCountdown();
      this.refreshInterval = setInterval(() => {
        this.callback();
        this.resetCountdown();
      }, intervalInMilliseconds);
    }
  
    private startCountdown(): void {
      this.countdownInterval = setInterval(() => {
        if (this.secondsUntilRefresh > 0) {
          this.secondsUntilRefresh--;
        } else {
          if (this.minutesUntilRefresh > 0) {
            this.minutesUntilRefresh--;
            this.secondsUntilRefresh = 59;
          } else {
            this.resetCountdown();
          }
        }
      }, 1000); // Update every second
    }

    private resetCountdown(): void {
      this.minutesUntilRefresh = this.intervalInMinutes;
      this.secondsUntilRefresh = 0;
    }
  
    stopAutoRefresh(): void {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
      }
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval);
      }
    }
}