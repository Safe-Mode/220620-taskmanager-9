export default {
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
  isMissed: Boolean(Math.round(Math.random())),
};
