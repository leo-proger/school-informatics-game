"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TaskMap, { TaskNode } from "@/app/components/tasks/TaskMap";
import TaskBackground from "@/app/components/layout/TaskBackground";
import TopHUD from "@/app/components/layout/TopHUD";
import DialogueBox from "@/app/components/dialogue/DialogueBox";
import PuzzleModal from "@/app/components/tasks/PuzzleModal";
import { previewText } from "@/app/components/tasks/TaskDescription";
import { getCharacter } from "@/app/lib/characters";
import { round2Start, round2Complete, voidHologramDialogues } from "@/app/data/dialogues-round2";
import { Round2Task } from "@/app/data/tasks-round2";
import { supabase } from "@/app/lib/supabase";
import { useAuth } from "@/app/lib/auth-context";
import { SESSION_KEY, addScore } from "@/app/lib/game-actions";
import { useAutoSaveProgress } from "@/app/lib/game-hooks";
import VideoPlayer from "@/app/components/ui/VideoPlayer";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

const ROUND2_TASK_POINTS = 500;

async function setTour2Completed() {
  const teamId = localStorage.getItem(SESSION_KEY);
  if (!teamId) return;
  await supabase.from("teams").update({ tour2_completed: true }).eq("id", teamId);
}

export const SAVE_KEY = "phoenix_round2_progress";

type Phase = "intro" | "dialogue" | "boss" | "victory" | "outro";

interface SavedData {
  phase?: string;
  dialogueIndex?: number;
  victoryIndex?: number;
  completedTasks?: string[];
  failedTasks?: string[];
  activeTaskId?: string;
  activeTaskIndex?: number; // совместимость со старыми сохранениями
  showVoidHologram?: boolean;
  showHologramDialogue?: boolean;
  hologramIndex?: number;
}

// Узлы карты с последовательной разблокировкой — как в туре 1 (generateNodes).
function buildNodes(
  tasks: Round2Task[],
  completed: string[],
  failed: string[],
  activeId: string,
): TaskNode[] {
  return tasks.map((task, index) => {
    const isUnlocked =
      index === 0 ||
      completed.includes(tasks[index - 1].id) ||
      failed.includes(tasks[index - 1].id);
    const isCompleted = completed.includes(task.id);
    const isFailed = failed.includes(task.id);
    return {
      id: task.id,
      title: task.shortTitle,
      description: previewText(task.description),
      x: 15 + (index % 3) * 30,
      y: 20 + Math.floor(index / 3) * 30,
      active: task.id === activeId && isUnlocked && !isFailed && !isCompleted,
      completed: isCompleted,
      locked: !isUnlocked,
      failed: isFailed,
    };
  });
}

function firstOpenTaskId(tasks: Round2Task[], completed: string[], failed: string[]): string {
  return tasks.find((t) => !completed.includes(t.id) && !failed.includes(t.id))?.id ?? "";
}

