"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TaskBackground from "@/app/components/layout/TaskBackground";
import TopHUD from "@/app/components/layout/TopHUD";
import DialogueBox from "@/app/components/dialogue/DialogueBox";
import PuzzleModal from "@/app/components/tasks/PuzzleModal";
import NeonButton from "@/app/components/ui/NeonButton";
import { getCharacter } from "@/app/lib/characters";
import { round2Start, round2Complete, voidHologramDialogues } from "@/app/data/dialogues-round2";
import { round2Tasks, checkBossAnswer } from "@/app/data/tasks-round2";
import { supabase } from "@/app/lib/supabase";

const SESSION_KEY = "phoenix_session";
const ROUND2_TASK_POINTS = 500;

async function addScore(points: number) {
  const teamId = localStorage.getItem(SESSION_KEY);
  if (!teamId) return;
  const { data } = await supabase.from("teams").select("score").eq("id", teamId).single();
  if (data) {
    await supabase.from("teams").update({ score: (data.score ?? 0) + points }).eq("id", teamId);
  }
}

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
  activeTaskIndex?: number;
  showVoidHologram?: boolean;
  showHologramDialogue?: boolean;
  hologramIndex?: number;
}

interface TaskCircle {
  id: string;
  x: number;
  y: number;
  completed: boolean;
  failed: boolean;
  active: boolean;
  shortTitle: string;
  width: number;
  height: number;
}

function generateCircles(): TaskCircle[] {
  const positions = [
    { x: 15, y: 30 },
    { x: 70, y: 25 },
    { x: 85, y: 55 },
    { x: 45, y: 75 },
    { x: 25, y: 60 },
  ];

  const sizes = [
    { w: 200, h: 140 },
    { w: 140, h: 200 },
    { w: 200, h: 140 },
    { w: 170, h: 170 },
    { w: 170, h: 170 },
  ];

  return positions.map((pos, i) => ({
    id: round2Tasks[i].id,
    x: pos.x,
    y: pos.y,
    completed: false,
    failed: false,
    active: i === 0,
    shortTitle: round2Tasks[i].shortTitle,
    width: sizes[i].w,
    height: sizes[i].h,
  }));
}

