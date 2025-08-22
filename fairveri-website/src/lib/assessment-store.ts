import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AssessmentAnswer {
  questionId: string;
  value: string;
  score: number;
  feedback?: string;
}

export interface AssessmentResults {
  totalScore: number;
  maxScore: number;
  categoryScores: {
    [categoryId: string]: {
      score: number;
      maxScore: number;
      percentage: number;
    };
  };
  level: string;
  levelDescription: string;
  recommendations: string[];
  completedAt: Date;
}

interface AssessmentStore {
  // Current assessment state
  currentCategoryIndex: number;
  currentQuestionIndex: number;
  answers: AssessmentAnswer[];
  isCompleted: boolean;
  results: AssessmentResults | null;
  
  // UI state
  showExplanations: boolean;
  
  // Actions
  setCurrentCategory: (index: number) => void;
  setCurrentQuestion: (index: number) => void;
  saveAnswer: (answer: AssessmentAnswer) => void;
  removeAnswer: (questionId: string) => void;
  calculateResults: () => void;
  resetAssessment: () => void;
  toggleExplanations: () => void;
  
  // Navigation helpers
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  goToNextCategory: () => void;
  goToPreviousCategory: () => void;
  
  // Progress tracking
  getProgress: () => {
    totalQuestions: number;
    answeredQuestions: number;
    progressPercentage: number;
    categoryProgress: {
      [categoryId: string]: {
        total: number;
        answered: number;
        percentage: number;
      };
    };
  };
  
  // Data persistence
  exportResults: () => string;
  importResults: (data: string) => void;
}

// Import assessment questions
import assessmentData from '../data/assessment-questions.json';

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentCategoryIndex: 0,
      currentQuestionIndex: 0,
      answers: [],
      isCompleted: false,
      results: null,
      showExplanations: false,
      
      // Actions
      setCurrentCategory: (index) => set({ currentCategoryIndex: index, currentQuestionIndex: 0 }),
      
      setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
      
      saveAnswer: (answer) => set((state) => {
        const existingAnswerIndex = state.answers.findIndex(a => a.questionId === answer.questionId);
        const newAnswers = [...state.answers];
        
        if (existingAnswerIndex >= 0) {
          newAnswers[existingAnswerIndex] = answer;
        } else {
          newAnswers.push(answer);
        }
        
        return { answers: newAnswers };
      }),
      
      removeAnswer: (questionId) => set((state) => ({
        answers: state.answers.filter(a => a.questionId !== questionId)
      })),
      
      calculateResults: () => {
        const state = get();
        const { assessment } = assessmentData;
        
        // Calculate total score
        const totalScore = state.answers.reduce((sum, answer) => sum + answer.score, 0);
        const maxScore = assessment.scoring.maxScore;
        
        // Calculate category scores
        const categoryScores: { [categoryId: string]: { score: number; maxScore: number; percentage: number } } = {};
        
        assessment.categories.forEach((category: any) => {
          const categoryAnswers = state.answers.filter(answer => 
            category.questions.some((q: any) => q.id === answer.questionId)
          );
          
          const categoryScore = categoryAnswers.reduce((sum, answer) => sum + answer.score, 0);
          const categoryMaxScore = category.questions.reduce((sum: number, q: any) => 
            sum + Math.max(...q.options.map((opt: any) => opt.score)), 0
          );
          
          categoryScores[category.id] = {
            score: categoryScore,
            maxScore: categoryMaxScore,
            percentage: categoryMaxScore > 0 ? (categoryScore / categoryMaxScore) * 100 : 0
          };
        });
        
        // Determine level
        const level = assessment.scoring.levels.find((l: any) => 
          totalScore >= l.min && totalScore <= l.max
        );
        
        const results: AssessmentResults = {
          totalScore,
          maxScore,
          categoryScores,
          level: level?.level || 'Unknown',
          levelDescription: level?.description || '',
          recommendations: level?.recommendations || [],
          completedAt: new Date()
        };
        
        set({ results, isCompleted: true });
      },
      
      resetAssessment: () => set({
        currentCategoryIndex: 0,
        currentQuestionIndex: 0,
        answers: [],
        isCompleted: false,
        results: null
      }),
      
      toggleExplanations: () => set((state) => ({
        showExplanations: !state.showExplanations
      })),
      
      // Navigation helpers
      goToNextQuestion: () => {
        const state = get();
        const { assessment } = assessmentData;
        const currentCategory = assessment.categories[state.currentCategoryIndex];
        
        if (state.currentQuestionIndex < currentCategory.questions.length - 1) {
          set({ currentQuestionIndex: state.currentQuestionIndex + 1 });
        } else {
          // Move to next category
          get().goToNextCategory();
        }
      },
      
      goToPreviousQuestion: () => {
        const state = get();
        
        if (state.currentQuestionIndex > 0) {
          set({ currentQuestionIndex: state.currentQuestionIndex - 1 });
        } else {
          // Move to previous category
          get().goToPreviousCategory();
        }
      },
      
      goToNextCategory: () => {
        const state = get();
        const { assessment } = assessmentData;
        
        if (state.currentCategoryIndex < assessment.categories.length - 1) {
          set({ 
            currentCategoryIndex: state.currentCategoryIndex + 1,
            currentQuestionIndex: 0
          });
        }
      },
      
      goToPreviousCategory: () => {
        const state = get();
        const { assessment } = assessmentData;
        
        if (state.currentCategoryIndex > 0) {
          const previousCategory = assessment.categories[state.currentCategoryIndex - 1];
          set({ 
            currentCategoryIndex: state.currentCategoryIndex - 1,
            currentQuestionIndex: previousCategory.questions.length - 1
          });
        }
      },
      
      // Progress tracking
      getProgress: () => {
        const state = get();
        const { assessment } = assessmentData;
        
        const totalQuestions = assessment.categories.reduce((sum: number, cat: any) => 
          sum + cat.questions.length, 0
        );
        const answeredQuestions = state.answers.length;
        const progressPercentage = (answeredQuestions / totalQuestions) * 100;
        
        const categoryProgress: { [categoryId: string]: { total: number; answered: number; percentage: number } } = {};
        
        assessment.categories.forEach((category: any) => {
          const categoryAnswers = state.answers.filter(answer => 
            category.questions.some((q: any) => q.id === answer.questionId)
          );
          
          categoryProgress[category.id] = {
            total: category.questions.length,
            answered: categoryAnswers.length,
            percentage: (categoryAnswers.length / category.questions.length) * 100
          };
        });
        
        return {
          totalQuestions,
          answeredQuestions,
          progressPercentage,
          categoryProgress
        };
      },
      
      // Data persistence
      exportResults: () => {
        const state = get();
        return JSON.stringify({
          answers: state.answers,
          results: state.results,
          exportedAt: new Date().toISOString()
        });
      },
      
      importResults: (data) => {
        try {
          const parsedData = JSON.parse(data);
          set({
            answers: parsedData.answers || [],
            results: parsedData.results || null,
            isCompleted: !!parsedData.results
          });
        } catch (error) {
          // Failed to import assessment data - invalid JSON
        }
      }
    }),
    {
      name: 'fair-assessment-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        answers: state.answers,
        results: state.results,
        isCompleted: state.isCompleted,
        currentCategoryIndex: state.currentCategoryIndex,
        currentQuestionIndex: state.currentQuestionIndex
      })
    }
  )
);