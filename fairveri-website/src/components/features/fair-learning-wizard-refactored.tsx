'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Button, 
  Card, 
  Badge, 
  Progress, 
  Title, 
  Text, 
  Stack, 
  Group, 
  Container,
  Box,
  Stepper
} from '@mantine/core';
import { IconCheck, IconBrain } from '@tabler/icons-react';
import { useLearningStore } from '@/lib/learning-store';
import { createSafeHTMLProps } from '@/lib/html-sanitizer';
import learningData from '@/data/learning-modules.json';

// Import extracted components
import { MetadataBuilder } from './learning/MetadataBuilder';
import { LicenseSelector } from './learning/LicenseSelector';
import { QuizModal } from './learning/QuizModal';
import { AchievementModal } from './learning/AchievementModal';

interface LearningWizardProps {
  moduleId: string;
  onComplete?: () => void;
}

export function FairLearningWizardRefactored({ moduleId, onComplete }: LearningWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAchievement, setShowAchievement] = useState<string | null>(null);
  
  // State for interactive components
  const [metadataScore, setMetadataScore] = useState<number | null>(null);
  const [licenseRecommendation, setLicenseRecommendation] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<any>({});
  
  const {
    startModule,
    completeModule,
    updateProgress,
    saveQuizAnswer,
    saveExerciseResult,
    unlockAchievement,
    getUserProgress
  } = useLearningStore();

  const module = learningData.modules.find(m => m.id === moduleId);
  const progress = getUserProgress(moduleId);

  useEffect(() => {
    if (module && !progress.started) {
      startModule(moduleId);
    }
  }, [moduleId, module, progress.started, startModule]);

  const currentContent = module?.content[currentStep];
  const isLastStep = currentStep === (module?.content.length || 0) - 1;

  const handleNext = useCallback(() => {
    if (module) {
      updateProgress(moduleId, currentStep + 1, (module.content.length));
      
      if (isLastStep) {
        completeModule(moduleId);
        unlockAchievement('module-complete');
        setShowAchievement('module-complete');
        onComplete?.();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  }, [currentStep, isLastStep, module, moduleId, updateProgress, completeModule, unlockAchievement, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleQuizAnswer = useCallback((questionId: string, answer: string) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
    saveQuizAnswer(moduleId, questionId, answer);
  }, [moduleId, saveQuizAnswer]);

  const handleMetadataScoreUpdate = useCallback((score: number) => {
    setMetadataScore(score);
    saveExerciseResult(moduleId, 'metadata-builder', { score });
    
    if (score >= 80) {
      unlockAchievement('metadata-master');
      setShowAchievement('metadata-master');
    }
  }, [moduleId, saveExerciseResult, unlockAchievement]);

  const handleLicenseRecommendationUpdate = useCallback((recommendation: any) => {
    setLicenseRecommendation(recommendation);
    saveExerciseResult(moduleId, 'license-selector', recommendation);
    
    if (recommendation.fairnessScore >= 90) {
      unlockAchievement('license-expert');
      setShowAchievement('license-expert');
    }
  }, [moduleId, saveExerciseResult, unlockAchievement]);

  const renderContent = () => {
    if (!currentContent) return null;

    switch (currentContent.type) {
      case 'lesson':
        return (
          <Card padding="xl" withBorder>
            <Stack gap="lg">
              <Group justify="space-between">
                <Badge variant="light" size="lg">{currentContent.type.toUpperCase()}</Badge>
                <Text size="sm" c="dimmed">
                  {currentStep + 1} / {module?.content.length}
                </Text>
              </Group>
              
              <Title order={2}>{currentContent.title}</Title>
              
              <div {...createSafeHTMLProps(currentContent.content)} />
              
              {currentContent.keyPoints && (
                <Card padding="md" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
                  <Title order={4} mb="sm">Önemli Noktalar:</Title>
                  <Stack gap="xs">
                    {currentContent.keyPoints.map((point: string, index: number) => (
                      <Group key={index} gap="sm">
                        <IconCheck size={16} color="var(--mantine-color-green-6)" />
                        <Text size="sm">{point}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Card>
              )}
            </Stack>
          </Card>
        );

      case 'interactive':
        return (
          <Stack gap="md">
            {currentContent.elements?.map((element: any, index: number) => {
              switch (element.type) {
                case 'metadata-builder':
                  return (
                    <MetadataBuilder
                      key={index}
                      element={element}
                      onScoreUpdate={handleMetadataScoreUpdate}
                    />
                  );
                
                case 'license-selector':
                  return (
                    <LicenseSelector
                      key={index}
                      element={element}
                      onRecommendationUpdate={handleLicenseRecommendationUpdate}
                    />
                  );
                
                default:
                  return (
                    <Card key={index} padding="lg" withBorder>
                      <Title order={4}>{element.title}</Title>
                      <Text>{element.description}</Text>
                    </Card>
                  );
              }
            })}
          </Stack>
        );

      case 'practice':
        return (
          <Card padding="xl" withBorder>
            <Stack gap="lg">
              <Group justify="space-between">
                <Badge variant="light" size="lg" color="green">PRACTICE</Badge>
                <Text size="sm" c="dimmed">
                  {currentStep + 1} / {module?.content.length}
                </Text>
              </Group>
              
              <Title order={2}>{currentContent.title}</Title>
              <Text>{currentContent.description}</Text>
              
              {currentContent.exercises?.map((exercise: any, index: number) => (
                <Card key={index} padding="md" withBorder style={{ backgroundColor: 'var(--mantine-color-green-0)' }}>
                  <Stack gap="sm">
                    <Title order={4}>{exercise.title}</Title>
                    <Text size="sm">{exercise.description}</Text>
                    {exercise.hints && (
                      <Text size="xs" c="dimmed">
                        💡 İpucu: {exercise.hints[0]}
                      </Text>
                    )}
                  </Stack>
                </Card>
              ))}
            </Stack>
          </Card>
        );

      default:
        return (
          <Card padding="xl" withBorder>
            <Title order={2}>{currentContent.title}</Title>
            <Text>{currentContent.description}</Text>
          </Card>
        );
    }
  };

  if (!module) {
    return (
      <Container size="md" py="xl">
        <Text ta="center">Modül bulunamadı.</Text>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Progress Header */}
        <Card padding="lg" withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Title order={3}>{module.title}</Title>
                <Text size="sm" c="dimmed">{module.description}</Text>
              </div>
              <Badge size="lg" variant="light">
                {Math.round((currentStep / module.content.length) * 100)}% Tamamlandı
              </Badge>
            </Group>
            
            <Progress 
              value={(currentStep / module.content.length) * 100} 
              size="md" 
            />
            
            <Stepper 
              active={currentStep} 
              size="sm"
              allowNextStepsSelect={false}
            >
              {module.content.map((content, index) => (
                <Stepper.Step
                  key={index}
                  label={`Adım ${index + 1}`}
                  description={content.title}
                />
              ))}
            </Stepper>
          </Stack>
        </Card>

        {/* Main Content */}
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
        <Group justify="space-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            ← Önceki
          </Button>

          <Group gap="sm">
            {module.quiz && currentStep === module.content.length - 1 && (
              <Button
                variant="light"
                leftSection={<IconBrain size={16} />}
                onClick={() => setShowQuiz(true)}
              >
                Quiz'i Başlat
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              disabled={false}
            >
              {isLastStep ? 'Tamamla' : 'Sonraki →'}
            </Button>
          </Group>
        </Group>
      </Stack>

      {/* Modals */}
      <QuizModal
        isOpen={showQuiz}
        onClose={() => setShowQuiz(false)}
        quiz={module.quiz}
        onAnswerSubmit={handleQuizAnswer}
        answers={quizAnswers}
      />

      <AchievementModal
        isOpen={!!showAchievement}
        onClose={() => setShowAchievement(null)}
        achievement={showAchievement}
      />
    </Container>
  );
}