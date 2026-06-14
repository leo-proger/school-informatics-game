"use client";
import { useState, useCallback } from "react";
import Background from "@/components/layout/Background";
import TopHUD from "@/components/layout/TopHUD";
import TaskMap, { TaskNode } from "@/components/tasks/TaskMap";
import PuzzleModal from "@/components/tasks/PuzzleModal";
import DialogueBox from "@/components/dialogue/DialogueBox";
import GlassPanel from "@/components/ui/GlassPanel";
import NeonButton from "@/components/ui/NeonButton";
import { getCharacter } from "@/lib/characters";
import { prologue, round1Complete, round2Start, round2Complete } from "@/data/dialogues";
import { round1Tasks, getTask, checkAnswer } from "@/data/tasks-round1";
import { getBossTask, checkBossAnswer } from "@/data/tasks-round2";

// Генерация нод для карты заданий
function generateNodes(
  tasks: typeof round1Tasks,
  completed: string[],
  activeId: string | null
): TaskNode[] {
  return tasks.map((task, index) => {
    const isUnlocked = index === 0 || completed.includes(tasks[index - 1].id);
    
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      x: 15 + (index % 3) * 30,
      y: 20 + Math.floor(index / 3) * 30,
      active: task.id === activeId && isUnlocked,
      completed: completed.includes(task.id),
      locked: !isUnlocked && !completed.includes(task.id),
    };
  });
}

