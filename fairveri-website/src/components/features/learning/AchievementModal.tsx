'use client';

import React from 'react';
import { Modal, Title, Text, Stack, Group, Button, ThemeIcon } from '@mantine/core';
import { IconTrophy, IconStar, IconAward, IconMedal } from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement: string | null;
}

const achievements = {
  'first-lesson': {
    title: 'İlk Adım',
    description: 'İlk dersinizi tamamladınız!',
    icon: IconStar,
    color: 'blue',
    points: 10
  },
  'quiz-master': {
    title: 'Quiz Ustası',
    description: 'İlk quizinizi başarıyla geçtiniz!',
    icon: IconTrophy,
    color: 'gold',
    points: 25
  },
  'hands-on-learner': {
    title: 'Pratik Öğrenci',
    description: 'İlk interaktif alıştırmanızı tamamladınız!',
    icon: IconAward,
    color: 'green',
    points: 20
  },
  'fair-expert': {
    title: 'FAIR Uzmanı',
    description: 'Tüm FAIR prensiplerini öğrendiniz!',
    icon: IconMedal,
    color: 'purple',
    points: 100
  },
  'metadata-master': {
    title: 'Metadata Ustası',
    description: 'Metadata builder\'ı mükemmel bir şekilde kullandınız!',
    icon: IconTrophy,
    color: 'cyan',
    points: 30
  },
  'license-expert': {
    title: 'Lisans Uzmanı',
    description: 'Açık veri lisanslarını mükemmel seçtiniz!',
    icon: IconAward,
    color: 'orange',
    points: 30
  }
};

export function AchievementModal({ isOpen, onClose, achievement }: AchievementModalProps) {
  if (!achievement || !achievements[achievement as keyof typeof achievements]) {
    return null;
  }

  const achievementData = achievements[achievement as keyof typeof achievements];
  const IconComponent = achievementData.icon;

  return (
    <Modal 
      opened={isOpen} 
      onClose={onClose} 
      title="Başarı Kazandınız!" 
      size="md"
      centered
    >
      <Stack gap="lg" align="center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <ThemeIcon 
            size={80} 
            radius="xl" 
            color={achievementData.color}
            style={{ 
              background: `linear-gradient(135deg, var(--mantine-color-${achievementData.color}-4), var(--mantine-color-${achievementData.color}-6))`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
            }}
          >
            <IconComponent size={40} />
          </ThemeIcon>
        </motion.div>
        
        <Stack gap="xs" align="center">
          <Title order={2} ta="center" c={achievementData.color}>
            {achievementData.title}
          </Title>
          <Text size="lg" ta="center" c="dimmed">
            {achievementData.description}
          </Text>
          <Text size="sm" fw={600} c="green">
            +{achievementData.points} puan kazandınız!
          </Text>
        </Stack>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={onClose}
            size="lg"
            gradient={{ from: achievementData.color, to: achievementData.color }}
            variant="gradient"
          >
            Devam Et
          </Button>
        </motion.div>
      </Stack>
    </Modal>
  );
}