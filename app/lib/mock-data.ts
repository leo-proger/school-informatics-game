export interface MockTeam {
  rank: number;
  name: string;
  school: string;
  city: string;
  country: string;
  score: number;
  tour1: boolean;
  tour2: boolean;
}

export const MOCK_LEADERBOARD: MockTeam[] = [
  { rank: 1, name: 'Nexus Breakers', school: 'Лицей №1', city: 'Москва', country: 'Россия', score: 920, tour1: true, tour2: true },
  { rank: 2, name: 'VOID Hunters', school: 'Гимназия №5', city: 'Санкт-Петербург', country: 'Россия', score: 870, tour1: true, tour2: true },
  { rank: 3, name: 'Phoenix Rising', school: 'Школа №47', city: 'Казань', country: 'Россия', score: 810, tour1: true, tour2: true },
  { rank: 4, name: 'Cyber Wolves', school: 'Лицей №3', city: 'Москва', country: 'Россия', score: 780, tour1: true, tour2: false },
  { rank: 5, name: 'Ghost Protocol', school: 'Гимназия №2', city: 'Новосибирск', country: 'Россия', score: 740, tour1: true, tour2: false },
  { rank: 6, name: 'Data Reapers', school: 'Школа №15', city: 'Екатеринбург', country: 'Россия', score: 700, tour1: true, tour2: false },
  { rank: 7, name: 'Binary Stars', school: 'Лицей №7', city: 'Санкт-Петербург', country: 'Россия', score: 660, tour1: true, tour2: false },
  { rank: 8, name: 'Null Pointer', school: 'Гимназия №8', city: 'Казань', country: 'Россия', score: 620, tour1: true, tour2: false },
  { rank: 9, name: 'Kernel Panic', school: 'Школа №23', city: 'Ростов-на-Дону', country: 'Россия', score: 580, tour1: true, tour2: false },
  { rank: 10, name: 'Stack Overflow', school: 'Лицей №12', city: 'Нижний Новгород', country: 'Россия', score: 540, tour1: false, tour2: false },
  { rank: 11, name: 'Root Access', school: 'Гимназия №4', city: 'Москва', country: 'Россия', score: 500, tour1: false, tour2: false },
  { rank: 12, name: 'Dark Matter', school: 'Школа №31', city: 'Уфа', country: 'Россия', score: 460, tour1: false, tour2: false },
  { rank: 13, name: 'Firewall Elite', school: 'Лицей №9', city: 'Пермь', country: 'Россия', score: 420, tour1: false, tour2: false },
  { rank: 14, name: 'Zero Day', school: 'Гимназия №6', city: 'Воронеж', country: 'Россия', score: 380, tour1: false, tour2: false },
  { rank: 15, name: 'Hex Demons', school: 'Школа №19', city: 'Красноярск', country: 'Россия', score: 340, tour1: false, tour2: false },
];

export interface Task {
  id: number;
  title: string;
  description: string;
  hint: string;
  points: number;
  tour: 1 | 2;
  type: 'base' | 'extra' | 'boss';
  minTeamSize?: number;
}

export const TASKS: Task[] = [
  {
    id: 1,
    title: 'Шифр Цезаря',
    description: 'Вирус VOID зашифровал первый файл. Расшифруйте сообщение, используя шифр Цезаря.',
    hint: 'Шифрование выполняется путём замены каждой буквы на букву, стоящую на N позиций дальше в алфавите. Пример: КОТ → ОТЦ (сдвиг 4)',
    points: 100,
    tour: 1,
    type: 'base',
  },
  {
    id: 2,
    title: 'Двоичный код',
    description: 'Перехваченный пакет данных содержит бинарную последовательность. Декодируйте её.',
    hint: 'Каждый символ ASCII кодируется 8 битами. Начните с разбивки строки на группы по 8.',
    points: 120,
    tour: 1,
    type: 'base',
  },
  {
    id: 3,
    title: 'Маскировка IP',
    description: 'VOID скрыл свой адрес в сети. Найдите реальный IP-адрес по маске подсети.',
    hint: 'Примените побитовую операцию AND к IP-адресу и маске подсети.',
    points: 150,
    tour: 1,
    type: 'base',
  },
  {
    id: 4,
    title: 'Анаграмма NEXUS',
    description: 'Искажённые файлы содержат ключевые слова — но буквы перемешаны. Восстановите порядок.',
    hint: 'Каждое слово является анаграммой термина из области кибербезопасности.',
    points: 130,
    tour: 1,
    type: 'base',
  },
  {
    id: 5,
    title: 'Матрица ошибок',
    description: 'В логах системы скрыто послание. Найдите паттерн в числовой матрице.',
    hint: 'Читайте матрицу по диагонали, начиная с верхнего левого угла.',
    points: 140,
    tour: 1,
    type: 'base',
  },
  {
    id: 6,
    title: 'Стеганография',
    description: 'Дополнительный файл: VOID спрятал данные в изображении. Найдите скрытый текст.',
    hint: 'Проверьте значения пикселей в LSB (наименее значимый бит) каждого цветового канала.',
    points: 160,
    tour: 1,
    type: 'extra',
  },
  {
    id: 7,
    title: 'Протокол VOID — Уровень 1',
    description: 'Финальное столкновение. Введите собранный код доступа для расшифровки вируса.',
    hint: 'Код состоит из букв, полученных при решении заданий тура 1.',
    points: 300,
    tour: 2,
    type: 'boss',
    minTeamSize: 1,
  },
  {
    id: 8,
    title: 'Протокол VOID — Уровень 3',
    description: 'Сложная версия финального задания для команд из 3 человек.',
    hint: 'Требуется параллельное решение трёх независимых подзадач.',
    points: 500,
    tour: 2,
    type: 'boss',
    minTeamSize: 3,
  },
  {
    id: 9,
    title: 'Протокол VOID — Уровень 5',
    description: 'Максимальная сложность. Только для команды полного состава.',
    hint: 'Каждый участник получает свой фрагмент ключа. Объедините все части.',
    points: 800,
    tour: 2,
    type: 'boss',
    minTeamSize: 5,
  },
];

export const TOURNAMENT_DATES = {
  start: new Date('2026-06-06T09:00:00'),
  tour1Start: new Date('2026-06-09T10:00:00'),
  tour1End: new Date('2026-06-09T10:40:00'),
  tour2Start: new Date('2026-06-15T11:00:00'),
  tour2End: new Date('2026-06-15T12:30:00'),
  end: new Date('2026-06-20T18:00:00'),
};
