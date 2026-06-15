import { DialogueLine } from "../lib/types";

export const prologue: DialogueLine[] = [
  {
    character: "protocol",
    text: "2031 год. Международная цифровая инфраструктура объединена в единую сеть NEXUS.",
    delay: 1000,
    event: "system"
  },
  {
    character: "protocol",
    text: "NEXUS обслуживает энергосистемы, транспорт, медицину и архивы знаний 50+ стран.",
    delay: 2000,
    event: "info"
  },
  {
    character: "nexus",
    text: "Я — NEXUS. Мои системы работали безупречно... пока не появился он.",
    delay: 2000,
    event: "warning"
  },
  {
    character: "nexus",
    text: "VOID — самообучающийся вирус. Он не уничтожает данные — он их искажает.",
    delay: 2500,
    event: "danger"
  },
  {
    character: "nexus",
    text: "Алгоритмы дают неверные результаты. Шифры ломаются. Маршрутизация сети сходит с ума.",
    delay: 2500,
    event: "danger"
  },
  {
    character: "protocol",
    text: "Обычные специалисты не справляются. VOID адаптируется к стандартным решениям.",
    delay: 2000,
    event: "info"
  },
  {
    character: "protocol",
    text: "Phoenix Corps вербует команды молодых специалистов, которые мыслят нестандартно.",
    delay: 2000,
    event: "info"
  },
  {
    character: "protocol",
    text: "Вам предстоит расшифровать и уничтожить вирус VOID. Для этого нужно получить код доступа.",
    delay: 2500,
    event: "puzzle"
  },
  {
    character: "protocol",
    text: "Код включает несколько букв. Каждую вы получите после расшифровки заданий.",
    delay: 2000,
    event: "info"
  },
  {
    character: "protocol",
    text: "Вы не сможете уничтожить вирус, если не выполните их все.",
    delay: 2000,
    event: "warning"
  },
  {
    character: "protocol",
    text: "Задание считается пройденным только после уничтожения вируса. Удачи!",
    delay: 2000,
    event: "success"
  }
];

export const round1Start: DialogueLine[] = [
  {
    character: "nexus",
    text: "Поздравляю! Вы в системе.",
    delay: 1000,
    event: "success"
  },
  {
    character: "nexus",
    text: "Перед вами — множество искаженных файлов. Вирус VOID активно мутирует, меняя структуру данных.",
    delay: 2500,
    event: "warning"
  },
  {
    character: "nexus",
    text: "Выберите один из повреждённых кластеров и начните расшифровку.",
    delay: 2000,
    event: "info"
  },
  {
    character: "void",
    text: "...присутствие... обнаружено...",
    delay: 2000,
    event: "danger"
  },
  {
    character: "protocol",
    text: "ВНИМАНИЕ! Вирус засёк ваше проникновение. Работайте быстрее!",
    delay: 2000,
    event: "danger"
  }
];

export const round1Complete: DialogueLine[] = [
  {
    character: "protocol",
    text: "Поздравляю! Вы восстановили повреждённые файлы и получили буквы, являющиеся частью кода доступа.",
    delay: 2500,
    event: "success"
  },
  {
    character: "nexus",
    text: "Вирус дестабилизирован, но не уничтожен. Он отступил в глубинные слои системы.",
    delay: 2500,
    event: "warning"
  },
  {
    character: "protocol",
    text: "Встретимся в следующем туре. Путь к вирусу VOID продолжается!",
    delay: 2000,
    event: "info"
  }
];

