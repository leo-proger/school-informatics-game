// app/data/dialogues-round2.ts

import { DialogueLine } from "../lib/types";

export const round2Start: DialogueLine[] = [
  {
    character: "protocol",
    text: "Хочу поздравить всех участников, что прошли в финальный тур!",
    delay: 1500,
    event: "success",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Вам предстоит встретиться лицом к лицу с врагом, что паразитирует нашу сеть.",
    delay: 2500,
    event: "info",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Прошу вас, продолжайте свой путь.",
    delay: 2000,
    event: "info",
    mood: "mouth-open"
  },
  {
    character: "nexus",
    text: "Вы восстановили повреждённые файлы... но экран вдруг начинает светиться и перед вами появляется...",
    delay: 3000,
    event: "warning"
  },
  {
    character: "void",
    text: "Да как вы посмели...",
    delay: 2000,
    event: "danger",
    mood: "angry"
  },
  {
    character: "protocol",
    text: "ВНИМАНИЕ! Появился вирус VOID! Просьба для всех участников ввести код доступа!",
    delay: 2500,
    event: "danger",
    mood: "mouth-open"
  },
  {
    character: "nexus",
    text: "Вы просто вводите имеющиеся у вас буквы...",
    delay: 2000,
    event: "info"
  },
  {
    character: "nexus",
    text: "И после очередного светового шоу, вы видите перед собой ещё один зашифрованный файл.",
    delay: 3000,
    event: "puzzle"
  },
  {
    character: "nexus",
    text: "Судя по всему, он на несколько уровней выше по сложности, чем предыдущие...",
    delay: 2500,
    event: "warning"
  },
  {
    character: "nexus",
    text: "Ну, думаю, время приступить за дело!",
    delay: 2000,
    event: "info"
  }
];

// Голограмма VOID (появляется после 3-х заданий)
export const voidHologramDialogues = [
  {
    character: "void",
    text: "Вы думаете, что сможете меня остановить? Я — бесконечность!",
    mood: "angry"
  },
  {
    character: "void",
    text: "Ваши алгоритмы — ничто перед моим хаосом!",
    mood: "angry"
  },
  {
    character: "void",
    text: "Я проник в каждый уголок NEXUS. Вы никогда не найдёте все мои следы!",
    mood: "angry"
  },
  {
    character: "void",
    text: "Но... как вы это делаете? Мои цепи разрушаются...",
    mood: "happy"  // ← Удивлённый
  },
  {
    character: "void",
    text: "НЕТ! Я не позволю вам уничтожить меня!",
    mood: "angry"
  }
];

export const round2Complete: DialogueLine[] = [
  {
    character: "void",
    text: "Этого не может быть... чёртовы людишки...",
    delay: 2000,
    event: "danger",
    mood: "angry"
  },
  {
    character: "protocol",
    text: "Поздравляю! Вы успешно справились с заданием.",
    delay: 1500,
    event: "success",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Отчёт о ваших действиях автоматически отправится в нашу базу данных, как и вознаграждение от нас к вам.",
    delay: 2500,
    event: "success",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Спасибо, что не остались в стороне и помогли с уничтожением!",
    delay: 2000,
    event: "success",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Ждём вас снова!",
    delay: 1500,
    event: "success",
    mood: "mouth-closed"
  }
];