export default function Round2Page() {
  const router = useRouter();
  const { team, isLoading } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [tasks, setTasks] = useState<Round2Task[]>([]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [victoryIndex, setVictoryIndex] = useState(0);

  const [activeTaskId, setActiveTaskId] = useState<string>("");
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [failedTasks, setFailedTasks] = useState<string[]>([]);
  const [showVoidHologram, setShowVoidHologram] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const [showHologramDialogue, setShowHologramDialogue] = useState(false);
  const [hologramIndex, setHologramIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  // Блокировка — тур уже пройден
  useEffect(() => {
    if (!isLoading && team?.tour2Completed) {
      router.replace("/tasks");
    }
  }, [isLoading, team, router]);

  // Загрузка заданий + восстановление сохранения.
  // Ждём окончания авторизации: AuthProvider синхронизирует localStorage с БД.
  useEffect(() => {
    if (isLoading || loaded) return;
    supabase
      .from("tasks")
      .select("*")
      .eq("tour", 2)
      .order("task_number")
      .then(({ data }) => {
        const loadedTasks: Round2Task[] = (data ?? []).map((row) => ({
          id: row.id,
          shortTitle: row.short_title ?? row.title,
          fullTitle: row.title,
          description: row.description?.replace(/\\n/g, "\n"),
          options: row.options ? (JSON.parse(row.options) as string[]) : [],
          correctAnswer: row.answer,
          hint: row.hint?.replace(/\\n/g, "\n") ?? undefined,
          timeLimit: row.time_limit ?? undefined,
        }));
        setTasks(loadedTasks);

        let savedData: SavedData = {};
        try {
          const raw = localStorage.getItem(SAVE_KEY);
          if (raw) savedData = JSON.parse(raw);
        } catch {}

        const savedCompleted = savedData.completedTasks ?? [];
        const savedFailed = savedData.failedTasks ?? [];

        const savedPhase = (savedData.phase === "code" ? "dialogue" : savedData.phase ?? "intro") as Phase;
        setPhase(savedPhase);
        setDialogueIndex(savedData.dialogueIndex ?? 0);
        setVictoryIndex(savedData.victoryIndex ?? 0);
        setCompletedTasks(savedCompleted);
        setFailedTasks(savedFailed);
        setShowVoidHologram(savedData.showVoidHologram ?? false);
        setShowHologramDialogue(savedData.showHologramDialogue ?? false);
        setHologramIndex(savedData.hologramIndex ?? 0);

        // Активное задание: из сохранения (новый или старый формат) либо первое открытое
        let resolvedActiveId = savedData.activeTaskId ?? "";
        if (!resolvedActiveId && savedData.activeTaskIndex !== undefined) {
          resolvedActiveId = loadedTasks[savedData.activeTaskIndex]?.id ?? "";
        }
        if (
          !resolvedActiveId ||
          savedCompleted.includes(resolvedActiveId) ||
          savedFailed.includes(resolvedActiveId)
        ) {
          resolvedActiveId = firstOpenTaskId(loadedTasks, savedCompleted, savedFailed);
        }
        setActiveTaskId(resolvedActiveId);

        setLoaded(true);
      });
  }, [isLoading, loaded]);

  // Автосохранение в localStorage + Supabase (debounce 2s)
  useAutoSaveProgress(SAVE_KEY, "round2_progress", {
    phase,
    dialogueIndex,
    victoryIndex,
    completedTasks,
    failedTasks,
    activeTaskId,
    showVoidHologram,
    showHologramDialogue,
    hologramIndex,
  }, loaded);

  useEffect(() => {
    if (completedTasks.length === 3 && !showVoidHologram && !showHologramDialogue) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowVoidHologram(true);
      setShowHologramDialogue(true);
      setHologramIndex(0);
    }
  }, [completedTasks, showVoidHologram, showHologramDialogue]);

  const handleAnswerSelect = useCallback((answer: string) => {
    setSelectedAnswer(answer);
  }, []);

  const handleSubmitAnswer = useCallback(() => {
    if (!selectedAnswer) return false;

    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task) return false;
    const isCorrect = selectedAnswer === task.correctAnswer;

    setShowResult(isCorrect ? "correct" : "wrong");
    setTimeout(() => {
      setModalOpen(false);
      setSelectedAnswer("");
      setShowResult(null);
    }, 800);

    let newCompleted = completedTasks;
    let newFailed = failedTasks;

    if (isCorrect) {
      newCompleted = [...completedTasks, task.id];
      setCompletedTasks(newCompleted);
      addScore(ROUND2_TASK_POINTS);
    } else {
      newFailed = [...failedTasks, task.id];
      setFailedTasks(newFailed);
    }

    const allResolved = tasks.every((t) => newCompleted.includes(t.id) || newFailed.includes(t.id));
    if (allResolved) {
      if (newCompleted.length === tasks.length) setTour2Completed();
      setTimeout(() => {
        setPhase("victory");
        setVictoryIndex(0);
      }, 1500);
    } else {
      const nextId = firstOpenTaskId(tasks, newCompleted, newFailed);
      if (nextId) setActiveTaskId(nextId);
    }

    return isCorrect;
  }, [tasks, selectedAnswer, activeTaskId, completedTasks, failedTasks]);

  const handleTimeout = useCallback(() => {
    const task = tasks.find((t) => t.id === activeTaskId);
    if (!task) return;
    if (completedTasks.includes(task.id) || failedTasks.includes(task.id)) return;

    const newFailed = [...failedTasks, task.id];
    setFailedTasks(newFailed);
    setModalOpen(false);
    setSelectedAnswer("");
    setShowResult(null);

    const allResolved = tasks.every((t) => completedTasks.includes(t.id) || newFailed.includes(t.id));
    if (allResolved) {
      setTimeout(() => {
        setPhase("victory");
        setVictoryIndex(0);
      }, 500);
    } else {
      const nextId = firstOpenTaskId(tasks, completedTasks, newFailed);
      if (nextId) setActiveTaskId(nextId);
    }
  }, [tasks, activeTaskId, completedTasks, failedTasks]);

  if (!loaded) return <LoadingSpinner />;

  // ============ ИНТРО-РОЛИК (3.mp4) ============
  if (phase === "intro") {
    return <VideoPlayer key="round2-intro" src="/videos/3.mp4" onEnded={() => setPhase("dialogue")} onSkip={() => setPhase("dialogue")} />;
  }

  // === ДИАЛОГИ ===
  if (phase === "dialogue") {
    if (dialogueIndex >= round2Start.length) {
      setPhase("boss");
      return null;
    }
    const line = round2Start[dialogueIndex];
    const character = getCharacter(line.character);
    return (
      <TaskBackground>
        <TopHUD progress={50} letters={[]} title="ROUND 2 • VOID" />
        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color={character.color}
          text={line.text}
          mood={line.mood}
          onNext={() => {
            if (dialogueIndex < round2Start.length - 1) {
              setDialogueIndex(dialogueIndex + 1);
            } else {
              setPhase("boss");
            }
          }}
        />
      </TaskBackground>
    );
  }

  // === ГОЛОГРАММА VOID ===
  if (showHologramDialogue && hologramIndex < voidHologramDialogues.length) {
    const line = voidHologramDialogues[hologramIndex];
    const character = getCharacter("void");
    return (
      <TaskBackground>
        <TopHUD progress={75} letters={[]} title="VOID DETECTED" />
        {/* Голограмма — ПОВЕРХ ДИАЛОГА (z-50) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden">
          <div className="relative w-[300px] h-[300px] sm:w-[500px] sm:h-[500px]">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-ping" />
            <div className="relative w-full h-full drop-shadow-[0_0_100px_rgba(239,68,68,0.5)]">
              <Image
                src="/images/avatars/void-angry.png"
                alt="VOID"
                fill
                className="object-contain"
                sizes="500px"
                priority
              />
            </div>
            {/* Глитч-полосы */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-0 w-full h-[2px] bg-red-500/40 animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-red-400/30 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="absolute top-3/4 left-0 w-full h-[3px] bg-red-500/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>

        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color="#ef4444"
          text={line.text}
          mood="angry"
          onNext={() => {
            if (hologramIndex < voidHologramDialogues.length - 1) {
              setHologramIndex(hologramIndex + 1);
            } else {
              setShowHologramDialogue(false);
              setPhase("boss");
            }
          }}
        />
      </TaskBackground>
    );
  }

  // === БОСС-ЗАДАНИЯ ===
  if (phase === "boss") {
    const nodes = buildNodes(tasks, completedTasks, failedTasks, activeTaskId);
    const progress = Math.round((completedTasks.length / tasks.length) * 100);
    const currentTask = tasks.find((t) => t.id === activeTaskId);
    const isCompleted = completedTasks.includes(activeTaskId);
    const isFailed = failedTasks.includes(activeTaskId);

    return (
      <TaskBackground>
        <TopHUD progress={progress} letters={[]} title="VOID NETWORK" />

        <div className="relative z-20 min-h-screen flex items-center justify-center px-4 pt-36 pb-8 sm:p-10">
          <div className="w-full max-w-[1700px]">
            <TaskMap
              tasks={nodes}
              onSelect={(id) => {
                const node = nodes.find((n) => n.id === id);
                if (!node || node.locked) return;
                setActiveTaskId(id);
                setSelectedAnswer("");
                setShowResult(null);
                setModalOpen(true);
              }}
            />
          </div>
        </div>

        <PuzzleModal
          open={modalOpen}
          title={currentTask?.fullTitle ?? ""}
          description={currentTask?.description ?? ""}
          hint={currentTask?.hint}
          onClose={() => {
            setModalOpen(false);
            setSelectedAnswer("");
            setShowResult(null);
          }}
          onSubmit={handleSubmitAnswer}
          onTimeout={handleTimeout}
          timeLimit={isCompleted || isFailed ? undefined : currentTask?.timeLimit}
          isCompleted={isCompleted}
          isFailed={isFailed}
          isLocked={false}
          options={currentTask?.options}
          selectedOption={selectedAnswer}
          onOptionSelect={handleAnswerSelect}
          showResult={showResult}
          correctAnswer={currentTask?.correctAnswer}
        />
      </TaskBackground>
    );
  }

  // === ПОБЕДА ===
  if (phase === "victory") {
    if (victoryIndex >= round2Complete.length) {
      setPhase("outro");
      return null;
    }

    const line = round2Complete[victoryIndex];
    const character = getCharacter(line.character);
    return (
      <TaskBackground>
        <TopHUD progress={100} letters={[]} title="VICTORY" />
        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color={character.color}
          text={line.text}
          mood={line.mood}
          onNext={() => setVictoryIndex(victoryIndex + 1)}
        />
      </TaskBackground>
    );
  }

  // ============ АУТРО-РОЛИК (4.mp4) ============
  if (phase === "outro") {
    const handleOutroEnd = () => { localStorage.removeItem(SAVE_KEY); router.push("/tasks"); };
    return <VideoPlayer key="round2-outro" src="/videos/4.mp4" onEnded={handleOutroEnd} onSkip={handleOutroEnd} />;
  }

  return null;
}