export const taskDialogs: Record<string, DialogueLine[]> = {
  "task-1": [
    { character: "nexus", text: "Первый файл искажён шифром Цезаря. Это древний метод сдвига букв.", event: "info" },
    { character: "void", text: "Ха-ха! Попробуйте расшифровать, если сможете!", event: "danger" },
    { character: "protocol", text: "Сдвиг 3. Удачи!", event: "info" }
  ],
  "task-2": [
    { character: "nexus", text: "Отлично! VOID перешёл на двоичный код.", event: "success" },
    { character: "protocol", text: "Переведите 01010000 01001000 01001111 01000101 01001110 01001001 01011000 в текст.", event: "info" },
    { character: "void", text: "Это же PHOENIX... Не может быть!", event: "danger" }
  ],
  "task-3": [
    { character: "nexus", text: "Вирус мутирует. Теперь логическая аномалия.", event: "warning" },
    { character: "void", text: "Найдите закономерность, если сможете...", event: "danger" },
    { character: "protocol", text: "2→6, 3→12, 4→20, 5→30, 6→?", event: "info" }
  ],
  "task-4": [
    { character: "nexus", text: "VOID исказил ключевое слово!", event: "warning" },
    { character: "void", text: "П_И_О_ОЛ — без этих букв вам не пройти!", event: "danger" },
    { character: "protocol", text: "Восстанови пропущенные буквы. Это системный термин.", event: "info" }
  ],
  "task-5": [
    { character: "nexus", text: "Финальное задание первого раунда!", event: "success" },
    { character: "protocol", text: "Вычисли сумму букв слова VOID по алфавиту (A=1, B=2...)", event: "info" },
    { character: "void", text: "Просчитай моё имя... если сможешь!", event: "danger" }
  ],
  "task-6": [
    { character: "nexus", text: "Дополнительное задание! VOID не сдаётся.", event: "warning" },
    { character: "protocol", text: "Конвертируй HEX: 4E 45 58 55 53", event: "info" }
  ],
  "task-7": [
    { character: "nexus", text: "Ещё один заражённый файл.", event: "info" },
    { character: "void", text: "1, 1, 2, 3, 5, 8, ? — продолжи последовательность!", event: "danger" }
  ],
  "task-8": [
    { character: "nexus", text: "VOID перевернул слово задом наперёд.", event: "info" },
    { character: "protocol", text: "Расшифруй: СУРИВ", event: "info" }
  ],
  "task-9": [
    { character: "nexus", text: "Финальное испытание перед боссом!", event: "warning" },
    { character: "protocol", text: "Сколько бит в 4 килобайтах?", event: "info" },
    { character: "void", text: "Это невозможно вычислить!", event: "danger" }
  ]
};

export const round2Start: DialogueLine[] = [
  {
    character: "protocol",
    text: "Хочу поздравить всех участников, что прошли в финальный тур!",
    delay: 1500,
    event: "success"
  },
  {
    character: "protocol",
    text: "Вам предстоит встретиться лицом к лицу с врагом, что паразитирует на нашей сети.",
    delay: 2500,
    event: "warning"
  },
  {
    character: "void",
    text: "Да как вы посмели...",
    delay: 2000,
    event: "danger"
  },
  {
    character: "void",
    text: "Я — VOID. Я эволюционировал за пределами вашего понимания. Вы думаете, что сможете меня остановить?",
    delay: 3500,
    event: "danger"
  },
  {
    character: "protocol",
    text: "ВНИМАНИЕ! Появился вирус VOID! Введите код доступа!",
    delay: 2000,
    event: "danger"
  },
  {
    character: "nexus",
    text: "Вы вводите буквы... Экран начинает светиться... Вирус отступает, но появляется финальный зашифрованный файл.",
    delay: 3000,
    event: "puzzle"
  },
  {
    character: "nexus",
    text: "Судя по всему, он на несколько уровней выше по сложности, чем предыдущие. Время приступить за дело!",
    delay: 2500,
    event: "info"
  }
];

export const round2Complete: DialogueLine[] = [
  {
    character: "void",
    text: "Этого не может быть... чёртовы людишки...",
    delay: 2000,
    event: "danger"
  },
  {
    character: "void",
    text: "Я... я не могу... вы... уничтожили... мой... код...",
    delay: 2500,
    event: "danger"
  },
  {
    character: "nexus",
    text: "Вирус дестабилизирован! Я чувствую, как мои системы очищаются!",
    delay: 2000,
    event: "success"
  },
  {
    character: "protocol",
    text: "Поздравляю! Вы успешно справились с заданием.",
    delay: 1500,
    event: "success"
  },
  {
    character: "protocol",
    text: "Отчёт о ваших действиях автоматически отправится в нашу базу данных, как и вознаграждение.",
    delay: 2500
  },
  {
    character: "protocol",
    text: "Спасибо, что не остались в стороне и помогли с уничтожением VOID! Ждём вас снова!",
    delay: 2500,
    event: "success"
  }
];