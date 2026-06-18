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
import { round1Tasks, getTask, checkAnswer } from "@/app/data/tasks-round1";
import { prologue, round1Complete, taskDialogs } from "@/app/data/dialogues";
import { supabase } from "@/app/lib/supabase";
import { DIFFICULTY_POINTS, generateNodes } from "@/app/lib/game-utils";

const SESSION_KEY = "phoenix_session";

async function addScore(points: number) {
  const teamId = localStorage.getItem(SESSION_KEY);
  if (!teamId) return;
  const { data } = await supabase.from("teams").select("score").eq("id", teamId).single();
  if (data) {
    await supabase.from("teams").update({ score: (data.score ?? 0) + points }).eq("id", teamId);
  }
}

async function setTour1Completed() {
  const teamId = localStorage.getItem(SESSION_KEY);
  if (!teamId) return;
  await supabase.from("teams").update({ tour1_completed: true }).eq("id", teamId);
}

export const SAVE_KEY = "phoenix_round1_progress";

type Phase =
  | "video" | "prologue" | "round1" | "taskDialogue"
  | "round1Complete" | "round1Code";


export default function Round1Page() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [failedTasks, setFailedTasks] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("video");
  const [prologueIndex, setPrologueIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string>(round1Tasks[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [taskDialogIndex, setTaskDialogIndex] = useState(0);
  const [r1cIdx, setR1cIdx] = useState(0);
  const [accessCode, setAccessCode] = useState("");

  // Загрузка сохранения при монтировании
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        /* eslint-disable react-hooks/set-state-in-effect */
        setPhase(data.phase === "video" ? "prologue" : (data.phase ?? "prologue"));
        setPrologueIndex(data.prologueIndex ?? 0);
        setCompletedTasks(data.completedTasks ?? []);
        setActiveTaskId(data.activeTaskId ?? round1Tasks[0].id);
        setCollectedLetters(data.collectedLetters ?? []);
        setPendingTaskId(data.pendingTaskId ?? null);
        setTaskDialogIndex(data.taskDialogIndex ?? 0);
        setR1cIdx(data.r1cIdx ?? 0);
        setFailedTasks(data.failedTasks ?? []);
        setAccessCode(data.accessCode ?? "");
        /* eslint-enable react-hooks/set-state-in-effect */
      }
    } catch {}
    setLoaded(true);
  }, []);

  // Автосохранение
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
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
        savedAt: new Date().toISOString(),
      }));
    } catch {}
  }, [loaded, phase, prologueIndex, completedTasks, activeTaskId, collectedLetters,
      pendingTaskId, taskDialogIndex, r1cIdx, failedTasks, accessCode]);

  const handleTaskSubmit = useCallback((value: string) => {
    const task = getTask(activeTaskId);
    if (!task) return false;

    const isCorrect = checkAnswer(task, value);

    if (isCorrect) {
      const newCompleted = [...completedTasks, activeTaskId];
      setCompletedTasks(newCompleted);

      const points = DIFFICULTY_POINTS[task.difficulty] ?? 100;
      addScore(points);

      const word = "ФЕНИКС";
      const nextLetter = word[newCompleted.length - 1];
      const newLetters = [...collectedLetters, nextLetter || "?"];
      setCollectedLetters(newLetters);
      
      localStorage.setItem("collectedLetters", JSON.stringify(newLetters));

      if (newCompleted.length >= round1Tasks.length) {
        setPhase("round1Complete");
        setActiveTaskId("");
      } else {
        const nextTask = round1Tasks.find(t => !newCompleted.includes(t.id) && !failedTasks.includes(t.id));
        if (nextTask) {
          setPendingTaskId(nextTask.id);
          setTaskDialogIndex(0);
          setPhase("taskDialogue");
        }
      }
    } else {
      setFailedTasks(prev => [...prev, activeTaskId]);
    }

    return isCorrect;
  }, [activeTaskId, completedTasks, failedTasks, collectedLetters]);

  if (!loaded) {
    return (
      <div className="fixed inset-0 bg-[#050816] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  // ==================== РЕНДЕР ====================

  if (phase === "video") {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          onEnded={() => setPhase("prologue")}
        >
          <source src="/videos/promo.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <button
          onClick={() => setPhase("prologue")}
          className="absolute bottom-10 right-10 z-20 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition"
        >
          Пропустить ↓
        </button>
      </div>
    );
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
              setPendingTaskId(round1Tasks[0].id);
              setTaskDialogIndex(0);
              setPhase("taskDialogue");
            }
          }}
        />
      </TaskBackground>
    );
  }

  if (phase === "round1") {
    const nodes = generateNodes(round1Tasks, completedTasks, failedTasks, activeTaskId);
    const progress = Math.round((completedTasks.length / round1Tasks.length) * 100);
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
          title={activeTaskId ? getTask(activeTaskId)?.title ?? "" : ""}
          description={activeTaskId ? getTask(activeTaskId)?.description ?? "" : ""}
          hint={activeTaskId ? getTask(activeTaskId)?.hint : ""}
          onClose={() => setModalOpen(false)}
          onSubmit={handleTaskSubmit}
          timeLimit={activeTaskId ? getTask(activeTaskId)?.timeLimit : undefined}
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
    const progress = Math.round((completedTasks.length / round1Tasks.length) * 100);
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
                    setTour1Completed();
                    router.push("/tasks");
                  }
                }
              }}
            />
            <NeonButton
              color="cyan"
              onClick={() => {
                if (accessCode === expectedCode) {
                  localStorage.setItem("round1Completed", "true");
                  setTour1Completed();
                  router.push("/tasks");
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

  return null;
}