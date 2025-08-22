'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Button, 
  Card, 
  Badge, 
  Progress, 
  Modal, 
  Title, 
  Text, 
  Stack, 
  Group, 
  Radio, 
  Paper,
  ThemeIcon,
  Container,
  Box,
  TextInput
} from '@mantine/core';
import { IconCheck, IconX, IconBrain, IconTrophy } from '@tabler/icons-react';
import { useLearningStore } from '@/lib/learning-store';
import learningData from '@/data/learning-modules.json';

interface LearningWizardProps {
  moduleId: string;
  onComplete?: () => void;
}

export function FairLearningWizard({ moduleId, onComplete }: LearningWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  const [interactiveState, setInteractiveState] = useState<any>({});
  
  // All hooks for interactive elements - moved to top level to prevent hooks order issues
  const [metadataScore, setMetadataScore] = useState<number | null>(null);
  const [licenseAnswers, setLicenseAnswers] = useState<any>({});
  const [licenseRecommendation, setLicenseRecommendation] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<any>({});
  
  const {
    startModule,
    completeModule,
    updateProgress,
    saveQuizAnswer,
    saveExerciseResult,
    unlockAchievement,
    hasAchievement,
    getQuizResults,
    addPoints
  } = useLearningStore();
  
  const module = learningData.learningModules.modules.find(m => m.id === moduleId);
  const currentSubModule = module?.modules?.[currentStep];
  
  const { register, handleSubmit, reset, watch } = useForm();
  const { register: metaRegister, handleSubmit: metaHandleSubmit, formState: { errors } } = useForm();
  
  useEffect(() => {
    if (module && currentSubModule) {
      startModule(module.id, currentSubModule.id);
    }
  }, [module, currentSubModule, startModule]);
  
  useEffect(() => {
    // Track time spent
    const interval = setInterval(() => {
      if (module && currentSubModule) {
        updateProgress(module.id, currentSubModule.id, 1);
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [module, currentSubModule, updateProgress]);
  
  const handleQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSubModule || !('quiz' in currentSubModule.content) || !currentSubModule.content.quiz) return;
    
    const quiz = currentSubModule.content.quiz;
    let correctCount = 0;
    
    quiz.questions.forEach((question: any) => {
      const userAnswer = parseInt(quizAnswers[question.id]);
      const isCorrect = userAnswer === question.correct;
      
      saveQuizAnswer(module!.id, question.id, userAnswer, isCorrect);
      if (isCorrect) correctCount++;
    });
    
    const percentage = (correctCount / quiz.questions.length) * 100;
    
    if (percentage === 100 && !hasAchievement('quiz-master')) {
      unlockAchievement('quiz-master', 20);
      setShowAchievement('quiz-master');
    }
    
    setShowQuiz(false);
    setQuizAnswers({}); // Reset quiz answers
    
    // Mark current sub-module as completed after quiz
    if (currentSubModule) {
      completeModule(module!.id, currentSubModule.id);
    }
    
    if (currentStep < module!.modules.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleModuleComplete();
    }
  };
  
  const handleExerciseComplete = (exerciseId: string, result: any) => {
    saveExerciseResult(module!.id, exerciseId, result);
    addPoints(15);
  };
  
  const handleModuleComplete = () => {
    if (!module) return;
    
    // Complete all sub-modules of this module
    module.modules.forEach((subModule: any) => {
      completeModule(module.id, subModule.id);
    });
    
    // Check for achievements
    if (!hasAchievement('first-step') && module.id === 'intro') {
      unlockAchievement('first-step', 10);
      setShowAchievement('first-step');
    }
    
    // Module-specific achievements
    const moduleAchievements = module.achievements || [];
    moduleAchievements.forEach((achievement: any) => {
      if (!hasAchievement(achievement.id)) {
        unlockAchievement(achievement.id, achievement.points);
        setShowAchievement(achievement.id);
      }
    });
    
    if (onComplete) {
      onComplete();
    }
  };
  
  const renderContent = () => {
    if (!currentSubModule) return null;
    
    switch (currentSubModule.type) {
      case 'lesson':
        return renderLesson();
      case 'interactive':
        return renderInteractive();
      case 'practice':
        return renderPractice();
      default:
        return null;
    }
  };
  
  const renderLesson = () => {
    if (!currentSubModule) return null;
    const content = currentSubModule.content;
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">{currentSubModule.title}</h3>
          <p className="text-gray-800 mb-6">
            {content.introduction}
          </p>
        </div>
        
        {'sections' in content && content.sections?.map((section: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-blue-50/50 dark:bg-gray-600/60 rounded-lg p-6"
          >
            <h4 className="text-xl font-semibold mb-3">{section.title}</h4>
            <p className="text-gray-800 mb-4">
              {section.content}
            </p>
            
            {section.highlights && (
              <ul className="list-disc list-inside space-y-2 text-gray-800">
                {section.highlights.map((highlight: string, idx: number) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            )}
            
            {section.benefits && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.benefits.map((benefit: string, idx: number) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="text-green-800 dark:text-green-400">✓</span>
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            )}
            
            {section.examples && (
              <div className="mt-4 space-y-3">
                {section.examples.map((example: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-gray-500/70 rounded p-4">
                    <div className="font-semibold text-sm text-blue-900 dark:text-blue-300">
                      {example.type}
                    </div>
                    <code className="text-sm text-gray-800">
                      {example.format}
                    </code>
                    <p className="text-sm text-gray-800 mt-1">
                      {example.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    );
  };
  
  const renderInteractive = () => {
    if (!currentSubModule) return null;
    const content = currentSubModule.content;
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">{currentSubModule.title}</h3>
          <p className="text-gray-800 mb-6">
            {content.introduction}
          </p>
        </div>
        
        {'interactiveElements' in content && content.interactiveElements?.map((element: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800/40 dark:to-blue-800/40 rounded-lg p-6 border border-slate-200/50 dark:border-slate-700/50"
          >
            <h4 className="text-xl font-semibold mb-4">{element.title}</h4>
            <p className="text-gray-800 mb-4">
              {element.description}
            </p>
            
            {element.type === 'scenario' && renderScenario(element)}
            {element.type === 'metadata-builder' && renderMetadataBuilder(element)}
            {element.type === 'access-control-designer' && renderAccessControlDesigner(element)}
            {element.type === 'vocabulary-explorer' && renderVocabularyExplorer(element)}
            {element.type === 'license-selector' && renderLicenseSelector(element)}
          </motion.div>
        ))}
        
        {content.exercise && renderExercise(content.exercise)}
      </div>
    );
  };
  
  const renderPractice = () => {
    const content = currentSubModule.content;
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold mb-4">{currentSubModule.title}</h3>
          <p className="text-gray-800 mb-6">
            {content.introduction}
          </p>
        </div>
        
        {content.challenges?.map((challenge: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6"
          >
            <h4 className="text-xl font-semibold mb-4 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              {challenge.title}
            </h4>
            <p className="text-gray-800 mb-4">
              {challenge.description}
            </p>
            
            <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/60 dark:to-slate-700/60 border border-slate-200/70 dark:border-slate-600/70 rounded p-4 mb-4">
              <strong>Senaryo:</strong> {challenge.scenario}
            </div>
            
            {challenge.options && (
              <div className="space-y-3">
                {challenge.options.map((option: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/60 dark:to-slate-700/60 border border-slate-200/70 dark:border-slate-600/70 rounded p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setInteractiveState({
                        ...interactiveState,
                        [`challenge_${challenge.id}`]: option.name
                      });
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-semibold">{option.name}</h5>
                        <div className="text-sm text-gray-900 dark:text-gray-200 mt-2">
                          <div className="text-green-900 dark:text-green-300">
                            ✓ {option.pros.join(', ')}
                          </div>
                          <div className="text-red-900 dark:text-red-300">
                            ✗ {option.cons.join(', ')}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">{option.score}/10</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {interactiveState[`challenge_${challenge.id}`] && challenge.feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/25 dark:to-blue-900/25 border border-sky-200/70 dark:border-sky-700/70 rounded"
              >
                <p className="text-sm">
                  {interactiveState[`challenge_${challenge.id}`] === challenge.options[1].name
                    ? challenge.feedback.optimal
                    : interactiveState[`challenge_${challenge.id}`] === challenge.options[0].name
                    ? challenge.feedback.acceptable
                    : challenge.feedback.avoid}
                </p>
              </motion.div>
            )}
          </motion.div>
        ))}
        
        {content.miniProject && renderMiniProject(content.miniProject)}
      </div>
    );
  };
  
  const renderScenario = (element: any) => {
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/25 dark:to-purple-900/25 rounded-lg p-4 border border-indigo-200/50 dark:border-indigo-700/50">
          <p className="italic text-gray-800">{element.description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {element.choices.map((choice: any, idx: number) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                interactiveState[`scenario_${element.title}_choice`] === idx
                  ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 shadow-md'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-500'
              }`}
              onClick={() => setInteractiveState({
                ...interactiveState,
                [`scenario_${element.title}_choice`]: idx
              })}
            >
              <h5 className="font-semibold mb-2">{choice.option}</h5>
              {interactiveState[`scenario_${element.title}_choice`] === idx && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <p className="text-sm text-gray-800">
                    {choice.result}
                  </p>
                  <div className="space-y-1 text-sm">
                    <div className={`flex justify-between ${
                      choice.impact.time.startsWith('+') ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                    }`}>
                      <span>Zaman:</span>
                      <span>{choice.impact.time}</span>
                    </div>
                    <div className={`flex justify-between ${
                      choice.impact.cost.startsWith('+') ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                    }`}>
                      <span>Maliyet:</span>
                      <span>{choice.impact.cost}</span>
                    </div>
                    <div className={`flex justify-between ${
                      choice.impact.efficiency.startsWith('+') ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'
                    }`}>
                      <span>Verimlilik:</span>
                      <span>{choice.impact.efficiency}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderMetadataBuilder = (element: any) => {
    
    const onMetadataSubmit = (data: any) => {
      let score = 0;
      const maxScore = element.fields.length * 10;
      
      element.fields.forEach((field: any) => {
        if (data[field.id]) {
          score += 10;
          if (field.id === 'description' && data[field.id].length >= 200) {
            score += 5;
          }
          if (field.id === 'keywords' && data[field.id].split(',').length >= 5) {
            score += 5;
          }
        }
      });
      
      const percentage = (score / (maxScore + 10)) * 100;
      setMetadataScore(percentage);
      
      handleExerciseComplete('metadata-builder', { data, score: percentage });
    };
    
    return (
      <Card p="xl" withBorder radius="lg" shadow="sm" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 197, 253, 0.05) 100%)' }}>
        <Stack gap="lg">
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} mb="sm">
              <IconCheck size={24} />
            </ThemeIcon>
            <Title order={4} mb="xs">Metadata Oluşturucu</Title>
            <Text size="sm" c="gray.8">
              Aşağıdaki alanları doldurarak kaliteli metadata oluşturun
            </Text>
          </div>
          
          <form onSubmit={metaHandleSubmit(onMetadataSubmit)}>
            <Stack gap="md">
              {element.fields.map((field: any) => (
                <Paper key={field.id} p="md" withBorder radius="md" bg="white">
                  <Stack gap="xs">
                    <Group justify="space-between" align="center">
                      <Text size="sm" fw={500}>
                        {field.label} {field.required && <Text component="span" c="red">*</Text>}
                      </Text>
                      {field.hint && (
                        <Text size="xs" c="gray.7" style={{ maxWidth: '200px', textAlign: 'right' }}>
                          {field.hint}
                        </Text>
                      )}
                    </Group>
                    <TextInput
                      {...metaRegister(field.id, { required: field.required })}
                      placeholder={field.hint}
                      size="md"
                      radius="md"
                      error={errors[field.id] ? 'Bu alan zorunludur' : undefined}
                      style={{ fontSize: '14px' }}
                    />
                  </Stack>
                </Paper>
              ))}
              
              <Group justify="space-between" align="center" mt="xl">
                <Button 
                  type="submit" 
                  size="lg"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  leftSection={<IconBrain size={18} />}
                  radius="md"
                >
                  Metadata'yı Değerlendir
                </Button>
                
                {metadataScore !== null && (
                  <Paper 
                    p="lg" 
                    withBorder 
                    radius="lg" 
                    shadow="md"
                    style={{ 
                      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                      border: '2px solid #3b82f6'
                    }}
                  >
                    <Stack gap="xs" align="center">
                      <Text size="2xl" fw={900} c="blue" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                        %{metadataScore.toFixed(0)}
                      </Text>
                      <Text size="sm" fw={600} c="blue.7" ta="center">
                        Metadata Kalitesi
                      </Text>
                      <Text size="xs" c="gray.7" ta="center">
                        {metadataScore >= 80 ? '🎉 Mükemmel!' : metadataScore >= 60 ? '👍 İyi!' : '📝 Geliştirilebilir'}
                      </Text>
                    </Stack>
                  </Paper>
                )}
              </Group>
            </Stack>
          </form>
        </Stack>
      </Card>
    );
  };
  
  const renderAccessControlDesigner = (element: any) => {
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {element.dataTypes.map((type: any, idx: number) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                interactiveState[`access_control_selected`]?.type === type.type
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              onClick={() => setInteractiveState({
                ...interactiveState,
                access_control_selected: type
              })}
            >
              <h5 className="font-semibold mb-2">{type.type}</h5>
              <Badge variant={
                type.sensitivity === 'Düşük' ? 'secondary' :
                type.sensitivity === 'Orta' ? 'default' : 'destructive'
              }>
                {type.sensitivity} Hassasiyet
              </Badge>
              <div className="mt-3 text-sm text-gray-900 dark:text-gray-200">
                <p className="font-medium">Örnekler:</p>
                <ul className="list-disc list-inside">
                  {type.examples.map((ex: string, i: number) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        
        {interactiveState.access_control_selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50/50 dark:bg-gray-600/60 rounded-lg p-4"
          >
            <h5 className="font-semibold mb-2">Önerilen Erişim Kontrolü</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Erişim Seviyesi:</span>
                <span className="font-medium">{interactiveState.access_control_selected.accessLevel}</span>
              </div>
              <div className="flex justify-between">
                <span>Kimlik Doğrulama:</span>
                <span className="font-medium">{interactiveState.access_control_selected.authentication}</span>
              </div>
            </div>
          </motion.div>
        )}
        
        {element.exercise && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <h5 className="font-semibold mb-2">{element.exercise.title}</h5>
            <p className="text-sm mb-3">{element.exercise.scenario}</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              {element.exercise.tasks.map((task: string, idx: number) => (
                <li key={idx}>{task}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    );
  };
  
  const renderVocabularyExplorer = (element: any) => {
    // Initialize selectedDomain if not already set
    const currentSelectedDomain = interactiveState[`vocab_selected_domain`] || element.domains[0];
    
    return (
      <div className="space-y-4">
        <div className="flex space-x-2 mb-4">
          {element.domains.map((domain: any) => (
            <Button
              key={domain.field}
              variant={currentSelectedDomain.field === domain.field ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInteractiveState({
                ...interactiveState,
                vocab_selected_domain: domain
              })}
            >
              {domain.field}
            </Button>
          ))}
        </div>
        
        <div className="space-y-3">
          {currentSelectedDomain.vocabularies.map((vocab: any, idx: number) => (
            <div key={idx} className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/60 dark:to-slate-700/60 border border-slate-200/70 dark:border-slate-600/70 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h5 className="font-semibold">{vocab.name}</h5>
                <a
                  href={vocab.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900 dark:text-blue-300 hover:underline text-sm"
                >
                  Keşfet →
                </a>
              </div>
              <p className="text-sm text-gray-900 dark:text-gray-200 mb-2">
                {vocab.description}
              </p>
              <code className="text-sm bg-gray-200 px-2 py-1 rounded text-gray-800">
                {vocab.example}
              </code>
            </div>
          ))}
        </div>
        
        {element.exercise && (
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/25 dark:to-blue-900/25 border border-sky-200/70 dark:border-sky-700/70 rounded-lg p-4">
            <h5 className="font-semibold mb-3">{element.exercise.title}</h5>
            <p className="text-sm mb-3">{element.exercise.description}</p>
            
            {element.exercise.examples.map((example: any, idx: number) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/60 dark:to-slate-700/60 border border-slate-200/70 dark:border-slate-600/70 rounded p-3 mb-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-900 dark:text-gray-300">Serbest Metin:</span>
                    <p className="font-medium">{example.freeText}</p>
                  </div>
                  <div>
                    <span className="text-gray-900 dark:text-gray-300">Kontrollü Terim:</span>
                    <p className="font-medium">{example.controlledTerm}</p>
                    <a
                      href={example.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-900 dark:text-blue-300 hover:underline"
                    >
                      {example.uri}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const renderLicenseSelector = (element: any) => {
    
    const handleAnswerChange = (questionId: string, answer: string) => {
      const newAnswers = { ...licenseAnswers, [questionId]: answer };
      setLicenseAnswers(newAnswers);
      
      // Find matching license
      for (const [licenseId, license] of Object.entries(element.recommendations)) {
        const matches = element.questions.every((q: any) => 
          (license as any).conditions[q.id] === newAnswers[q.id]
        );
        
        if (matches) {
          setLicenseRecommendation({ id: licenseId, ...license });
          break;
        }
      }
    };
    
    return (
      <div className="space-y-4">
        {element.questions.map((question: any) => (
          <div key={question.id} className="space-y-2">
            <p className="font-medium">{question.question}</p>
            <div className="flex space-x-3">
              {question.options.map((option: string) => (
                <label key={option} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    className="text-blue-900 dark:text-blue-300"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        {licenseRecommendation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4"
          >
            <h5 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Önerilen Lisans: {licenseRecommendation.id}
            </h5>
            <p className="text-sm text-gray-800">
              {licenseRecommendation.description}
            </p>
          </motion.div>
        )}
      </div>
    );
  };
  
  const renderExercise = (exercise: any) => {
    return (
      <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
        <h4 className="text-lg font-semibold mb-3">{exercise.title}</h4>
        <p className="text-sm text-gray-800 mb-4">
          {exercise.description}
        </p>
        
        {exercise.inputs && (
          <form className="space-y-3">
            {exercise.inputs.map((input: any) => (
              <div key={input.id}>
                <label className="block text-sm font-medium mb-1">
                  {input.label}
                </label>
                <input
                  type={input.type}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-600/80 dark:border-gray-600"
                />
              </div>
            ))}
            <Button type="button" onClick={() => {
              // Calculate benefits based on inputs
              const benefits = {
                timeSaved: '6 ay',
                costSaved: '50.000₺',
                efficiencyGain: '%85'
              };
              handleExerciseComplete(exercise.title, benefits);
            }}>
              Faydaları Hesapla
            </Button>
          </form>
        )}
      </div>
    );
  };
  
  const renderMiniProject = (project: any) => {
    const currentCompletedTasks = interactiveState[`project_${project.title}_completed`] || [];
    
    const toggleTask = (step: number) => {
      const newCompletedTasks = currentCompletedTasks.includes(step)
        ? currentCompletedTasks.filter((s: number) => s !== step)
        : [...currentCompletedTasks, step];
      
      setInteractiveState({
        ...interactiveState,
        [`project_${project.title}_completed`]: newCompletedTasks
      });
    };
    
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg p-6 border border-emerald-200/50 dark:border-emerald-700/50">
        <h4 className="text-xl font-semibold mb-4">{project.title}</h4>
        
        <div className="space-y-3">
          {project.tasks.map((task: any) => (
            <motion.div
              key={task.step}
              className={`flex items-center space-x-3 p-3 rounded cursor-pointer transition-colors ${
                currentCompletedTasks.includes(task.step)
                  ? 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200/70 dark:border-emerald-700/70'
                  : 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-slate-800/60 dark:to-slate-700/60 border border-slate-200/70 dark:border-slate-600/70'
              }`}
              onClick={() => toggleTask(task.step)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                currentCompletedTasks.includes(task.step)
                  ? 'border-green-500 bg-green-500'
                  : 'border-gray-300'
              }`}>
                {currentCompletedTasks.includes(task.step) && (
                  <span className="text-white text-xs">✓</span>
                )}
              </div>
              <span className={currentCompletedTasks.includes(task.step) ? 'line-through' : ''}>
                {task.step}. {task.task}
              </span>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4">
          <Progress 
            value={(currentCompletedTasks.length / project.tasks.length) * 100} 
            className="h-2"
          />
          <p className="text-sm text-gray-900 dark:text-gray-200 mt-2">
            İlerleme: {currentCompletedTasks.length}/{project.tasks.length} görev tamamlandı
          </p>
        </div>
        
        {currentCompletedTasks.length === project.tasks.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 border border-emerald-200/70 dark:border-emerald-700/70 rounded text-center"
          >
            <p className="font-semibold text-green-900 dark:text-green-100">
              🎉 Tebrikler! Mini projeyi tamamladınız!
            </p>
            <p className="text-sm text-gray-900 dark:text-gray-200 mt-1">
              {project.deliverable}
            </p>
          </motion.div>
        )}
      </div>
    );
  };
  
  const renderQuizModal = () => {
    if (!currentSubModule?.content.quiz) return null;
    
    const quiz = currentSubModule.content.quiz;
    
    return (
      <Modal
        opened={showQuiz}
        onClose={() => setShowQuiz(false)}
        title={
          <Group>
            <ThemeIcon size="lg" color="blue" variant="light">
              <IconBrain size={20} />
            </ThemeIcon>
            <Title order={3}>Quiz Zamanı!</Title>
          </Group>
        }
        size="lg"
        centered
        padding="xl"
      >
        <Container size="sm" p={0}>
          <Stack gap="xl">
            <Text c="gray.8" size="sm" ta="center">
              Öğrendiklerinizi test edin ve bilginizi pekiştirin!
            </Text>
            
            <form onSubmit={handleQuizSubmit}>
              <Stack gap="lg">
                {quiz.questions.map((question: any, idx: number) => (
                  <Paper key={question.id} p="lg" withBorder radius="md">
                    <Stack gap="md">
                      <Group align="flex-start" gap="sm">
                        <ThemeIcon 
                          size="sm" 
                          color="blue" 
                          variant="light"
                          style={{ marginTop: 2 }}
                        >
                          {idx + 1}
                        </ThemeIcon>
                        <Text fw={500} style={{ flex: 1 }}>
                          {question.question}
                        </Text>
                      </Group>
                      
                      <Radio.Group
                        value={quizAnswers[question.id]?.toString()}
                        onChange={(value) => setQuizAnswers({
                          ...quizAnswers,
                          [question.id]: value
                        })}
                        name={question.id}
                      >
                        <Stack gap="xs" pl="md">
                          {question.options.map((option: string, optIdx: number) => (
                            <Paper
                              key={optIdx}
                              p="sm"
                              style={{ 
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: quizAnswers[question.id] === optIdx.toString() 
                                  ? 'var(--mantine-color-blue-0)' 
                                  : 'transparent'
                              }}
                              onClick={() => setQuizAnswers({
                                ...quizAnswers,
                                [question.id]: optIdx.toString()
                              })}
                            >
                              <Radio
                                value={optIdx.toString()}
                                label={option}
                                size="sm"
                                styles={{
                                  label: { cursor: 'pointer', fontSize: '14px' },
                                  body: { alignItems: 'flex-start' }
                                }}
                              />
                            </Paper>
                          ))}
                        </Stack>
                      </Radio.Group>
                    </Stack>
                  </Paper>
                ))}
                
                <Group justify="space-between" pt="md">
                  <Button 
                    variant="light" 
                    color="gray"
                    leftSection={<IconX size={16} />}
                    onClick={() => {
                      setShowQuiz(false);
                      setQuizAnswers({});
                    }}
                  >
                    İptal
                  </Button>
                  <Button 
                    type="submit"
                    leftSection={<IconCheck size={16} />}
                    gradient={{ from: 'blue', to: 'cyan' }}
                    variant="gradient"
                    disabled={Object.keys(quizAnswers).length !== quiz.questions.length}
                  >
                    Cevapları Gönder
                  </Button>
                </Group>
              </Stack>
            </form>
          </Stack>
        </Container>
      </Modal>
    );
  };
  
  const renderAchievementModal = () => {
    if (!showAchievement) return null;
    
    const achievement = module?.achievements?.find(a => a.id === showAchievement) || 
      learningData.learningModules.modules[0].achievements.find(a => a.id === showAchievement);
    
    if (!achievement) return null;
    
    return (
      <Modal
        opened={!!showAchievement}
        onClose={() => setShowAchievement(null)}
        title={
          <Group>
            <ThemeIcon size="lg" color="yellow" variant="light">
              <IconTrophy size={20} />
            </ThemeIcon>
            <Title order={3}>🎉 Yeni Başarı!</Title>
          </Group>
        }
        size="md"
        centered
        padding="xl"
      >
        <Container size="xs" p={0}>
          <Stack gap="xl" align="center" ta="center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Text size="4rem" style={{ lineHeight: 1 }}>
                {achievement.icon}
              </Text>
            </motion.div>
            
            <Stack gap="sm" align="center">
              <Title order={2} c="dark">
                {achievement.title}
              </Title>
              <Text c="gray.8" size="sm">
                {achievement.description}
              </Text>
            </Stack>
            
            <Paper 
              p="md" 
              withBorder 
              radius="md" 
              style={{ backgroundColor: 'var(--mantine-color-yellow-0)' }}
            >
              <Group justify="center" gap="xs">
                <Text size="2xl" fw={900} c="yellow.7">
                  +{achievement.points}
                </Text>
                <Text c="gray.7" fw={500}>
                  puan
                </Text>
              </Group>
            </Paper>
            
            <Button 
              onClick={() => setShowAchievement(null)}
              gradient={{ from: 'yellow', to: 'orange' }}
              variant="gradient"
              size="md"
              fullWidth
            >
              Devam Et
            </Button>
          </Stack>
        </Container>
      </Modal>
    );
  };
  
  if (!module || !currentSubModule) {
    return (
      <Container size="lg">
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack align="center" py="xl">
            <Text c="gray.8" ta="center">
              Modül bulunamadı veya yüklenemiyor.
            </Text>
            <Button 
              variant="light" 
              onClick={() => window.location.reload()}
            >
              Sayfayı Yenile
            </Button>
          </Stack>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container size="lg">
      {/* Progress Header */}
      <Box mb="xl">
        <Group justify="space-between" mb="md">
          <Stack gap="xs">
            <Group gap="sm">
              <Text size="2rem" style={{ lineHeight: 1 }}>
                {module.icon}
              </Text>
              <Title order={2}>
                {module.title}
              </Title>
            </Group>
            <Text c="gray.8">
              {module.description}
            </Text>
          </Stack>
          <Badge 
            variant="light" 
            color="blue" 
            size="lg"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            {currentStep + 1} / {module.modules.length}
          </Badge>
        </Group>
        
        <Progress 
          value={(currentStep / module.modules.length) * 100} 
          size="lg"
          radius="md"
          color="blue"
        />
      </Box>
      
      {/* Content */}
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation */}
        <Group justify="space-between" mt="xl" pt="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
          <Button
            variant="light"
            color="gray"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            ← Önceki
          </Button>
          
          <Button
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            onClick={() => {
              // Mark current sub-module as completed when moving to next step
              if (currentSubModule) {
                completeModule(module.id, currentSubModule.id);
              }
              
              if (currentSubModule.content.quiz && !showQuiz) {
                setShowQuiz(true);
              } else if (currentStep < module.modules.length - 1) {
                setCurrentStep(currentStep + 1);
              } else {
                handleModuleComplete();
              }
            }}
          >
            {currentSubModule.content.quiz && !showQuiz
              ? 'Quiz\'e Geç'
              : currentStep === module.modules.length - 1
              ? 'Modülü Tamamla'
              : 'Sonraki →'}
          </Button>
        </Group>
      </Card>
      
      {/* Modals */}
      {renderQuizModal()}
      {renderAchievementModal()}
    </Container>
  );
}