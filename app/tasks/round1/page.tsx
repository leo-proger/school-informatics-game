"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import TaskBackground from "@/app/components/layout/TaskBackground";
import TopHUD from "@/app/components/layout/TopHUD";
import TaskMap from "@/app/components/tasks/TaskMap";
import PuzzleModal from "@/app/components/tasks/PuzzleModal";
import DialogueBox from "@/app/components/dialogue/DialogueBox";
import GlassPanel from "@/app/components/ui/GlassPanel";
import NeonButton from "@/app/components/ui/NeonButton";
import { getCharacter } from "@/app/lib/characters";
import { prologue, round1Complete, taskDialogs } from "@/app/data/dialogues";
import { useAuth } from "@/app/lib/auth-context";
import { DIFFICULTY_POINTS, generateNodes } from "@/app/lib/game-utils";
import { GameTask } from "@/app/lib/types";
import { addScore } from "@/app/lib/game-actions";
import { useAutoSaveProgress } from "@/app/lib/game-hooks";
import { supabase } from "@/app/lib/supabase";
import VideoPlayer from "@/app/components/ui/VideoPlayer";
import LoadingSpinner from "@/app/components/ui/LoadingSpinner";

export const SAVE_KEY = "phoenix_round1_progress";

type Phase =
  | "video" | "prologue" | "round1" | "taskDialogue"
  | "round1Complete" | "round1Code" | "round1Outro";

