'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssessmentStore } from '@/lib/assessment-store';
import { useTranslation } from '@/contexts/language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useSwipe } from '@/hooks/useSwipe';
import { 
  ChevronLeft, 
  ChevronRight, 
  HelpCircle, 
  CheckCircle, 
  BarChart3,
  Download,
  Upload,
  RotateCcw,
  Lightbulb
} from 'lucide-react';

// Import assessment data
import assessmentData from '@/data/assessment-questions.json';

interface QuestionCardProps {
  question: any;
  answer?: any;
  onAnswer: (answer: any) => void;
  showExplanation: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  answer, 
  onAnswer, 
  showExplanation 
}) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(answer?.value || '');

  const handleOptionSelect = (option: any) => {
    setSelectedOption(option.value);
    onAnswer({
      questionId: question.id,
      value: option.value,
      score: option.score,
      feedback: option.feedback
    });
  };

  // Helper function to get translated content with fallback to original
  const getTranslatedContent = (key: string, fallback: string) => {
    const translationKey = `assessment.questions.${question.id}.${key}`;
    const translated = t(translationKey);
    return translated !== translationKey ? translated : fallback;
  };

  return (
    <Card className="p-4 sm:p-6 space-y-4 sm:space-y-6 touch-manipulation">
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Badge variant="outline" className="font-mono text-xs sm:text-sm w-fit">
            {question.principle}
          </Badge>
          <h3 className="text-base sm:text-lg font-semibold leading-tight">{getTranslatedContent('title', question.title)}</h3>
        </div>
        
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          {getTranslatedContent('question', question.question)}
        </p>
        
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200"
            >
              <div className="flex items-start gap-2 sm:gap-3">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs sm:text-sm text-blue-800 font-medium mb-1">
                    {t('assessment.whyThisMatters')}
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                    {getTranslatedContent('explanation', question.explanation)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {question.options.map((option: any, index: number) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <button
              onClick={() => handleOptionSelect(option)}
              className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all touch-manipulation min-h-touch active:scale-95 ${
                selectedOption === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm sm:text-base font-medium leading-tight flex-1">{getTranslatedContent(`options.${option.value}.label`, option.label)}</span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge 
                    variant={selectedOption === option.value ? 'default' : 'outline'}
                    className="text-xs"
                  >
                    {option.score} puan
                  </Badge>
                  {selectedOption === option.value && (
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  )}
                </div>
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      {answer && answer.feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200"
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm text-green-800 font-medium mb-1">
                {t('assessment.feedback')}
              </p>
              <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
                {getTranslatedContent(`options.${answer.value}.feedback`, answer.feedback)}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {question.tips && showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200"
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <Lightbulb className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs sm:text-sm text-yellow-800 font-medium mb-2">
                {t('assessment.tipsForImprovement')}
              </p>
              <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                {question.tips.map((tip: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span className="leading-relaxed">{getTranslatedContent(`tips.${index}`, tip)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </Card>
  );
};

const CategoryProgress: React.FC<{ categories: any[] }> = ({ categories }) => {
  const { t } = useTranslation();
  const { currentCategoryIndex, getProgress } = useAssessmentStore();
  const progress = getProgress();

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h3 className="text-base sm:text-lg font-semibold">{t('assessment.progressTitle')}</h3>
        <Badge variant="outline" className="text-xs sm:text-sm w-fit">
          {progress.answeredQuestions}/{progress.totalQuestions} {t('assessment.questionsLabel')}
        </Badge>
      </div>
      
      <div className="space-y-2 sm:space-y-3">
        {categories.map((category, index) => {
          const categoryProgress = progress.categoryProgress[category.id] || { percentage: 0 };
          const isActive = index === currentCategoryIndex;
          
          return (
            <div
              key={category.id}
              className={`p-3 rounded-lg border-2 transition-all touch-manipulation ${
                isActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <span className="text-lg sm:text-xl">{category.icon}</span>
                  <span className="font-medium text-xs sm:text-sm truncate">{category.title}</span>
                </div>
                <Badge variant={isActive ? 'default' : 'outline'} className="text-xs flex-shrink-0">
                  {Math.round(categoryProgress.percentage)}%
                </Badge>
              </div>
              <Progress value={categoryProgress.percentage} className="h-2" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NavigationControls: React.FC = () => {
  const { t } = useTranslation();
  const {
    currentCategoryIndex,
    currentQuestionIndex,
    goToPreviousQuestion,
    goToNextQuestion,
    isCompleted,
    calculateResults
  } = useAssessmentStore();

  const { assessment } = assessmentData;
  const currentCategory = assessment.categories[currentCategoryIndex];
  const isLastQuestion = currentCategoryIndex === assessment.categories.length - 1 && 
                        currentQuestionIndex === currentCategory.questions.length - 1;

  const handleNext = () => {
    if (isLastQuestion) {
      calculateResults();
    } else {
      goToNextQuestion();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
      <Button
        variant="outline"
        onClick={goToPreviousQuestion}
        disabled={currentCategoryIndex === 0 && currentQuestionIndex === 0}
        className="flex items-center gap-2 w-full sm:w-auto min-h-touch"
        size="touch"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('common.previous')}
      </Button>

      <div className="flex flex-col sm:flex-row items-center gap-2 text-center">
        <Badge variant="outline" className="text-xs sm:text-sm">
          {t('assessment.questionCounter', { current: currentQuestionIndex + 1, total: currentCategory.questions.length })}
        </Badge>
        <Badge variant="outline" className="text-xs sm:text-sm truncate max-w-32 sm:max-w-none">
          {currentCategory.title}
        </Badge>
      </div>

      <Button
        onClick={handleNext}
        className="flex items-center gap-2 w-full sm:w-auto min-h-touch"
        size="touch"
      >
        {isLastQuestion ? (
          <>
            <BarChart3 className="h-4 w-4" />
            {t('assessment.complete')}
          </>
        ) : (
          <>
            {t('common.next')}
            <ChevronRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};

const AssessmentControls: React.FC = () => {
  const { t } = useTranslation();
  const { 
    showExplanations, 
    toggleExplanations, 
    resetAssessment,
    exportResults,
    importResults
  } = useAssessmentStore();

  const [importData, setImportData] = useState('');
  const [showImport, setShowImport] = useState(false);

  const handleExport = () => {
    const data = exportResults();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = t('assessment.exportFileName').replace('{{date}}', new Date().toISOString().split('T')[0]);
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    try {
      importResults(importData);
      setImportData('');
      setShowImport(false);
    } catch (error) {
      alert(t('assessment.invalidImportData'));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 flex-wrap">
      <Button
        variant="outline"
        size="touch"
        onClick={toggleExplanations}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <HelpCircle className="h-4 w-4" />
        {showExplanations ? t('assessment.hideExplanations') : t('assessment.showExplanations')}
      </Button>
      
      <Button
        variant="outline"
        size="touch"
        onClick={handleExport}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <Download className="h-4 w-4" />
        {t('assessment.exportProgress')}
      </Button>
      
      <Button
        variant="outline"
        size="touch"
        onClick={() => setShowImport(!showImport)}
        className="flex items-center gap-2 w-full sm:w-auto"
      >
        <Upload className="h-4 w-4" />
        {t('assessment.import')}
      </Button>
      
      <Button
        variant="outline"
        size="touch"
        onClick={resetAssessment}
        className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full sm:w-auto"
      >
        <RotateCcw className="h-4 w-4" />
        {t('assessment.reset')}
      </Button>

      {showImport && (
        <div className="w-full mt-2 p-3 bg-gray-50 rounded-lg">
          <textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder={t('assessment.importPlaceholder')}
            className="w-full p-2 border rounded text-sm min-h-touch"
            rows={3}
          />
          <div className="flex flex-col sm:flex-row gap-2 mt-2">
            <Button size="touch" onClick={handleImport} className="w-full sm:w-auto">
              {t('assessment.import')}
            </Button>
            <Button size="touch" variant="outline" onClick={() => setShowImport(false)} className="w-full sm:w-auto">
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const FairAssessmentTool: React.FC = () => {
  const { t } = useTranslation();
  const {
    currentCategoryIndex,
    currentQuestionIndex,
    answers,
    saveAnswer,
    showExplanations,
    isCompleted,
    goToPreviousQuestion,
    goToNextQuestion,
    calculateResults
  } = useAssessmentStore();

  const { assessment } = assessmentData;
  const currentCategory = assessment.categories[currentCategoryIndex];
  const currentQuestion = currentCategory.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  const isLastQuestion = currentCategoryIndex === assessment.categories.length - 1 && 
                        currentQuestionIndex === currentCategory.questions.length - 1;
  const isFirstQuestion = currentCategoryIndex === 0 && currentQuestionIndex === 0;

  // Handle swipe gestures for navigation
  const swipeHandlers = useSwipe({
    onSwipeLeft: () => {
      if (!isLastQuestion) {
        goToNextQuestion();
      } else {
        calculateResults();
      }
    },
    onSwipeRight: () => {
      if (!isFirstQuestion) {
        goToPreviousQuestion();
      }
    },
    threshold: 50,
  });

  if (isCompleted) {
    return null; // Results component will be shown
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {t('assessment.title')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t('assessment.subtitle')}
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center">
        <AssessmentControls />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          <CategoryProgress categories={assessment.categories} />
        </div>

        {/* Question Content */}
        <div className="lg:col-span-3 space-y-4 sm:space-y-6 order-1 lg:order-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentCategoryIndex}-${currentQuestionIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              {...swipeHandlers}
              className="touch-manipulation"
            >
              <QuestionCard
                question={currentQuestion}
                answer={currentAnswer}
                onAnswer={saveAnswer}
                showExplanation={showExplanations}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <NavigationControls />
        </div>
      </div>
    </div>
  );
};