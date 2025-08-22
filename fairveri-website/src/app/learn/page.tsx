'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Button,
  Badge,
  Progress,
  Avatar,
  Group,
  Stack,
  Modal,
  TextInput,
  Radio,
  Tabs,
  Paper,
  Center,
  Box,
  rem,
  ActionIcon
} from '@mantine/core';
import { IconArrowLeft, IconClock, IconLock, IconTrophy, IconFire, IconDownload, IconSettings } from '@tabler/icons-react';
import { FairLearningWizard } from '@/components/features/fair-learning-wizard';
import { useLearningStore } from '@/lib/learning-store';
import learningData from '@/data/learning-modules.json';

export default function LearnPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'modules' | 'achievements' | 'leaderboard'>('modules');
  
  const {
    userName,
    userLevel,
    onboardingCompleted,
    stats,
    achievements,
    progress,
    setUserProfile,
    completeOnboarding,
    getModuleProgress,
    canAccessModule,
    exportProgress,
    resetProgress
  } = useLearningStore();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !onboardingCompleted && !userName) {
      setShowOnboarding(true);
    }
  }, [mounted, onboardingCompleted, userName]);
  
  const handleOnboarding = (name: string, level: 'beginner' | 'intermediate' | 'advanced') => {
    setUserProfile(name, level);
    completeOnboarding();
    setShowOnboarding(false);
  };
  
  const handleModuleComplete = () => {
    setSelectedModule(null);
  };
  
  const renderOnboardingModal = () => (
    <Modal
      opened={showOnboarding}
      onClose={() => setShowOnboarding(false)}
      title="FAIR Öğrenme Yolculuğuna Hoş Geldiniz!"
      size="md"
      centered
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleOnboarding(
            formData.get('name') as string,
            formData.get('level') as 'beginner' | 'intermediate' | 'advanced'
          );
        }}
      >
        <Stack gap="lg">
          <TextInput
            label="Adınız"
            name="name"
            required
            placeholder="Adınızı girin"
            size="md"
          />
          
          <div>
            <Text size="sm" fw={500} mb="sm">
              FAIR Prensipleri Hakkındaki Bilgi Seviyeniz
            </Text>
            <Stack gap="xs">
              <Paper p="md" withBorder style={{ cursor: 'pointer' }} className="fairveri-card-hover">
                <Group>
                  <Radio
                    name="level"
                    value="beginner"
                    defaultChecked
                  />
                  <Box flex={1}>
                    <Text fw={500}>Başlangıç</Text>
                    <Text size="sm" c="dimmed">
                      FAIR prensipleri hakkında yeni bilgi ediniyorum
                    </Text>
                  </Box>
                </Group>
              </Paper>
              
              <Paper p="md" withBorder style={{ cursor: 'pointer' }} className="fairveri-card-hover">
                <Group>
                  <Radio
                    name="level"
                    value="intermediate"
                  />
                  <Box flex={1}>
                    <Text fw={500}>Orta</Text>
                    <Text size="sm" c="dimmed">
                      FAIR prensiplerini biliyorum ama uygulamada yardıma ihtiyacım var
                    </Text>
                  </Box>
                </Group>
              </Paper>
              
              <Paper p="md" withBorder style={{ cursor: 'pointer' }} className="fairveri-card-hover">
                <Group>
                  <Radio
                    name="level"
                    value="advanced"
                  />
                  <Box flex={1}>
                    <Text fw={500}>İleri</Text>
                    <Text size="sm" c="dimmed">
                      FAIR prensiplerini uyguluyorum ve derinleştirmek istiyorum
                    </Text>
                  </Box>
                </Group>
              </Paper>
            </Stack>
          </div>
          
          <Button type="submit" fullWidth size="md" color="navy">
            Öğrenmeye Başla
          </Button>
        </Stack>
      </form>
    </Modal>
  );
  
  const renderProfileSection = () => (
    <Card p="xl" mb="xl" className="fairveri-card-hover">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="lg">
          <Avatar
            size={64}
            radius="50%"
            variant="gradient"
            gradient={{ from: 'electricBlue', to: 'teal', deg: 135 }}
          >
            {userName.charAt(0).toUpperCase()}
          </Avatar>
          <Stack gap="xs">
            <Title order={2} className="fairveri-gradient-text">{userName}</Title>
            <Group gap="xs">
              <Badge
                color={
                  mounted ? (
                    stats.level === 'bronze' ? 'warning' :
                    stats.level === 'silver' ? 'gray' :
                    stats.level === 'gold' ? 'warning' : 'electricBlue'
                  ) : 'gray'
                }
                variant="light"
              >
                {mounted ? (
                  stats.level === 'bronze' ? '🥉 Bronz' :
                  stats.level === 'silver' ? '🥈 Gümüş' :
                  stats.level === 'gold' ? '🥇 Altın' : '💎 Platin'
                ) : '🥉 Bronz'}
              </Badge>
              <Text size="sm" c="dimmed">
                {mounted ? stats.totalPoints : 0} puan
              </Text>
            </Group>
          </Stack>
        </Group>
        
        <Group gap="xl" align="center">
          <Stack gap={2} align="center">
            <Text size="xl" fw={700}>{mounted ? stats.streak : 0}</Text>
            <Text size="sm" c="dimmed">Gün Serisi</Text>
          </Stack>
          <Stack gap={2} align="center">
            <Text size="xl" fw={700}>{mounted ? stats.modulesCompleted : 0}</Text>
            <Text size="sm" c="dimmed">Modül</Text>
          </Stack>
          <Stack gap={2} align="center">
            <Text size="xl" fw={700}>{mounted ? achievements.length : 0}</Text>
            <Text size="sm" c="dimmed">Rozet</Text>
          </Stack>
        </Group>
        
        <Group gap="xs">
          <Button
            variant="light"
            size="sm"
            leftSection={<IconSettings size={16} />}
            onClick={() => setShowProfile(true)}
          >
            Profil
          </Button>
          <Button
            variant="outline"
            size="sm"
            leftSection={<IconDownload size={16} />}
            onClick={() => {
              const data = exportProgress();
              const blob = new Blob([data], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'fair-learning-progress.json';
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            İndir
          </Button>
        </Group>
      </Group>
      
      <Stack gap="xs" mt="lg">
        <Group justify="space-between">
          <Text size="sm" fw={500}>Genel İlerleme</Text>
          <Text size="sm" c="dimmed">
            {mounted ? Math.round((stats.modulesCompleted / learningData.learningModules.modules.length) * 100) : 0}%
          </Text>
        </Group>
        <Progress 
          value={mounted ? (stats.modulesCompleted / learningData.learningModules.modules.length) * 100 : 0} 
          size="md"
          color="navy"
          radius="md"
        />
      </Stack>
    </Card>
  );
  
  const renderModuleTabs = () => (
    <Tabs value={selectedTab} onChange={(value) => setSelectedTab(value as 'modules' | 'achievements' | 'leaderboard')} mb="lg">
      <Tabs.List grow>
        <Tabs.Tab value="modules" leftSection={<IconTrophy size={16} />}>
          Modüller
        </Tabs.Tab>
        <Tabs.Tab value="achievements" leftSection={<IconTrophy size={16} />}>
          Başarılar
        </Tabs.Tab>
        <Tabs.Tab value="leaderboard" leftSection={<IconTrophy size={16} />}>
          Liderlik Tablosu
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
  
  const renderModulesList = () => (
    <Grid>
      {learningData.learningModules.modules.map((module) => {
        const moduleProgress = getModuleProgress(module.id);
        const isLocked = mounted ? !canAccessModule(module.id, module.prerequisite) : false;
        
        return (
          <Grid.Col key={module.id} span={{ base: 12, sm: 6, lg: 4 }}>
            {mounted ? (
              <motion.div
                whileHover={{ scale: isLocked ? 1 : 1.02 }}
                whileTap={{ scale: isLocked ? 1 : 0.98 }}
              >
                <Card
                p="lg"
                radius="lg"
                className="fairveri-card-hover cursor-pointer relative"
                style={{
                  background: mounted && !isLocked ? `linear-gradient(135deg, ${module.color}20 0%, ${module.color}10 100%)` : undefined,
                  height: '100%',
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  opacity: mounted && isLocked ? 0.6 : 1
                }}
                onClick={() => !isLocked && setSelectedModule(module.id)}
              >
                {mounted && isLocked && (
                  <Box 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(2px)',
                      zIndex: 1,
                      borderRadius: 'inherit'
                    }}
                  />
                )}
                
                {mounted && isLocked && (
                  <Center
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2
                    }}
                  >
                    <Paper p="md" radius="50%" withBorder>
                      <IconLock size={24} />
                    </Paper>
                  </Center>
                )}
                
                <Group justify="space-between" mb="md">
                  <Text size={rem(32)}>{module.icon}</Text>
                  <Badge
                    color={
                      module.difficulty === 'beginner' ? 'success' :
                      module.difficulty === 'intermediate' ? 'warning' : 'navy'
                    }
                    variant="light"
                  >
                    {module.difficulty === 'beginner' ? 'Başlangıç' :
                     module.difficulty === 'intermediate' ? 'Orta' : 'İleri'}
                  </Badge>
                </Group>
                
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Title order={3} mb="xs" className="fairveri-gradient-text">{module.title}</Title>
                  <Text size="sm" c="dimmed" mb="md" style={{ 
                    flex: '1', 
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: '1.4'
                  }}>
                    {module.description}
                  </Text>
                  
                  <div style={{ marginTop: 'auto' }}>
                    <Group gap="xs" mb="md">
                      <IconClock size={16} />
                      <Text size="sm" c="dimmed">
                        {module.estimatedTime}
                      </Text>
                    </Group>
                    
                    <div style={{ minHeight: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <Stack gap="xs" style={{ minHeight: '44px' }}>
                        <Group justify="space-between">
                          <Text size="xs" fw={500}>İlerleme</Text>
                          <Text size="xs" c="dimmed">
                            {mounted ? Math.round(moduleProgress.overall) : 0}%
                          </Text>
                        </Group>
                        <Progress 
                          value={mounted ? moduleProgress.overall : 0} 
                          size="sm"
                          color="navy"
                          radius="md"
                        />
                      </Stack>
                      
                      <div style={{ minHeight: '20px', marginTop: '8px' }}>
                        {module.prerequisite && isLocked && (
                          <Text size="xs" c="red">
                            Önce "{learningData.learningModules.modules.find(m => m.id === module.prerequisite)?.title}" modülünü tamamlayın
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              </motion.div>
            ) : (
              <div>
                <Card
                  p="lg"
                  radius="lg"
                  className="fairveri-card-hover cursor-pointer relative"
                  style={{
                    background: mounted && !isLocked ? `linear-gradient(135deg, ${module.color}20 0%, ${module.color}10 100%)` : undefined,
                    height: '100%',
                    minHeight: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: mounted && isLocked ? 0.6 : 1
                  }}
                  onClick={() => !isLocked && setSelectedModule(module.id)}
                >
                  {mounted && isLocked && (
                    <Box 
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255, 255, 255, 0.7)',
                        backdropFilter: 'blur(2px)',
                        zIndex: 1,
                        borderRadius: 'inherit'
                      }}
                    />
                  )}
                  
                  {mounted && isLocked && (
                    <Center
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2
                      }}
                    >
                      <Paper p="md" radius="50%" withBorder>
                        <IconLock size={24} />
                      </Paper>
                    </Center>
                  )}
                  
                  <Group justify="space-between" mb="md">
                    <Text size={rem(32)}>{module.icon}</Text>
                    <Badge
                      color={
                        module.difficulty === 'beginner' ? 'success' :
                        module.difficulty === 'intermediate' ? 'warning' : 'navy'
                      }
                      variant="light"
                    >
                      {module.difficulty === 'beginner' ? 'Başlangıç' :
                       module.difficulty === 'intermediate' ? 'Orta' : 'İleri'}
                    </Badge>
                  </Group>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Title order={3} mb="xs" className="fairveri-gradient-text">{module.title}</Title>
                    <Text size="sm" c="dimmed" mb="md" style={{ 
                      flex: '1', 
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      lineHeight: '1.4'
                    }}>
                      {module.description}
                    </Text>
                    
                    <div style={{ marginTop: 'auto' }}>
                      <Group gap="xs" mb="md">
                        <IconClock size={16} />
                        <Text size="sm" c="dimmed">
                          {module.estimatedTime}
                        </Text>
                      </Group>
                      
                      <div style={{ minHeight: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Stack gap="xs" style={{ minHeight: '44px' }}>
                          <Group justify="space-between">
                            <Text size="xs" fw={500}>İlerleme</Text>
                            <Text size="xs" c="dimmed">
                              {mounted ? Math.round(moduleProgress.overall) : 0}%
                            </Text>
                          </Group>
                          <Progress 
                            value={mounted ? moduleProgress.overall : 0} 
                            size="sm"
                            color="navy"
                            radius="md"
                          />
                        </Stack>
                        
                        <div style={{ minHeight: '20px', marginTop: '8px' }}>
                          {module.prerequisite && isLocked && (
                            <Text size="xs" c="red">
                              Önce "{learningData.learningModules.modules.find(m => m.id === module.prerequisite)?.title}" modülünü tamamlayın
                            </Text>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </Grid.Col>
        );
      })}
    </Grid>
  );
  
  const renderAchievements = () => {
    const allAchievements = learningData.learningModules.modules.flatMap(m => m.achievements || []);
    const categories = learningData.achievements.categories;
    
    return (
      <Stack gap="xl">
        {categories.map((category) => (
          <Stack key={category.id} gap="md">
            <Title order={3} className="fairveri-gradient-text">{category.title}</Title>
            <Text c="dimmed" mb="lg">{category.description}</Text>
            
            <Grid>
              {allAchievements
                .filter(a => {
                  if (category.id === 'progress') return ['first-step', 'fair-master'].includes(a.id);
                  if (category.id === 'mastery') return a.id.includes('master') || a.id.includes('expert');
                  if (category.id === 'practice') return a.id.includes('pro') || a.id.includes('architect');
                  return true;
                })
                .map((achievement) => {
                  const isUnlocked = achievements.some(a => a.id === achievement.id);
                  
                  return (
                    <Grid.Col key={achievement.id} span={{ base: 6, sm: 4, md: 3 }}>
                      {mounted ? (
                        <motion.div
                          whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                          style={{ opacity: isUnlocked ? 1 : 0.5, position: 'relative' }}
                        >
                        <Card p="md" className="fairveri-card-hover" style={{ textAlign: 'center', height: '100%' }}>
                          <Stack gap="xs" align="center">
                            <Text size={rem(32)}>{achievement.icon}</Text>
                            <Text fw={600} size="sm">{achievement.title}</Text>
                            <Text size="xs" c="dimmed" ta="center">
                              {achievement.description}
                            </Text>
                            <Badge color="warning" size="xs" variant="light">
                              +{achievement.points} puan
                            </Badge>
                          </Stack>
                          
                          {!isUnlocked && (
                            <Box 
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(2px)',
                                borderRadius: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <IconLock size={24} style={{ color: 'var(--mantine-color-dimmed)' }} />
                            </Box>
                          )}
                        </Card>
                        </motion.div>
                      ) : (
                        <Card p="md" className="fairveri-card-hover" style={{ textAlign: 'center', height: '100%', opacity: isUnlocked ? 1 : 0.5, position: 'relative' }}>
                          <Stack gap="xs" align="center">
                            <Text size={rem(32)}>{achievement.icon}</Text>
                            <Text fw={600} size="sm">{achievement.title}</Text>
                            <Text size="xs" c="dimmed" ta="center">
                              {achievement.description}
                            </Text>
                            <Badge color="warning" size="xs" variant="light">
                              +{achievement.points} puan
                            </Badge>
                          </Stack>
                          
                          {!isUnlocked && (
                            <Box 
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(255, 255, 255, 0.7)',
                                backdropFilter: 'blur(2px)',
                                borderRadius: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              <IconLock size={24} style={{ color: 'var(--mantine-color-dimmed)' }} />
                            </Box>
                          )}
                        </Card>
                      )}
                    </Grid.Col>
                  );
                })}
            </Grid>
          </Stack>
        ))}
      </Stack>
    );
  };
  
  const renderLeaderboard = () => {
    // Mock leaderboard data
    const leaderboardData = [
      { rank: 1, name: userName || 'Sen', points: mounted ? stats.totalPoints : 0, level: mounted ? stats.level : 'bronze', isCurrentUser: true },
      { rank: 2, name: 'Ayşe Y.', points: 580, level: 'platinum' },
      { rank: 3, name: 'Mehmet K.', points: 420, level: 'gold' },
      { rank: 4, name: 'Zeynep A.', points: 380, level: 'gold' },
      { rank: 5, name: 'Ali O.', points: 250, level: 'silver' },
      { rank: 6, name: 'Fatma S.', points: 180, level: 'silver' },
      { rank: 7, name: 'Hasan B.', points: 120, level: 'silver' },
      { rank: 8, name: 'Elif D.', points: 90, level: 'bronze' },
    ].sort((a, b) => b.points - a.points);
    
    // Update current user's rank
    const currentUserIndex = leaderboardData.findIndex(u => u.isCurrentUser);
    if (currentUserIndex > -1) {
      leaderboardData.forEach((user, index) => {
        user.rank = index + 1;
      });
    }
    
    return (
      <Card p="lg">
        <Title order={3} mb="lg" className="fairveri-gradient-text">Bu Haftanın Liderleri</Title>
        
        <Stack gap="sm">
          {leaderboardData.map((user, index) => (
            mounted ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
              <Paper
                p="md"
                radius="md"
                bg={user.isCurrentUser ? 'navy.0' : 'gray.0'}
                withBorder={user.isCurrentUser}
                style={{ borderColor: user.isCurrentUser ? 'var(--mantine-color-navy-3)' : undefined }}
              >
                <Group justify="space-between">
                  <Group gap="md">
                    <Text
                      size="xl"
                      fw={700}
                      c={
                        user.rank === 1 ? 'yellow' :
                        user.rank === 2 ? 'gray' :
                        user.rank === 3 ? 'orange' : 'dimmed'
                      }
                    >
                      {user.rank === 1 ? '🥇' :
                       user.rank === 2 ? '🥈' :
                       user.rank === 3 ? '🥉' : `#${user.rank}`}
                    </Text>
                    <Stack gap={2}>
                      <Group gap="xs">
                        <Text fw={500}>
                          {user.name}
                          {user.isCurrentUser && <Text component="span" c="navy" ml={4}>(Sen)</Text>}
                        </Text>
                      </Group>
                      <Badge
                        color={
                          user.level === 'bronze' ? 'warning' :
                          user.level === 'silver' ? 'gray' :
                          user.level === 'gold' ? 'warning' : 'electricBlue'
                        }
                        variant="light"
                        size="xs"
                      >
                        {user.level === 'bronze' ? '🥉 Bronz' :
                         user.level === 'silver' ? '🥈 Gümüş' :
                         user.level === 'gold' ? '🥇 Altın' : '💎 Platin'}
                      </Badge>
                    </Stack>
                  </Group>
                  <Stack gap={2} align="flex-end">
                    <Text size="lg" fw={700}>{user.points}</Text>
                    <Text size="xs" c="dimmed">puan</Text>
                  </Stack>
                </Group>
              </Paper>
              </motion.div>
            ) : (
              <Paper
                key={index}
                p="md"
                radius="md"
                bg={user.isCurrentUser ? 'navy.0' : 'gray.0'}
                withBorder={user.isCurrentUser}
                style={{ borderColor: user.isCurrentUser ? 'var(--mantine-color-navy-3)' : undefined }}
              >
                <Group justify="space-between">
                  <Group gap="md">
                    <Text
                      size="xl"
                      fw={700}
                      c={
                        user.rank === 1 ? 'yellow' :
                        user.rank === 2 ? 'gray' :
                        user.rank === 3 ? 'orange' : 'dimmed'
                      }
                    >
                      {user.rank === 1 ? '🥇' :
                       user.rank === 2 ? '🥈' :
                       user.rank === 3 ? '🥉' : `#${user.rank}`}
                    </Text>
                    <Stack gap={2}>
                      <Group gap="xs">
                        <Text fw={500}>
                          {user.name}
                          {user.isCurrentUser && <Text component="span" c="navy" ml={4}>(Sen)</Text>}
                        </Text>
                      </Group>
                      <Badge
                        color={
                          user.level === 'bronze' ? 'warning' :
                          user.level === 'silver' ? 'gray' :
                          user.level === 'gold' ? 'warning' : 'electricBlue'
                        }
                        variant="light"
                        size="xs"
                      >
                        {user.level === 'bronze' ? '🥉 Bronz' :
                         user.level === 'silver' ? '🥈 Gümüş' :
                         user.level === 'gold' ? '🥇 Altın' : '💎 Platin'}
                      </Badge>
                    </Stack>
                  </Group>
                  <Stack gap={2} align="flex-end">
                    <Text size="lg" fw={700}>{user.points}</Text>
                    <Text size="xs" c="dimmed">puan</Text>
                  </Stack>
                </Group>
              </Paper>
            )
          ))}
        </Stack>
        
        <Paper p="lg" mt="lg" radius="md" bg="grape.0" withBorder>
          <Title order={4} mb="sm">Haftalık Meydan Okuma</Title>
          <Text size="sm" c="dimmed" mb="md">
            Bu hafta 3 modül tamamlayarak bonus puan kazanın!
          </Text>
          <Group gap="md" align="center">
            <Progress
              value={33}
              size="md"
              color="grape"
              radius="md"
              style={{ flex: 1 }}
            />
            <Text size="sm" fw={500}>1/3</Text>
          </Group>
        </Paper>
      </Card>
    );
  };
  
  const renderCertificatesModal = () => {
    const completedModules = learningData.learningModules.modules.filter(
      m => getModuleProgress(m.id).overall === 100
    );
    
    return (
      <Modal
        opened={showCertificates}
        onClose={() => setShowCertificates(false)}
        title="Sertifikalarım"
        size="md"
        centered
      >
        <Stack gap="md">
          {completedModules.length === 0 ? (
            <Center py="xl">
              <Text ta="center" c="dimmed">
                Henüz sertifika kazanmadınız. Modülleri tamamlayarak sertifika kazanabilirsiniz.
              </Text>
            </Center>
          ) : (
            completedModules.map((module) => (
              <Card key={module.id} p="md" className="fairveri-card-hover">
                <Group justify="space-between">
                  <Group gap="md">
                    <Text size={rem(24)}>{module.icon}</Text>
                    <Stack gap={2}>
                      <Text fw={600}>{module.title} Tamamlama Sertifikası</Text>
                      <Text size="sm" c="dimmed">
                        Tamamlanma: {new Date().toLocaleDateString('tr-TR')}
                      </Text>
                    </Stack>
                  </Group>
                  <Button size="sm" variant="light" leftSection={<IconDownload size={16} />}>
                    İndir
                  </Button>
                </Group>
              </Card>
            ))
          )}
        </Stack>
      </Modal>
    );
  };
  
  if (selectedModule) {
    return (
      <Container size="lg" py="xl">
        <Button
          variant="subtle"
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => setSelectedModule(null)}
          mb="xl"
        >
          Modüllere Dön
        </Button>
        
        <FairLearningWizard
          moduleId={selectedModule}
          onComplete={handleModuleComplete}
        />
      </Container>
    );
  }
  
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stack gap="md" mb="xl" align="center">
          <Title order={1} className="fairveri-gradient-text" ta="center">
            FAIR Öğrenme Merkezi
          </Title>
          <Text size="xl" c="dimmed" ta="center" maw={800} lh={1.6} style={{ margin: '0 auto' }}>
            İnteraktif dersler, uygulamalı projeler ve gamification öğeleriyle FAIR prensiplerini öğrenin. 
            Beginner'dan expert seviyeye kadar 12 modül, 150+ alıştırma ve gerçek vaka çalışmaları ile 
            veri yönetimi becerilerinizi geliştirin.
          </Text>
        </Stack>
        
        {userName && renderProfileSection()}
        
        <Group justify="space-between" align="flex-end">
          {renderModuleTabs()}
          
          {selectedTab === 'modules' && (
            <Button
              variant="light"
              leftSection={<IconTrophy size={16} />}
              onClick={() => setShowCertificates(true)}
            >
              Sertifikalarım
            </Button>
          )}
        </Group>
        
        {mounted ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedTab === 'modules' && renderModulesList()}
              {selectedTab === 'achievements' && renderAchievements()}
              {selectedTab === 'leaderboard' && renderLeaderboard()}
            </motion.div>
          </AnimatePresence>
        ) : (
          <div>
            {selectedTab === 'modules' && renderModulesList()}
            {selectedTab === 'achievements' && renderAchievements()}
            {selectedTab === 'leaderboard' && renderLeaderboard()}
          </div>
        )}
        
        {/* Daily Streak Reminder */}
        {stats.streak > 0 && mounted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'fixed',
              bottom: rem(24),
              right: rem(24),
              zIndex: 1000
            }}
          >
            <Paper
              p="md"
              radius="lg"
              shadow="lg"
              style={{
                background: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                color: 'white'
              }}
            >
              <Group gap="md">
                <Text size={rem(24)}>🔥</Text>
                <Stack gap={2}>
                  <Text fw={700}>{mounted ? stats.streak : 0} Günlük Seri!</Text>
                  <Text size="sm" style={{ opacity: 0.9 }}>Serinizi bozmayın</Text>
                </Stack>
              </Group>
            </Paper>
          </motion.div>
        )}
        
        {/* Modals */}
        {renderOnboardingModal()}
        {renderCertificatesModal()}
        
        {/* Profile Modal */}
        <Modal
          opened={showProfile}
          onClose={() => setShowProfile(false)}
          title="Profil Ayarları"
          size="md"
          centered
        >
          <Stack gap="lg">
            <TextInput
              label="Ad"
              value={userName}
              readOnly
              styles={{
                input: {
                  backgroundColor: 'var(--mantine-color-gray-0)',
                }
              }}
            />
            
            <div>
              <Text size="sm" fw={500} mb="sm">Seviye</Text>
              <Stack gap="xs">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <Paper
                    key={level}
                    p="sm"
                    radius="md"
                    bg={userLevel === level ? 'navy.0' : undefined}
                    withBorder={userLevel === level}
                    style={{ borderColor: userLevel === level ? 'var(--mantine-color-navy-3)' : undefined }}
                  >
                    <Group gap="sm">
                      <Radio
                        checked={userLevel === level}
                        readOnly
                      />
                      <Text>
                        {level === 'beginner' ? 'Başlangıç' :
                         level === 'intermediate' ? 'Orta' : 'İleri'}
                      </Text>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </div>
            
            <Paper p="md" withBorder>
              <Title order={4} mb="md">İstatistikler</Title>
              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Toplam Puan:</Text>
                  <Text fw={500}>{mounted ? stats.totalPoints : 0}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Seviye:</Text>
                  <Text fw={500}>{mounted ? stats.level : 'bronze'}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Tamamlanan Modül:</Text>
                  <Text fw={500}>{mounted ? stats.modulesCompleted : 0}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm" c="dimmed">Toplam Süre:</Text>
                  <Text fw={500}>{mounted ? Math.round(stats.totalTimeSpent / 60) : 0} saat</Text>
                </Grid.Col>
              </Grid>
            </Paper>
            
            <Group justify="space-between" pt="md">
              <Button
                color="red"
                variant="light"
                onClick={() => {
                  if (confirm('Tüm ilerlemeniz silinecek. Emin misiniz?')) {
                    resetProgress();
                    setShowProfile(false);
                  }
                }}
              >
                İlerlemeyi Sıfırla
              </Button>
              <Button variant="outline" onClick={() => setShowProfile(false)}>
                Kapat
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}