export default function Round2Page() {
  const router = useRouter();
  const [loaded, setLoaded] = useState(false);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("intro");
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [victoryIndex, setVictoryIndex] = useState(0);
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);

  const [activeTaskIndex, setActiveTaskIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [failedTasks, setFailedTasks] = useState<string[]>([]);
  const [circles, setCircles] = useState<TaskCircle[]>([]);
  const [showVoidHologram, setShowVoidHologram] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const [showHologramDialogue, setShowHologramDialogue] = useState(false);
  const [hologramIndex, setHologramIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const savedLetters = localStorage.getItem("collectedLetters");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (savedLetters) setCollectedLetters(JSON.parse(savedLetters));

    let savedData: SavedData = {};
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        savedData = JSON.parse(raw);
        const savedPhase = savedData.phase === "code" ? "dialogue" : savedData.phase ?? "intro";
        setPhase(savedPhase);
        setDialogueIndex(savedData.dialogueIndex ?? 0);
        setVictoryIndex(savedData.victoryIndex ?? 0);
        setCompletedTasks(savedData.completedTasks ?? []);
        setFailedTasks(savedData.failedTasks ?? []);
        setActiveTaskIndex(savedData.activeTaskIndex ?? 0);
        setShowVoidHologram(savedData.showVoidHologram ?? false);
        setShowHologramDialogue(savedData.showHologramDialogue ?? false);
        setHologramIndex(savedData.hologramIndex ?? 0);
      }
    } catch {}

    const freshCircles = generateCircles();
    const restoredCircles = freshCircles.map((circle) => {
      const isCompleted = savedData?.completedTasks?.includes(circle.id) ?? false;
      const isFailed = savedData?.failedTasks?.includes(circle.id) ?? false;
      const resolvedActive = savedData?.activeTaskIndex !== undefined
        ? round2Tasks[savedData.activeTaskIndex]?.id === circle.id
        : circle.active;

      return {
        ...circle,
        completed: isCompleted,
        failed: isFailed,
        active: resolvedActive && !isCompleted && !isFailed,
      };
    });

    setCircles(restoredCircles);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify({
        phase,
        dialogueIndex,
        victoryIndex,
        completedTasks,
        failedTasks,
        activeTaskIndex,
        showVoidHologram,
        showHologramDialogue,
        hologramIndex,
        savedAt: new Date().toISOString(),
      })
    );
  }, [
    loaded,
    phase,
    dialogueIndex,
    victoryIndex,
    completedTasks,
    failedTasks,
    activeTaskIndex,
    showVoidHologram,
    showHologramDialogue,
    hologramIndex,
  ]);

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

  const task = round2Tasks[activeTaskIndex];
  const isCorrect = checkBossAnswer(task, selectedAnswer);

  setShowResult(isCorrect ? "correct" : "wrong");

  setTimeout(() => {
    setModalOpen(false);
    setSelectedAnswer("");
    setShowResult(null);
  }, 800);

  if (isCorrect) {
    const newCompleted = [...completedTasks, task.id];
    setCompletedTasks(newCompleted);
    addScore(ROUND2_TASK_POINTS);

    setCircles((prev) =>
      prev.map((circle) =>
        circle.id === task.id ? { ...circle, completed: true, active: false } : circle
      )
    );

    if (newCompleted.length === round2Tasks.length) {
      setTour2Completed();
      setTimeout(() => {
        setPhase("victory");
        setVictoryIndex(0);
      }, 1500);
      return true;
    }

    let nextIndex = -1;
    for (let i = 0; i < round2Tasks.length; i++) {
      const id = round2Tasks[i].id;
      if (!newCompleted.includes(id) && !failedTasks.includes(id)) {
        nextIndex = i;
        break;
      }
    }

    if (nextIndex !== -1) {
      setActiveTaskIndex(nextIndex);
      setCircles((prev) =>
        prev.map((circle) => ({
          ...circle,
          active: circle.id === round2Tasks[nextIndex].id,
        }))
      );
    }
    return true;
  }

  setFailedTasks((prev) => [...prev, task.id]);

  setCircles((prev) =>
    prev.map((circle) =>
      circle.id === task.id ? { ...circle, failed: true, active: false } : circle
    )
  );

  let nextIndex = -1;
  for (let i = 0; i < round2Tasks.length; i++) {
    const id = round2Tasks[i].id;
    if (
      !completedTasks.includes(id) &&
      !failedTasks.includes(id) &&
      id !== task.id
    ) {
      nextIndex = i;
      break;
    }
  }

  if (nextIndex !== -1) {
    setActiveTaskIndex(nextIndex);
    setCircles((prev) =>
      prev.map((circle) => ({
        ...circle,
        active: circle.id === round2Tasks[nextIndex].id,
      }))
    );
  }
  return false;
}, [selectedAnswer, activeTaskIndex, completedTasks, failedTasks]);

  const handleCircleClick = useCallback(
    (circleId: string) => {
      const circle = circles.find((c) => c.id === circleId);
      if (!circle) return;
      const idx = round2Tasks.findIndex((t) => t.id === circleId);
      if (idx !== -1) {
        setActiveTaskIndex(idx);
        setModalOpen(true);
      }
    },
    [circles]
  );

  if (!loaded) {
    return (
      <div className="fixed inset-0 bg-[#050816] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  // ============ ИНТРО-РОЛИК (3.mp4) ============
  if (phase === "intro") {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          onEnded={() => setPhase("dialogue")}
        >
          <source src="/videos/3.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <button
          onClick={() => setPhase("dialogue")}
          className="absolute bottom-10 right-10 z-20 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition"
        >
          Пропустить ↓
        </button>
      </div>
    );
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
        <TopHUD progress={50} letters={collectedLetters} title="ROUND 2 • VOID" />
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
        <TopHUD progress={75} letters={collectedLetters} title="VOID DETECTED" />
        {/* Голограмма — ПОВЕРХ ДИАЛОГА (z-50) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50 overflow-hidden">
          <div className="relative w-[500px] h-[500px]">
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
    const currentTask = round2Tasks[activeTaskIndex];
    const progress = Math.round((completedTasks.length / round2Tasks.length) * 100);

    const sizeMap: Record<number, { w: number; h: number }> = {
      0: { w: 200, h: 140 },
      1: { w: 140, h: 200 },
      2: { w: 200, h: 140 },
      3: { w: 170, h: 170 },
      4: { w: 170, h: 170 },
    };

    const isCompleted = completedTasks.includes(currentTask?.id || "");
    const isFailed = failedTasks.includes(currentTask?.id || "");

    return (
      <TaskBackground>
        <TopHUD progress={progress} letters={collectedLetters} title="VOID NETWORK" />

        <div className="relative z-10 w-full h-[calc(100vh-120px)]">
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {[
              [0, 1],
              [1, 2],
              [2, 3],
              [3, 4],
              [4, 0],
              [0, 2],
              [1, 3],
            ].map(([from, to], idx) => {
              const fromCircle = circles[from];
              const toCircle = circles[to];
              if (!fromCircle || !toCircle) return null;
              const completed = fromCircle.completed && toCircle.completed;
              return (
                <line
                  key={`line-${idx}`}
                  x1={`${fromCircle.x}%`}
                  y1={`${fromCircle.y}%`}
                  x2={`${toCircle.x}%`}
                  y2={`${toCircle.y}%`}
                  stroke={completed ? "rgba(34, 211, 238, 0.6)" : "rgba(34, 211, 238, 0.2)"}
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>

          {circles.map((circle) => {
            const isActiveCircle = circle.active && !circle.completed && !circle.failed;
            const isCompletedCircle = circle.completed;
            const isFailedCircle = circle.failed;
            const idx = circles.indexOf(circle);
            const size = sizeMap[idx] || { w: 170, h: 170 };

            return (
              <div
                key={circle.id}
                className="task-circle absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer"
                style={{
                  left: `${circle.x}%`,
                  top: `${circle.y}%`,
                }}
              >
                <div
                  onClick={() => handleCircleClick(circle.id)}
                  className={`
                    flex flex-col items-center justify-center text-center
                    transition-all duration-300 relative
                    ${isActiveCircle
                      ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_40px_rgba(34,211,238,0.3)] hover:scale-105 cursor-pointer"
                      : isCompletedCircle
                      ? "border-green-500/30 bg-green-500/10 cursor-pointer hover:scale-105"
                      : isFailedCircle
                      ? "border-red-500/50 bg-red-500/10 cursor-pointer hover:scale-105"
                      : "border-gray-600/30 bg-gray-800/30 cursor-not-allowed"}
                  `}
                  style={{
                    width: `${size.w}px`,
                    height: `${size.h}px`,
                    borderRadius: "20px",
                    border: "2px solid",
                  }}
                >
                  {isCompletedCircle ? (
                    <span className="text-4xl text-green-400">✓</span>
                  ) : isFailedCircle ? (
                    <span className="text-3xl text-red-400">✕</span>
                  ) : (
                    <>
                      <span
                        className={`text-base font-bold ${isActiveCircle ? "text-cyan-300" : "text-gray-500"}`}
                      >
                        {circle.shortTitle}
                      </span>
                      <span
                        className={`text-xs mt-1 ${isActiveCircle ? "text-cyan-400/70" : "text-gray-600"}`}
                      >
                        {isActiveCircle ? "АКТИВНО" : "ЗАБЛОКИРОВАНО"}
                      </span>
                    </>
                  )}
                  {isActiveCircle && !isCompletedCircle && !isFailedCircle && (
                    <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
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
          timeLimit={undefined}
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
        <TopHUD progress={100} letters={collectedLetters} title="VICTORY" />
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
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-black">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          onEnded={() => {
            localStorage.removeItem(SAVE_KEY);
            router.push("/tasks");
          }}
        >
          <source src="/videos/4.mp4" type="video/mp4" />
          Ваш браузер не поддерживает видео.
        </video>
        <button
          onClick={() => {
            localStorage.removeItem(SAVE_KEY);
            router.push("/tasks");
          }}
          className="absolute bottom-10 right-10 z-20 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition"
        >
          Пропустить ↓
        </button>
      </div>
    );
  }

  return null;
}