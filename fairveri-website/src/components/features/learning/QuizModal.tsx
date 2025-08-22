'use client';

import React, { useState } from 'react';
import { Modal, Title, Text, Stack, Group, Button, Radio, Alert, Progress } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: any;
  onAnswerSubmit: (questionId: string, answer: string) => void;
  answers: Record<string, string>;
}

export function QuizModal({ isOpen, onClose, quiz, onAnswerSubmit, answers }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  if (!quiz) return null;

  const question = quiz.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const correctAnswer = question.options.find((opt: any) => opt.correct);
  const isCorrect = selectedAnswer === correctAnswer?.id;

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    onAnswerSubmit(question.id, selectedAnswer);
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizComplete(true);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer('');
      setShowFeedback(false);
    }
  };

  const calculateScore = () => {
    const correctAnswers = quiz.questions.filter((q: any) => {
      const correctOpt = q.options.find((opt: any) => opt.correct);
      return answers[q.id] === correctOpt?.id;
    }).length;
    
    return Math.round((correctAnswers / quiz.questions.length) * 100);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setShowFeedback(false);
    setQuizComplete(false);
  };

  if (quizComplete) {
    const score = calculateScore();
    
    return (
      <Modal opened={isOpen} onClose={onClose} title="Quiz Tamamlandı!" size="md">
        <Stack gap="lg" align="center">
          <Text size="xl" fw={600} ta="center">
            Skorunuz: {score}%
          </Text>
          
          <Progress value={score} size="xl" w="100%" />
          
          <Alert
            color={score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red'}
            icon={score >= 80 ? <IconCheck size={16} /> : <IconX size={16} />}
            title={
              score >= 80 ? 'Mükemmel!' : 
              score >= 60 ? 'İyi İş!' : 
              'Tekrar Deneyin'
            }
          >
            <Text size="sm">
              {score >= 80 ? 'FAIR prensiplerini çok iyi kavramışsınız!' :
               score >= 60 ? 'İyi bir anlayışınız var, biraz daha çalışarak mükemmel olabilirsiniz.' :
               'FAIR prensiplerini daha iyi öğrenmek için materyalleri tekrar gözden geçirin.'}
            </Text>
          </Alert>
          
          <Group gap="md">
            <Button variant="outline" onClick={handleRestart}>
              Tekrar Dene
            </Button>
            <Button onClick={onClose}>
              Kapat
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  }

  return (
    <Modal opened={isOpen} onClose={onClose} title={quiz.title} size="lg">
      <Stack gap="md">
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Soru {currentQuestion + 1} / {quiz.questions.length}
          </Text>
          <Progress value={((currentQuestion) / quiz.questions.length) * 100} size="sm" w="200px" />
        </Group>
        
        <Title order={4}>{question.question}</Title>
        
        {!showFeedback ? (
          <>
            <Radio.Group
              value={selectedAnswer}
              onChange={setSelectedAnswer}
            >
              <Stack gap="sm">
                {question.options.map((option: any) => (
                  <Radio
                    key={option.id}
                    value={option.id}
                    label={option.text}
                    size="md"
                  />
                ))}
              </Stack>
            </Radio.Group>
            
            <Group justify="flex-end">
              <Button 
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer}
              >
                Cevabı Onayla
              </Button>
            </Group>
          </>
        ) : (
          <>
            <Alert
              color={isCorrect ? 'green' : 'red'}
              icon={isCorrect ? <IconCheck size={16} /> : <IconX size={16} />}
              title={isCorrect ? 'Doğru!' : 'Yanlış!'}
            >
              <Stack gap="sm">
                <Text size="sm">
                  {isCorrect ? 'Tebrikler! Doğru cevap verdiniz.' : `Doğru cevap: ${correctAnswer.text}`}
                </Text>
                {question.explanation && (
                  <Text size="sm" fw={500}>
                    Açıklama: {question.explanation}
                  </Text>
                )}
              </Stack>
            </Alert>
            
            <Group justify="flex-end">
              <Button onClick={handleNextQuestion}>
                {isLastQuestion ? 'Quizi Bitir' : 'Sonraki Soru'}
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}