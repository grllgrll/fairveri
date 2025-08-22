import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface LearningProgress {
  moduleId: string;
  subModuleId?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  completedAt?: Date;
  score?: number;
  timeSpent?: number;
}

export interface Achievement {
  id: string;
  unlockedAt: Date;
  points: number;
}

export interface QuizAnswer {
  moduleId: string;
  questionId: string;
  answer: number;
  isCorrect: boolean;
  timestamp: Date;
}

export interface ExerciseResult {
  moduleId: string;
  exerciseId: string;
  result: any;
  completedAt: Date;
}

export interface LearningStats {
  totalPoints: number;
  level: string;
  streak: number;
  lastActivityDate: Date;
  totalTimeSpent: number;
  modulesCompleted: number;
  perfectQuizzes: number;
}

interface LearningStore {
  // User profile
  userName: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  onboardingCompleted: boolean;
  
  // Progress tracking
  progress: LearningProgress[];
  achievements: Achievement[];
  quizAnswers: QuizAnswer[];
  exerciseResults: ExerciseResult[];
  
  // Statistics
  stats: LearningStats;
  
  // Current state
  currentModuleId: string | null;
  currentSubModuleId: string | null;
  
  // Actions
  setUserProfile: (name: string, level: 'beginner' | 'intermediate' | 'advanced') => void;
  completeOnboarding: () => void;
  
  // Progress actions
  startModule: (moduleId: string, subModuleId?: string) => void;
  completeModule: (moduleId: string, subModuleId?: string, score?: number) => void;
  updateProgress: (moduleId: string, subModuleId: string | undefined, timeSpent: number) => void;
  
  // Quiz actions
  saveQuizAnswer: (moduleId: string, questionId: string, answer: number, isCorrect: boolean) => void;
  getQuizResults: (moduleId: string) => { correct: number; total: number; percentage: number };
  completeQuiz: (moduleId: string) => void;
  
  // Exercise actions
  saveExerciseResult: (moduleId: string, exerciseId: string, result: any) => void;
  
  // Achievement actions
  unlockAchievement: (achievementId: string, points: number) => void;
  hasAchievement: (achievementId: string) => boolean;
  
  // Stats actions
  updateStats: () => void;
  addPoints: (points: number) => void;
  updateStreak: () => void;
  
  // Navigation
  setCurrentModule: (moduleId: string | null, subModuleId?: string | null) => void;
  
  // Utility functions
  getModuleProgress: (moduleId: string) => {
    overall: number;
    subModules: { [key: string]: 'not-started' | 'in-progress' | 'completed' };
  };
  
  canAccessModule: (moduleId: string, prerequisite?: string) => boolean;
  
  exportProgress: () => string;
  importProgress: (data: string) => void;
  resetProgress: () => void;
}

const calculateLevel = (points: number): string => {
  if (points >= 500) return 'platinum';
  if (points >= 250) return 'gold';
  if (points >= 100) return 'silver';
  return 'bronze';
};