export default function Round1Page() {
  const router = useRouter();
  const { team, isLoading } = useAuth();
  const [loaded, setLoaded] = useState(false);
  const [tasks, setTasks] = useState<GameTask[]>([]);
  const [failedTasks, setFailedTasks] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("video");
  const [prologueIndex, setPrologueIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [taskDialogIndex, setTaskDialogIndex] = useState(0);
  const [r1cIdx, setR1cIdx] = useState(0);
  const [accessCode, setAccessCode] = useState("");

  // Блокировка — тур уже пройден
  useEffect(() => {
    if (!isLoading && team?.tour1Completed) {
      router.replace("/tasks");
    }
  }, [isLoading, team, router]);

  // Загрузка заданий из Supabase + восстановление сохранения.
  // Ждём окончания авторизации: AuthProvider синхронизирует localStorage с БД
  // (syncProgressFromRow) — иначе можно прочитать устаревший прогресс до сброса.
  useEffect(() => {
    if (isLoading || loaded) return;
    supabase
      .from("tasks")
      .select("*")
      .eq("tour", 1)
      .order("task_number")
      .then(({ data }) => {
        const loaded: GameTask[] = (data ?? []).map((row) => ({
          id: row.id,
          title: row.title,
          description: row.description?.replace(/\\n/g, "\n"),
          answer: row.answer,
          hint: row.hint?.replace(/\\n/g, "\n") ?? undefined,
          difficulty: row.difficulty,
          timeLimit: row.time_limit ?? undefined,
          taskNumber: row.task_number,
        }));
        setTasks(loaded);

        try {
          const raw = localStorage.getItem(SAVE_KEY);
          if (raw) {
            const savedData = JSON.parse(raw);
            setPhase(savedData.phase === "video" ? "prologue" : (savedData.phase ?? "prologue"));
            setPrologueIndex(savedData.prologueIndex ?? 0);
            setCompletedTasks(savedData.completedTasks ?? []);
            setActiveTaskId(savedData.activeTaskId ?? loaded[0]?.id ?? "");
            setCollectedLetters(savedData.collectedLetters ?? []);
            setPendingTaskId(savedData.pendingTaskId ?? null);
            setTaskDialogIndex(savedData.taskDialogIndex ?? 0);
            setR1cIdx(savedData.r1cIdx ?? 0);
            setFailedTasks(savedData.failedTasks ?? []);
            setAccessCode(savedData.accessCode ?? "");
          } else {
            setActiveTaskId(loaded[0]?.id ?? "");
          }
        } catch {
          setActiveTaskId(loaded[0]?.id ?? "");
        }
        setLoaded(true);
      });
  }, [isLoading, loaded]);

  // Автосохранение в localStorage + Supabase (debounce 2s)
  useAutoSaveProgress(SAVE_KEY, "round1_progress", {
    phase,
    prologueIndex,
    completedTasks,
    activeTaskId,
    collectedLetters,
    pendingTaskId,
    taskDialogIndex,
    r1cIdx,
    failedTasks,
    accessCode,
  }, loaded);

  const handleTaskSubmit = useCallback((value: string) => {
    const task = tasks.find(t => t.id === activeTaskId);
    if (!task) return false;

    const normalized = value.trim().toLowerCase();
    const isCorrect = Array.isArray(task.answer)
      ? task.answer.some(a => a.toLowerCase() === normalized)
      : task.answer.toLowerCase() === normalized;

    let newCompleted = completedTasks;
    let newFailed = failedTasks;

    if (isCorrect) {
      newCompleted = [...completedTasks, activeTaskId];
      setCompletedTasks(newCompleted);

      const points = DIFFICULTY_POINTS[task.difficulty] ?? 100;
      addScore(points);

      const word = "ФЕНИКС";
      const nextLetter = word[newCompleted.length - 1];
      const newLetters = [...collectedLetters, nextLetter || "?"];
      setCollectedLetters(newLetters);

      localStorage.setItem("collectedLetters", JSON.stringify(newLetters));
    } else {
      newFailed = [...failedTasks, activeTaskId];
      setFailedTasks(newFailed);
    }

    // Тур завершён, когда все задания решены (выполнены или провалены)
    const allResolved = tasks.every(t => newCompleted.includes(t.id) || newFailed.includes(t.id));
    if (allResolved) {
      setPhase("round1Complete");
      setActiveTaskId("");
    } else if (isCorrect) {
      const nextTask = tasks.find(t => !newCompleted.includes(t.id) && !newFailed.includes(t.id));
      if (nextTask) {
        setPendingTaskId(nextTask.id);
        setTaskDialogIndex(0);
        setPhase("taskDialogue");
      }
    }

    return isCorrect;
  }, [tasks, activeTaskId, completedTasks, failedTasks, collectedLetters]);

  if (!loaded) return <LoadingSpinner />;

  // ==================== РЕНДЕР ====================

  if (phase === "video") {
    return <VideoPlayer key="promo" src="/videos/promo.mp4" onEnded={() => setPhase("prologue")} onSkip={() => setPhase("prologue")} />;
  }

  if (phase === "prologue") {
    const line = prologue[prologueIndex];
    const character = getCharacter(line.character);
    return (
      <TaskBackground>
        <TopHUD progress={0} letters={[]} title="BOOT SEQUENCE" />
        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color={character.color}
          text={line.text}
          mood={line.mood}
          onNext={() => {
            if (prologueIndex < prologue.length - 1) {
              setPrologueIndex(prologueIndex + 1);
            } else {
              setPendingTaskId(tasks[0]?.id ?? "");
              setTaskDialogIndex(0);
              setPhase("taskDialogue");
            }
          }}
        />
      </TaskBackground>
    );
  }

  if (phase === "round1") {
    const nodes = generateNodes(tasks, completedTasks, failedTasks, activeTaskId);
    const progress = Math.round((completedTasks.length / tasks.length) * 100);
    return (
      <TaskBackground>
        <TopHUD progress={progress} letters={collectedLetters} title="ROUND 1 • NEXUS" />
        <div className="relative z-20 min-h-screen flex items-center justify-center p-10">
          <div className="w-full max-w-[1700px]">
            <TaskMap
              tasks={nodes}
              onSelect={(id) => {
                const node = nodes.find(n => n.id === id);
                if (node && !node.locked) {
                  if (!completedTasks.includes(id) && !failedTasks.includes(id)) {
                    setPendingTaskId(id);
                    setTaskDialogIndex(0);
                    setPhase("taskDialogue");
                  } else {
                    setActiveTaskId(id);
                    setModalOpen(true);
                  }
                }
              }}
            />
          </div>
        </div>
        <PuzzleModal
          open={modalOpen}
          title={tasks.find(t => t.id === activeTaskId)?.title ?? ""}
          description={tasks.find(t => t.id === activeTaskId)?.description ?? ""}
          hint={tasks.find(t => t.id === activeTaskId)?.hint}
          onClose={() => setModalOpen(false)}
          onSubmit={handleTaskSubmit}
          onTimeout={() => {
            if (activeTaskId && !completedTasks.includes(activeTaskId) && !failedTasks.includes(activeTaskId)) {
              const newFailed = [...failedTasks, activeTaskId];
              setFailedTasks(newFailed);
              const allResolved = tasks.every(t => completedTasks.includes(t.id) || newFailed.includes(t.id));
              if (allResolved) {
                setPhase("round1Complete");
                setActiveTaskId("");
              }
            }
            setModalOpen(false);
          }}
          timeLimit={tasks.find(t => t.id === activeTaskId)?.timeLimit}
          isCompleted={activeTaskId ? completedTasks.includes(activeTaskId) : false}
          isFailed={activeTaskId ? failedTasks.includes(activeTaskId) : false}
        />
      </TaskBackground>
    );
  }

  if (phase === "taskDialogue" && pendingTaskId) {
    const dialogLines = taskDialogs[pendingTaskId];
    if (!dialogLines || dialogLines.length === 0) {
      setActiveTaskId(pendingTaskId);
      setPendingTaskId(null);
      setPhase("round1");
      setModalOpen(true);
      return null;
    }

    const currentLine = dialogLines[taskDialogIndex];
    const character = getCharacter(currentLine.character);
    const progress = Math.round((completedTasks.length / tasks.length) * 100);
    return (
      <TaskBackground>
        <TopHUD progress={progress} letters={collectedLetters} title="NEW TASK" />
        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color={character.color}
          text={currentLine.text}
          mood={currentLine.mood}
          onNext={() => {
            if (taskDialogIndex < dialogLines.length - 1) {
              setTaskDialogIndex(taskDialogIndex + 1);
            } else {
              const taskId = pendingTaskId;
              setPendingTaskId(null);
              setActiveTaskId(taskId);
              setPhase("round1");
              setModalOpen(true);
            }
          }}
        />
      </TaskBackground>
    );
  }

  if (phase === "round1Complete") {
    if (r1cIdx >= round1Complete.length) {
      setPhase("round1Code");
      setR1cIdx(0);
      return null;
    }

    const currentLine = round1Complete[r1cIdx];
    const character = getCharacter(currentLine.character);
    return (
      <TaskBackground>
        <TopHUD progress={100} letters={collectedLetters} title="ROUND 1 COMPLETE" />
        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color={character.color}
          text={currentLine.text}
          mood={currentLine.mood}
          onNext={() => {
            if (r1cIdx < round1Complete.length - 1) {
              setR1cIdx(r1cIdx + 1);
            } else {
              setPhase("round1Code");
              setR1cIdx(0);
            }
          }}
        />
      </TaskBackground>
    );
  }

  // ============ ВВОД КОДА (в конце 1 тура) ============
  if (phase === "round1Code") {
    const expectedCode = collectedLetters.join("");

    return (
      <TaskBackground>
        <TopHUD progress={100} letters={collectedLetters} title="ACCESS CODE" />
        <div className="relative z-20 min-h-screen flex items-center justify-center p-10">
          <GlassPanel className="p-12 max-w-2xl w-full text-center">
            <h2 className="text-3xl text-yellow-300 font-bold mb-4">ВВЕДИТЕ КОД ДОСТУПА</h2>
            <p className="text-gray-400 mb-2">
              Собранные буквы: 
              <span className="text-yellow-300 font-bold tracking-[8px] ml-2">
                {collectedLetters.join(" ")}
              </span>
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Введите код, чтобы подтвердить завершение Тура 1
            </p>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="w-full bg-black/60 border border-yellow-500/30 p-4 text-yellow-300 text-2xl text-center outline-none mb-6 tracking-[8px] focus:border-yellow-500 transition-colors"
              placeholder="ВВЕДИТЕ КОД"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (accessCode === expectedCode) {
                    localStorage.setItem("round1Completed", "true");
                    setPhase("round1Outro");
                  }
                }
              }}
            />
            <NeonButton
              color="cyan"
              onClick={() => {
                if (accessCode === expectedCode) {
                  localStorage.setItem("round1Completed", "true");
                  setPhase("round1Outro");
                }
              }}
              className="text-xl px-8 py-4 w-full"
            >
              ПОДТВЕРДИТЬ
            </NeonButton>
            {accessCode && accessCode !== expectedCode && (
              <p className="text-red-400 text-sm mt-4 animate-pulse">
                ❌ Неверный код. Попробуйте снова.
              </p>
            )}
          </GlassPanel>
        </div>
      </TaskBackground>
    );
  }

  // ============ ПРОМО-РОЛИК ПОСЛЕ 1 ТУРА ============
  if (phase === "round1Outro") {
    return <VideoPlayer key="round1-outro" src="/videos/2.mp4" onEnded={() => router.push("/tasks")} onSkip={() => router.push("/tasks")} />;
  }

  return null;
}