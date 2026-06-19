import { DialogueLine } from "../lib/types";

export const prologue: DialogueLine[] = [
  {
    character: "protocol",
    text: "2031 год. Международная цифровая инфраструктура объединена в единую сеть NEXUS.",
    delay: 1000,
    event: "system",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "NEXUS обслуживает энергосистемы, транспорт, медицину и архивы знаний 50+ стран.",
    delay: 2000,
    event: "info",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Я — NEXUS. Мои системы работали безупречно... пока не появился он.",
    delay: 2000,
    event: "warning",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "VOID — самообучающийся вирус. Он не уничтожает данные — он их искажает.",
    delay: 2500,
    event: "danger",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Алгоритмы дают неверные результаты. Шифры ломаются. Маршрутизация сети сходит с ума.",
    delay: 2500,
    event: "danger",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Обычные специалисты не справляются. VOID адаптируется к стандартным решениям.",
    delay: 2000,
    event: "info",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Phoenix Corps вербует команды молодых специалистов, которые мыслят нестандартно.",
    delay: 2000,
    event: "info",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Вам предстоит расшифровать и уничтожить вирус VOID. Для этого нужно получить код доступа.",
    delay: 2500,
    event: "puzzle",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Код включает несколько букв. Каждую вы получите после расшифровки заданий.",
    delay: 2000,
    event: "info",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Вы не сможете уничтожить вирус, если не выполните их все.",
    delay: 2000,
    event: "warning",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Задание считается пройденным только после уничтожения вируса. Удачи!",
    delay: 2000,
    event: "success",
    mood: "mouth-open"
  }
];

export const round1Start: DialogueLine[] = [
  {
    character: "protocol",
    text: "Поздравляю! Вы в системе.",
    delay: 1000,
    event: "success",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Перед вами — множество искаженных файлов. Вирус VOID активно мутирует, меняя структуру данных.",
    delay: 2500,
    event: "warning",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Выберите один из повреждённых кластеров и начните расшифровку.",
    delay: 2000,
    event: "info",
    mood: "mouth-open"
  },
  {
    character: "void",
    text: "...присутствие... обнаружено...",
    delay: 2000,
    event: "danger",
    mood: "angry"
  },
  {
    character: "protocol",
    text: "ВНИМАНИЕ! Вирус засёк ваше проникновение. Работайте быстрее!",
    delay: 2000,
    event: "danger",
    mood: "mouth-open"
  }
];

export const round1Complete: DialogueLine[] = [
  {
    character: "protocol",
    text: "Поздравляю! Вы восстановили повреждённые файлы и получили буквы, являющиеся частью кода доступа.",
    delay: 2500,
    event: "success",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Вирус дестабилизирован, но не уничтожен. Он отступил в глубинные слои системы.",
    delay: 2500,
    event: "warning",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Встретимся в следующем туре. Путь к вирусу VOID продолжается!",
    delay: 2000,
    event: "info",
    mood: "mouth-open"
  }
];

export const taskDialogs: Record<string, DialogueLine[]> = {
  "task-1": [
    { character: "protocol", text: "Это наши ключи к базам данных, но они все перемешаны. Судя по всему, это шифр Цезаря.", event: "info", mood: "mouth-open" },
    { character: "protocol", text: "Поздравляю! Вы получили первую букву — Ф!", event: "success", mood: "mouth-closed" }
  ],
  "task-2": [
    { character: "protocol", text: "Это наши потоки данных, теперь нам ясна причина отсутствия к ним доступа. Они зашифрованы двоичной системой.", event: "info", mood: "mouth-closed" },
    { character: "protocol", text: "Отлично! Вторая буква — Е! Доступ к данным возвращён.", event: "success", mood: "mouth-open" }
  ],
  "task-3": [
    { character: "protocol", text: "Кажется в этих данных аномалия, причем логическая. Давайте разберёмся с ней!", event: "info", mood: "mouth-open" },
    { character: "protocol", text: "Третья буква — Н! Очень хорошо!", event: "success", mood: "mouth-closed" },
    { character: "void", text: "Похоже, я понял в чём дело.", event: "danger", mood: "angry" },
    { character: "protocol", text: "Ошибка: несанкционированное восстановление файлов.", event: "danger", mood: "mouth-open" },
    { character: "protocol", text: "Это плохо! Видимо он уже догадался, чего мы пытаемся добиться. Нужно ускоряться!", event: "danger", mood: "mouth-open" }
  ],
  "task-4": [
    { character: "protocol", text: "VOID исказил наш первоначальный код, из-за этого в словах мутировали и в них пропадают буквы. Давайте восстановим их!", event: "info", mood: "mouth-closed" },
    { character: "protocol", text: "Четвёртая буква — И! Супер!", event: "success", mood: "mouth-open" }
  ],
  "task-5": [
    { character: "protocol", text: "Похоже вирус заблокировал нашу сеть и для её разблокировки нужно число.", event: "info", mood: "mouth-open" },
    { character: "protocol", text: "Пятая буква — К! Потрясающе!", event: "success", mood: "mouth-closed" }
  ],
  "task-6": [
    { character: "protocol", text: "Снова зашифрованные текстовые данные. Проще простого!", event: "info", mood: "mouth-closed" },
    { character: "protocol", text: "Шестая буква — С! Отлично!", event: "success", mood: "mouth-open" },
    { character: "protocol", text: "Обнаружена попытка откатить изменения. Уровень угрозы: критический.", event: "danger", mood: "mouth-open" },
    { character: "protocol", text: "Вирус начинает нам мешать. Осталось совсем немного, нужно успеть!", event: "danger", mood: "mouth-open" }
  ],
  "task-7": [
    { character: "protocol", text: "Похоже некоторые числовые данные связались друг с другом, давайте их распутаем.", event: "info", mood: "mouth-open" },
    { character: "protocol", text: "Седьмая буква — неизвестна. Возможно, это часть кода, которую мы пока не можем расшифровать.", event: "success", mood: "mouth-closed" }
  ],
  "task-8": [
    { character: "protocol", text: "Очередная текстовая шифровка другого вида, решите её еще разок?", event: "info", mood: "mouth-closed" },
    { character: "protocol", text: "Восьмая буква собрана. Неплохо!", event: "success", mood: "mouth-open" }
  ],
  "task-9": [
    { character: "protocol", text: "Требуется разблокировать доступ к хранилищу данных, они необходимы нам для сбора информации. Прошу не подведите!", event: "info", mood: "mouth-open" },
    { character: "protocol", text: "Девятая буква собрана. Отлично!", event: "success", mood: "mouth-closed" },
    { character: "protocol", text: "Отлично! Мы успели. Поздравляю! Вы восстановили все поврежденные файлы и получили буквы.", event: "success", mood: "mouth-open" },
    { character: "protocol", text: "Теперь мы сможем ослабить вирус и уничтожить его! Встретимся в следующем туре на пути к нему!", event: "success", mood: "mouth-closed" }
  ]
};