export const useLearningStore = create<LearningStore>()(
  persist(
    (set, get) => ({
      // Initial state
      userName: '',
      userLevel: 'beginner',
      onboardingCompleted: false,
      progress: [],
      achievements: [],
      quizAnswers: [],
      exerciseResults: [],
      stats: {
        totalPoints: 0,
        level: 'bronze',
        streak: 0,
        lastActivityDate: new Date(),
        totalTimeSpent: 0,
        modulesCompleted: 0,
        perfectQuizzes: 0,
      },
      currentModuleId: null,
      currentSubModuleId: null,
      
      // User profile actions
      setUserProfile: (name, level) => set({ userName: name, userLevel: level }),
      
      completeOnboarding: () => set({ onboardingCompleted: true }),
      
      // Progress actions
      startModule: (moduleId, subModuleId) => {
        const state = get();
        const existingProgress = state.progress.find(
          p => p.moduleId === moduleId && p.subModuleId === subModuleId
        );
        
        if (!existingProgress) {
          set({
            progress: [...state.progress, {
              moduleId,
              subModuleId,
              status: 'in-progress',
              timeSpent: 0
            }]
          });
        } else if (existingProgress.status === 'not-started') {
          set({
            progress: state.progress.map(p =>
              p.moduleId === moduleId && p.subModuleId === subModuleId
                ? { ...p, status: 'in-progress' }
                : p
            )
          });
        }
        
        get().updateStreak();
      },
      
      completeModule: (moduleId, subModuleId, score) => {
        const state = get();
        const now = new Date();
        
        set({
          progress: state.progress.map(p =>
            p.moduleId === moduleId && p.subModuleId === subModuleId
              ? { ...p, status: 'completed', completedAt: now, score }
              : p
          )
        });
        
        // Check if entire module is now completed
        const moduleProgress = get().getModuleProgress(moduleId);
        const wasModuleCompleted = state.getModuleProgress(moduleId).overall === 100;
        const isModuleCompleted = moduleProgress.overall === 100;
        
        // Only increment module count if the entire module just got completed
        if (!wasModuleCompleted && isModuleCompleted) {
          const newStats = { ...state.stats };
          newStats.modulesCompleted += 1;
          set({ stats: newStats });
        }
        
        get().updateStats();
      },
      
      updateProgress: (moduleId, subModuleId, timeSpent) => {
        const state = get();
        
        set({
          progress: state.progress.map(p =>
            p.moduleId === moduleId && p.subModuleId === subModuleId
              ? { ...p, timeSpent: (p.timeSpent || 0) + timeSpent }
              : p
          )
        });
      },
      
      // Quiz actions
      saveQuizAnswer: (moduleId, questionId, answer, isCorrect) => {
        const state = get();
        
        set({
          quizAnswers: [...state.quizAnswers, {
            moduleId,
            questionId,
            answer,
            isCorrect,
            timestamp: new Date()
          }]
        });
        
        if (isCorrect) {
          get().addPoints(10);
        }
      },
      
      getQuizResults: (moduleId) => {
        const state = get();
        const moduleAnswers = state.quizAnswers.filter(a => a.moduleId === moduleId);
        const correct = moduleAnswers.filter(a => a.isCorrect).length;
        const total = moduleAnswers.length;
        const percentage = total > 0 ? (correct / total) * 100 : 0;
        
        return {
          correct,
          total,
          percentage
        };
      },
      
      completeQuiz: (moduleId) => {
        const state = get();
        const quizResults = state.getQuizResults(moduleId);
        
        // Track perfect quiz if score is 100%
        if (quizResults.percentage === 100 && quizResults.total > 0) {
          const newStats = { ...state.stats };
          newStats.perfectQuizzes += 1;
          set({ stats: newStats });
        }
      },
      
      // Exercise actions
      saveExerciseResult: (moduleId, exerciseId, result) => {
        const state = get();
        
        set({
          exerciseResults: [...state.exerciseResults, {
            moduleId,
            exerciseId,
            result,
            completedAt: new Date()
          }]
        });
        
        get().addPoints(15);
      },
      
      // Achievement actions
      unlockAchievement: (achievementId, points) => {
        const state = get();
        
        if (!state.hasAchievement(achievementId)) {
          set({
            achievements: [...state.achievements, {
              id: achievementId,
              unlockedAt: new Date(),
              points
            }]
          });
          
          get().addPoints(points);
        }
      },
      
      hasAchievement: (achievementId) => {
        const state = get();
        return state.achievements.some(a => a.id === achievementId);
      },
      
      // Stats actions
      updateStats: () => {
        const state = get();
        
        const totalTimeSpent = state.progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
        const level = calculateLevel(state.stats.totalPoints);
        
        set({
          stats: {
            ...state.stats,
            totalTimeSpent,
            level
          }
        });
      },
      
      addPoints: (points) => {
        const state = get();
        
        set({
          stats: {
            ...state.stats,
            totalPoints: state.stats.totalPoints + points
          }
        });
        
        get().updateStats();
      },
      
      updateStreak: () => {
        const state = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastActivity = new Date(state.stats.lastActivityDate);
        lastActivity.setHours(0, 0, 0, 0);
        
        const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
        
        let newStreak = state.stats.streak;
        
        if (daysDiff === 0) {
          // Same day, no change
        } else if (daysDiff === 1) {
          // Next day, increment streak
          newStreak += 1;
        } else {
          // Streak broken
          newStreak = 1;
        }
        
        set({
          stats: {
            ...state.stats,
            streak: newStreak,
            lastActivityDate: new Date()
          }
        });
      },
      
      // Navigation
      setCurrentModule: (moduleId, subModuleId = null) => {
        set({
          currentModuleId: moduleId,
          currentSubModuleId: subModuleId
        });
      },
      
      // Utility functions
      getModuleProgress: (moduleId) => {
        const state = get();
        const moduleProgress = state.progress.filter(p => p.moduleId === moduleId);
        
        const subModules: { [key: string]: 'not-started' | 'in-progress' | 'completed' } = {};
        let completedCount = 0;
        
        moduleProgress.forEach(p => {
          if (p.subModuleId) {
            subModules[p.subModuleId] = p.status;
            if (p.status === 'completed') completedCount++;
          }
        });
        
        const totalSubModules = Object.keys(subModules).length;
        
        // If no sub-modules, check if main module is completed
        if (totalSubModules === 0) {
          const mainModuleProgress = moduleProgress.find(p => !p.subModuleId);
          const overall = mainModuleProgress?.status === 'completed' ? 100 : 0;
          return { overall, subModules };
        }
        
        const overall = (completedCount / totalSubModules) * 100;
        
        return { overall, subModules };
      },
      
      canAccessModule: (moduleId, prerequisite) => {
        if (!prerequisite) return true;
        
        const state = get();
        const prereqProgress = state.getModuleProgress(prerequisite);
        
        return prereqProgress.overall === 100;
      },
      
      exportProgress: () => {
        const state = get();
        return JSON.stringify({
          userName: state.userName,
          userLevel: state.userLevel,
          progress: state.progress,
          achievements: state.achievements,
          quizAnswers: state.quizAnswers,
          exerciseResults: state.exerciseResults,
          stats: state.stats,
          exportedAt: new Date().toISOString()
        });
      },
      
      importProgress: (data) => {
        try {
          const parsedData = JSON.parse(data);
          set({
            userName: parsedData.userName || '',
            userLevel: parsedData.userLevel || 'beginner',
            progress: parsedData.progress || [],
            achievements: parsedData.achievements || [],
            quizAnswers: parsedData.quizAnswers || [],
            exerciseResults: parsedData.exerciseResults || [],
            stats: parsedData.stats || {
              totalPoints: 0,
              level: 'bronze',
              streak: 0,
              lastActivityDate: new Date(),
              totalTimeSpent: 0,
              modulesCompleted: 0,
              perfectQuizzes: 0,
            }
          });
        } catch (error) {
          // Failed to import learning progress - invalid JSON format
        }
      },
      
      resetProgress: () => {
        set({
          progress: [],
          achievements: [],
          quizAnswers: [],
          exerciseResults: [],
          stats: {
            totalPoints: 0,
            level: 'bronze',
            streak: 0,
            lastActivityDate: new Date(),
            totalTimeSpent: 0,
            modulesCompleted: 0,
            perfectQuizzes: 0,
          },
          currentModuleId: null,
          currentSubModuleId: null
        });
      }
    }),
    {
      name: 'fair-learning-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userName: state.userName,
        userLevel: state.userLevel,
        onboardingCompleted: state.onboardingCompleted,
        progress: state.progress,
        achievements: state.achievements,
        quizAnswers: state.quizAnswers,
        exerciseResults: state.exerciseResults,
        stats: state.stats
      })
    }
  )
);