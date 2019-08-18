const getRandomTask = () => {
  return {
    description: [
      `Изучить теорию`,
      `Сделать домашку`,
      `Пройти интенсив на соточку`,
    ][Math.floor(Math.random() * 3)],
    dueDate: Date.now() + [-1, 1][Math.floor(Math.random() * 2)] * Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000,
    repeatingDays: {
      mo: false,
      tu: false,
      we: Boolean(Math.round(Math.random())),
      th: false,
      fr: false,
      sa: false,
      su: false,
    },
    tags: [
      `homework`,
      `theory`,
      `practice`,
      `intensive`,
      `keks`,
    ].slice(0, Math.floor(Math.random() * 4)),
    color: [
      `black`,
      `yellow`,
      `blue`,
      `green`,
      `pink`,
    ][Math.floor(Math.random() * 5)],
    isFavorite: Boolean(Math.round(Math.random())),
    isArchive: Boolean(Math.round(Math.random())),
    get isOverdue() {
      return Date.now() > this.dueDate;
    }
  };
};

const tasks = [];

for (let i = 0; i < 8; i++) {
  tasks.push(getRandomTask());
}

const filters = [
  {
    title: `All`,
    count: tasks.length,
  },
  {
    title: `Overdue`,
    count: tasks.filter((task) => {
      return task.isOverdue;
    }).length,
  },
  {
    title: `Today`,
    count: tasks.filter((task) => {
      return new Date(task.dueDate).toDateString() === new Date(Date.now()).toDateString();
    }).length,
  },
  {
    title: `Favorites`,
    count: tasks.filter((task) => {
      return task.isFavorite;
    }).length,
  },
  {
    title: `Repeating`,
    count: tasks.filter((task) => {
      return Object.keys(task.repeatingDays).length;
    }).length,
  },
  {
    title: `Tags`,
    count: tasks.filter((task) => {
      return task.tags.length;
    }).length,
  },
  {
    title: `Archive`,
    count: tasks.filter((task) => {
      return task.isArchive.length;
    }).length,
  }
];

export {tasks, filters};
