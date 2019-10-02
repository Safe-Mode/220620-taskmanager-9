import moment from 'moment';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.css';
import Chart from 'chart.js';
import {COLORS, TAGS, DAYS_PER_WEEK} from '../const';
import {render} from '../util';
import {getDaySettings, getTagSettings, getColorSettings} from '../settings';
import {Stat} from '../components/stat';

class StatController {
  constructor(container) {
    this._container = container;
    this._tasks = [];
    this._stat = new Stat();
    this._colorsChart = null;
    this._tagsChart = null;
    this._daysChart = null;
    this._range = null;
  }

  _renderStat(tasks) {
    const colorsCtx = this._stat
      .getElement()
      .querySelector(`.statistic__colors`);
    const tagsCtx = this._stat
      .getElement()
      .querySelector(`.statistic__tags`);
    const daysCtx = this._stat
      .getElement()
      .querySelector(`.statistic__days`);
    const taskColors = tasks.map((task) => task.color);
    const taskTags = tasks.reduce((acc, task) => {
      return acc.concat(task.tags.map((tag) => tag));
    }, []);

    const colorsData = COLORS.map((color) => {
      return taskColors.filter((taskColor) => taskColor === color).length;
    });

    const tagsData = TAGS.map((tag) => {
      return taskTags.filter((taskTag) => taskTag === tag).length;
    });

    const taskDays = tasks.map((task) => {
      const dueDate = moment(task.dueDate);

      dueDate.hours(0);
      dueDate.minutes(0);
      dueDate.seconds(0);
      dueDate.milliseconds(0);

      return dueDate;
    });

    const daysData = new Array(DAYS_PER_WEEK).fill(``).map((it, i) => {
      const week = moment(this._range[0]).week();
      const day = moment().week(week).day(i + 1);

      day.hours(0);
      day.minutes(0);
      day.seconds(0);
      day.milliseconds(0);

      const rangeTaskDays = taskDays.filter((taskDay) => {
        return day.valueOf() === taskDay.valueOf();
      });

      return {
        dateStr: day.format(`DD MMM`),
        count: rangeTaskDays.length,
      };
    });

    this._tasks = tasks;
    this._colorsChart = new Chart(colorsCtx, getColorSettings(colorsData));
    this._tagsChart = new Chart(tagsCtx, getTagSettings(tagsData));
    this._daysChart = new Chart(daysCtx, getDaySettings(daysData));
  }

  hide() {
    this._stat
      .getElement()
      .classList.add(`visually-hidden`);
  }

  show(tasks) {
    this._renderStat(tasks);
    this._stat
      .getElement()
      .classList.remove(`visually-hidden`);
  }

  init() {
    const statEl = this._stat.getElement();
    const periodFieldEl = statEl.querySelector(`.statistic__period-input`);

    const setRange = (selectedDates) => {
      this._range = selectedDates.map((date) => date.getTime());
    };

    const onReady = (selectedDates) => {
      setRange.bind(this)(selectedDates);
    };

    const onValueUpdate = (selectedDates) => {
      if (selectedDates.length > 1) {
        setRange.bind(this)(selectedDates);

        const datesData = this._tasks.filter((task) => {
          return task.dueDate >= this._range[0] && task.dueDate <= this._range[1];
        });

        this._renderStat.bind(this)(datesData);
      }
    };

    flatpickr(periodFieldEl, {
      mode: `range`,
      altInput: true,
      allowInput: true,
      defaultDate: [
        moment().week(moment().week() - 1).day(1).format(`YYYY-MM-DD`),
        moment().week(moment().week() - 1).day(DAYS_PER_WEEK).format(`YYYY-MM-DD`)
      ],
      onReady,
      onValueUpdate,
    });

    render(this._container, statEl);
  }
}

export {StatController};