export default function HomePage() {
  // Фазы игры
  const [phase, setPhase] = useState<"prologue" | "round1" | "round1Complete" | "round2Code" | "round2Dialogue" | "round2Boss" | "victory">("prologue");
  
  // Пролог
  const [prologueIndex, setPrologueIndex] = useState(0);
  
  // Тур 1
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string>(round1Tasks[0].id);
  const [modalOpen, setModalOpen] = useState(false);
  const [collectedLetters, setCollectedLetters] = useState<string[]>([]);
  
  // Тур 2
  const [accessCode, setAccessCode] = useState("");
  const [round2DialogueIndex, setRound2DialogueIndex] = useState(0);
  const [bossTask, setBossTask] = useState<any>(null);
  const [r1cIdx, setR1cIdx] = useState(0);
  
  // Победа
  const [victoryIndex, setVictoryIndex] = useState(0);
  const [showVictoryOverlay, setShowVictoryOverlay] = useState(false);

  // Обработчик выполнения задания
  const handleTaskSubmit = useCallback((value: string) => {
    const task = getTask(activeTaskId);
    if (!task) return false;

    const isCorrect = checkAnswer(task, value);

    if (isCorrect) {
      const newCompleted = [...completedTasks, activeTaskId];
      setCompletedTasks(newCompleted);
      
      const word = "ФЕНИКС";
      const nextLetter = word[newCompleted.length - 1];
      setCollectedLetters([...collectedLetters, nextLetter || "?"]);

      // Проверяем завершение тура
      if (newCompleted.length >= round1Tasks.length) {
        setPhase("round1Complete");
        setActiveTaskId("");
      } else {
        const nextTask = round1Tasks.find(t => !newCompleted.includes(t.id));
        if (nextTask) setActiveTaskId(nextTask.id);
      }
    }

    setModalOpen(false);
    return isCorrect;
  }, [activeTaskId, completedTasks, collectedLetters]);

  const handleBossSubmit = useCallback((value: string) => {
    if (!bossTask) return false;
    const correct = checkBossAnswer(bossTask, value);
    if (correct) {
      setPhase("victory");
    }
    return correct;
  }, [bossTask]);

  // ==================== РЕНДЕР ====================

  // Пролог
  if (phase === "prologue") {
    const line = prologue[prologueIndex];
    const character = getCharacter(line.character);

    return (
      <div className="relative min-h-screen">
        <Background />
        <TopHUD progress={0} letters={[]} title="BOOT SEQUENCE" />
        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color={character.color}
          text={line.text}
          onNext={() => {
            if (prologueIndex < prologue.length - 1) {
              setPrologueIndex(prologueIndex + 1);
            } else {
              setPhase("round1");
            }
          }}
        />
      </div>
    );
  }

  // Тур 1 — Задания
  if (phase === "round1") {
    const nodes = generateNodes(round1Tasks, completedTasks, activeTaskId);
    const progress = Math.round((completedTasks.length / round1Tasks.length) * 100);

    return (
      <div className="relative min-h-screen">
        <Background />
        <TopHUD progress={progress} letters={collectedLetters} title="ROUND 1 • NEXUS" />
        
        <div className="relative z-20 min-h-screen flex items-center justify-center p-10">
          <div className="w-full max-w-[1700px]">
            <TaskMap 
              tasks={nodes} 
              onSelect={(id) => {
                const node = nodes.find(n => n.id === id);
                if (node && !node.locked) {
                  setActiveTaskId(id);
                  setModalOpen(true);
                }
              }} 
            />
          </div>
        </div>

        <PuzzleModal
          open={modalOpen}
          title={activeTaskId ? getTask(activeTaskId)?.title ?? "" : ""}
          description={activeTaskId ? getTask(activeTaskId)?.description ?? "" : ""}
          onClose={() => setModalOpen(false)}
          onSubmit={handleTaskSubmit}
          timeLimit={activeTaskId ? getTask(activeTaskId)?.timeLimit : undefined}
        />
      </div>
    );
  }

  // Завершение тура 1
  if (phase === "round1Complete") {
    if (r1cIdx >= round1Complete.length) {
      setPhase("round2Code");
      setR1cIdx(0);
      return null;
    }

    const currentLine = round1Complete[r1cIdx];
    const character = getCharacter(currentLine.character);

    return (
      <div className="relative min-h-screen">
        <Background />
        <TopHUD progress={100} letters={collectedLetters} title="ROUND 1 COMPLETE" />
        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color={character.color}
          text={currentLine.text}
          onNext={() => {
            if (r1cIdx < round1Complete.length - 1) {
              setR1cIdx(r1cIdx + 1);
            } else {
              setPhase("round2Code");
              setR1cIdx(0);
            }
          }}
        />
      </div>
    );
  }

  // Тур 2 — Ввод кода
  if (phase === "round2Code") {
    const expectedCode = collectedLetters.join("");
    
    return (
      <div className="relative min-h-screen">
        <Background />
        <TopHUD progress={50} letters={collectedLetters} title="ACCESS CODE" />
        
        <div className="relative z-20 min-h-screen flex items-center justify-center p-10">
          <GlassPanel className="p-12 max-w-2xl w-full text-center">
            <h2 className="text-3xl text-yellow-300 font-bold mb-4">ВВЕДИТЕ КОД ДОСТУПА</h2>
            <p className="text-gray-400 mb-6">
              Собранные буквы: <span className="text-yellow-300 font-bold tracking-[8px]">{collectedLetters.join(" ")}</span>
            </p>
            
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              className="w-full bg-black/60 border border-yellow-500/30 p-4 text-yellow-300 text-2xl text-center outline-none mb-6 tracking-[8px]"
              placeholder="ВВЕДИТЕ КОД"
            />
            
            <NeonButton
              color="cyan"
              onClick={() => {
                if (accessCode === expectedCode) {
                  setPhase("round2Dialogue");
                  setAccessCode("");
                  setRound2DialogueIndex(0);
                }
              }}
              className="text-xl px-8 py-4"
            >
              ПОДТВЕРДИТЬ
            </NeonButton>
          </GlassPanel>
        </div>
      </div>
    );
  }

  // Тур 2 — Диалог перед боссом
  if (phase === "round2Dialogue") {
    if (round2DialogueIndex >= round2Start.length) {
      const task = getBossTask(1);
      setBossTask(task);
      setPhase("round2Boss");
      return null;
    }

    const line = round2Start[round2DialogueIndex];
    const character = getCharacter(line.character);

    return (
      <div className="relative min-h-screen">
        <Background />
        <TopHUD progress={75} letters={collectedLetters} title="FINAL BATTLE" />
        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color={character.color}
          text={line.text}
          onNext={() => {
            if (round2DialogueIndex < round2Start.length - 1) {
              setRound2DialogueIndex(round2DialogueIndex + 1);
            } else {
              const task = getBossTask(1);
              setBossTask(task);
              setPhase("round2Boss");
            }
          }}
        />
      </div>
    );
  }

  // Тур 2 — Босс
  if (phase === "round2Boss" && bossTask) {
    return (
      <div className="relative min-h-screen">
        <Background />
        <TopHUD progress={75} letters={collectedLetters} title="VOID BOSS" />
        
        <div className="relative z-20 min-h-screen flex items-center justify-center p-10">
          <PuzzleModal
            open={true}
            title={bossTask.title}
            description={bossTask.description}
            hint={bossTask.hint}
            timeLimit={bossTask.timeLimit}
            onClose={() => {}}
            onSubmit={handleBossSubmit}
          />
        </div>
      </div>
    );
  }

  // Победа
  if (phase === "victory") {
    if (victoryIndex >= round2Complete.length) {
      if (!showVictoryOverlay) {
        setShowVictoryOverlay(true);
      }
      return (
        <div className="relative min-h-screen">
          <Background />
          <TopHUD progress={100} letters={collectedLetters} title="VICTORY" />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <h1 className="text-8xl font-bold text-yellow-300 animate-pulse mb-8">
                ПОБЕДА!
              </h1>
              <p className="text-2xl text-yellow-200">
                VOID уничтожен. NEXUS очищен.
              </p>
            </div>
          </div>
        </div>
      );
    }

    const line = round2Complete[victoryIndex];
    const character = getCharacter(line.character);

    return (
      <div className="relative min-h-screen">
        <Background />
        <TopHUD progress={100} letters={collectedLetters} title="VICTORY" />
        <DialogueBox
          speaker={character.name}
          avatar={character.avatarPlaceholder}
          color={character.color}
          text={line.text}
          onNext={() => setVictoryIndex(victoryIndex + 1)}
        />
      </div>
    );
  }

  return null;
}