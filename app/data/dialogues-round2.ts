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
    character: "protocol",
    text: "Вы восстановили повреждённые файлы... но экран вдруг начинает светиться и перед вами появляется...",
    delay: 3000,
    event: "warning",
    mood: "mouth-closed"
  },
  {
    character: "void",
    text: "Хорошая попытка. Я уже стал частью этой сети. Вы не сможете так просто от меня избавиться!",
    delay: 2000,
    event: "danger",
    mood: "angry"
  },
  {
    character: "protocol",
    text: "Скорее! Нужно ввести код в систему! Пока он здесь, нужно его ослабить!",
    delay: 2500,
    event: "danger",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Вы просто вводите имеющиеся у вас буквы...",
    delay: 2000,
    event: "info",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "И после очередного светового шоу, вы видите перед собой ещё один зашифрованный файл.",
    delay: 3000,
    event: "puzzle",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Судя по всему, он на несколько уровней выше по сложности, чем предыдущие...",
    delay: 2500,
    event: "warning",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Ну, думаю, время приступить за дело!",
    delay: 2000,
    event: "info",
    mood: "mouth-open"
  }
];

// ✅ Исправлено: добавлен тип DialogueLine[]
export const voidHologramDialogues: DialogueLine[] = [
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
    text: "Но... как вы это делаете? Мои цепи разрушаются...",
    mood: "happy"
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
    text: "Пусть я и исчезну, но мой след останется в логах. Пусть вы меня победили, но ваша сеть останется беззащитной на долгие годы. Пусть вы меня и стёрли, но это не победа.",
    delay: 2000,
    event: "danger",
    mood: "angry"
  },
  {
    character: "protocol",
    text: "В какой-то степени он прав, потому что во время его бесчинств никто не мог взломать систему, которую он создал, включая нас и наших противников.",
    delay: 3000,
    event: "info",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Но в любом случае мы его уничтожили, а это успех! Поздравляю с победой!",
    delay: 2500,
    event: "success",
    mood: "mouth-open"
  },
  {
    character: "protocol",
    text: "Отчёт о ваших действиях автоматически отправится в нашу базу данных. Ваше вознаграждение мы отправим чуть позже.",
    delay: 2500,
    event: "success",
    mood: "mouth-closed"
  },
  {
    character: "protocol",
    text: "Спасибо, что не остались в стороне. Ждём вас снова, наши дорогие участники!",
    delay: 2500,
    event: "success",
    mood: "mouth-open"
  }
];