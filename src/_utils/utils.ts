import { log } from 'debug';
import moment from 'moment';

class Utils {
  /*
calculate duration 
*/
  calculateDuration(element: any) {
    const startTime = moment(moment.utc(element.start).format('LTS'), 'HH:mm:ss a');
    const endTime = moment(moment.utc(element.end).format('LTS'), 'HH:mm:ss a');
    // calculate total duration in seconds
    const duration = moment.duration(moment(moment(endTime)).diff(moment(moment(startTime))));
    return duration.asSeconds();
  }

  /*
  get days list between start date and end date
  */
  async getDaysArray(start_date: any, end_date: any, days: any) {
    const arr: [] = [];
    for (const arr = [], dt = new Date(start_date); dt <= end_date; dt.setDate(dt.getDate() + 1)) {
      if (days.includes(moment(dt).format('dddd'))) {
        arr.push(new Date(dt));
      }
      if (moment(dt).format('YYYYMMDD') === moment(end_date).format('YYYYMMDD')) {
        // console.log(arr);

        return arr;
      }
    }
  }
  async listDatesInBetween(start_date: any, end_date: any, days: any) {
    const daylist = await this.getDaysArray(new Date(start_date), new Date(end_date), days);
    daylist.map((v: any) => v.toISOString().slice(0, 10)).join('');
    return daylist;
  }

  /*
  get weeks list between start date and end date
  */
  async listWeeks(start_date: any, end_date: any, days: any) {
    const daylist = await this.listDatesInBetween(new Date(start_date), new Date(end_date), days);
    // console.log({ daylist });

    const arr: any[] = [];
    daylist.map((v: any) => {
      const week = moment(v, 'MMDDYYYY').week();
      if (!arr.includes(week)) {
        arr.push(week);
      }
    });
    return arr;
  }
  /*
  get months list between start date and end date
  */
  async listMonths(start_date: any, end_date: any, days: any) {
    const daylist = await this.listDatesInBetween(new Date(start_date), new Date(end_date), days);
    const arr: any[] = [];
    daylist.map((v: any) => {
      // get Month of v
      const month = moment(v).format('MMMM');
      if (!arr.includes(month)) {
        arr.push(month);
      }
    });
    return arr;
  }
  async listMonthsFR(start_date: any, end_date: any, days: any) {
    const daylist = await this.listDatesInBetween(new Date(start_date), new Date(end_date), days);
    const arr: any[] = [];
    daylist.map((v: any) => {
      // get Month of v
      const month = moment(v).locale('fr').format('MMMM');
      if (!arr.includes(month)) {
        arr.push(month);
      }
    });
    return arr;
  }
}
export default new Utils();
