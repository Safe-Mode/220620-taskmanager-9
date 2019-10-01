import moment from 'moment';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.css';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {render} from '../util';
import {Stat} from '../components/stat';

class StatController {
  constructor(container, tasks) {
    this._container = container;
    this._tasks = tasks;
    this._stat = new Stat();
  }

  hide() {
    this._stat
      .getElement()
      .classList.add(`visually-hidden`);
  }

  show() {
    this._stat
      .getElement()
      .classList.remove(`visually-hidden`);
  }

  init() {
    const statEl = this._stat.getElement();
    const periodFieldEl = statEl.querySelector(`.statistic__period-input`);
    const colorsCtx = statEl.querySelector(`.statistic__colors`);

    flatpickr(periodFieldEl, {
      mode: `range`,
      altInput: true,
      allowInput: true,
      defaultDate: [
        moment().week(moment().week() - 1).day(1).format(`YYYY-MM-DD`),
        moment().week(moment().week() - 1).day(7).format(`YYYY-MM-DD`)
      ],
    });

    const colorsChart = new Chart(colorsCtx, {
      plugins: [ChartDataLabels],
      type: `pie`,
      data: {
        labels: [`#pink`, `#yellow`, `#blue`, `#black`, `#green`],
        datasets: [{
          data: [5, 25, 15, 10, 30],
          backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: COLORS`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    });

    console.log(colorsChart);


    render(this._container, statEl);
  }
}

export {StatController};
