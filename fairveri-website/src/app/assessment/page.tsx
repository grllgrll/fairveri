'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container, Title, Text, Grid, Group, Stack, Box, Card, Button, Badge, Progress, ActionIcon, Alert, Divider } from '@mantine/core';
import { useAssessmentStore } from '@/lib/assessment-store';
import { FairAssessmentTool } from '@/components/features/fair-assessment-tool';
import { AssessmentResults } from '@/components/features/assessment-results';
import { useTranslation } from '@/contexts/language-context';
import { 
  PlayCircle, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  FileText,
  Users,
  Target,
  Lightbulb
} from 'lucide-react';

// Import assessment data
import assessmentData from '@/data/assessment-questions.json';

const WelcomeSection: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const { getProgress, answers } = useAssessmentStore();
  const { t } = useTranslation();
  const progress = getProgress();
  const hasStarted = answers.length > 0;

  // Get translated categories
  const getTranslatedCategories = () => {
    return assessmentData.assessment.categories.map(category => ({
      ...category,
      title: t(`assessment.categories.${category.id}.title`),
      description: t(`assessment.categories.${category.id}.description`)
    }));
  };
  
  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Hero Section */}
        <Stack align="center" gap="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge
              size="lg"
              variant="light"
              color="navy"
              leftSection={<BarChart3 size={16} />}
            >
              İnteraktif Değerlendirme Aracı
            </Badge>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Title
              order={1}
              size="3rem"
              fw={700}
              ta="center"
              className="fairveri-gradient-text"
            >
              FAIR Prensipleri Değerlendirmesi
            </Title>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Text
              size="xl"
              c="dimmed"
              ta="center"
              maw={600}
              lh={1.6}
            >
              Veri setinizin FAIR prensiplerine uyumluluğunu kapsamlı değerlendirme aracımızla değerlendirin. 
              Veri yönetimi uygulamalarınızı geliştirmek için kişiselleştirilmiş öneriler ve uygulanabilir içgörüler edinin.
            </Text>
          </motion.div>
        </Stack>

        {/* Progress Card (if assessment started) */}
        {hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              shadow="sm" 
              p="lg"
              style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #e6f7ff 100%)' }}
            >
              <Group justify="space-between" mb="md">
                <Group gap="md">
                  <ActionIcon size="lg" variant="light" color="navy">
                    <Clock size={20} />
                  </ActionIcon>
                  <div>
                    <Title order={4}>Değerlendirme Devam Ediyor</Title>
                    <Text size="sm" c="dimmed">
                      {progress.answeredQuestions} / {progress.totalQuestions} soru tamamlandı
                    </Text>
                  </div>
                </Group>
                <Badge variant="light" color="navy" size="lg">
                  %{Math.round(progress.progressPercentage)} Tamamlandı
                </Badge>
              </Group>
              <Progress value={progress.progressPercentage} size="md" mb="md" />
              <Button onClick={onStart} leftSection={<PlayCircle size={16} />}>
                Değerlendirmeye Devam Et
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Assessment Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card className="fairveri-card-hover" p="lg" ta="center" h={200}>
                <Stack align="center" justify="center" h="100%">
                  <ActionIcon size={48} variant="light" color="navy">
                    <FileText size={24} />
                  </ActionIcon>
                  <div>
                    <Title order={4}>32 Soru</Title>
                    <Text size="sm" c="dimmed">
                      Tüm FAIR prensiplerinin kapsamlı değerlendirilmesi
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card className="fairveri-card-hover" p="lg" ta="center" h={200}>
                <Stack align="center" justify="center" h="100%">
                  <ActionIcon size={48} variant="light" color="success">
                    <Clock size={24} />
                  </ActionIcon>
                  <div>
                    <Title order={4}>15-20 Dakika</Title>
                    <Text size="sm" c="dimmed">
                      Kapsamlı değerlendirme için tipik tamamlanma süresi
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card className="fairveri-card-hover" p="lg" ta="center" h={200}>
                <Stack align="center" justify="center" h="100%">
                  <ActionIcon size={48} variant="light" color="electricBlue">
                    <Target size={24} />
                  </ActionIcon>
                  <div>
                    <Title order={4}>Kişiselleştirilmiş Rapor</Title>
                    <Text size="sm" c="dimmed">
                      Uygulanabilir önerilerle detaylı sonuçlar
                    </Text>
                  </div>
                </Stack>
              </Card>
            </Grid.Col>
          </Grid>
        </motion.div>

        {/* FAIR Categories Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Stack align="center" gap="lg">
            <Stack align="center" gap="xs">
              <Title order={2} ta="center">
                Neleri Değerlendireceğiz
              </Title>
              <Text c="dimmed" ta="center">
                Değerlendirme, her kategoride detaylı sorularla tüm dört FAIR prensibini kapsar
              </Text>
            </Stack>
            
            <Grid>
              {getTranslatedCategories().map((category: any, index: number) => (
                <Grid.Col key={category.id} span={{ base: 12, sm: 6, lg: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="fairveri-card-hover" p="md" h={180}>
                      <Stack justify="space-between" h="100%">
                        <Group gap="sm">
                          <Text size="xl">{category.icon}</Text>
                          <div>
                            <Title order={5}>{category.title}</Title>
                            <Badge variant="outline" size="xs">
                              {category.questions.length} soru
                            </Badge>
                          </div>
                        </Group>
                        <Text size="sm" c="dimmed" lineClamp={3}>
                          {category.description}
                        </Text>
                      </Stack>
                    </Card>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Stack align="center" gap="lg">
            <Title order={2} ta="center">
              Değerlendirme Özellikleri
            </Title>
            
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card p="lg" h={280}>
                  <Group gap="md" mb="md">
                    <ActionIcon size="lg" variant="light" color="navy">
                      <Lightbulb size={20} />
                    </ActionIcon>
                    <Title order={4}>Eğitici İçerik</Title>
                  </Group>
                  <Stack gap="sm">
                    <Group gap="sm">
                      <CheckCircle size={16} color="var(--mantine-color-success-6)" />
                      <Text size="sm">Her soru için detaylı açıklamalar</Text>
                    </Group>
                    <Group gap="sm">
                      <CheckCircle size={16} color="var(--mantine-color-success-6)" />
                      <Text size="sm">İpuçları ve en iyi uygulamalar</Text>
                    </Group>
                    <Group gap="sm">
                      <CheckCircle size={16} color="var(--mantine-color-success-6)" />
                      <Text size="sm">Gerçek dünya örnekleri ve vakalar</Text>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Card p="lg" h={280}>
                  <Group gap="md" mb="md">
                    <ActionIcon size="lg" variant="light" color="success">
                      <Users size={20} />
                    </ActionIcon>
                    <Title order={4}>Kullanıcı Dostu Deneyim</Title>
                  </Group>
                  <Stack gap="sm">
                    <Group gap="sm">
                      <CheckCircle size={16} color="var(--mantine-color-success-6)" />
                      <Text size="sm">İlerleme takibi ve kaydetme özelliği</Text>
                    </Group>
                    <Group gap="sm">
                      <CheckCircle size={16} color="var(--mantine-color-success-6)" />
                      <Text size="sm">Sonuçları birden fazla formatta dışa aktarma</Text>
                    </Group>
                    <Group gap="sm">
                      <CheckCircle size={16} color="var(--mantine-color-success-6)" />
                      <Text size="sm">Tüm cihazlar için duyarlı tasarım</Text>
                    </Group>
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <Card
            p="xl"
            ta="center"
            style={{ 
              background: 'linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #3b82f6 100%)',
              color: 'white'
            }}
          >
            <Stack align="center" gap="md">
              <Title order={3} c="white">
                Verilerinizi Değerlendirmeye Hazır mısınız?
              </Title>
              <Text c="rgba(255, 255, 255, 0.8)" maw={500}>
                FAIR değerlendirme yolculuğunuza başlayın ve verilerinizi daha değerli ve yeniden kullanılabilir hale getirmeyi keşfedin.
              </Text>
              <Button 
                onClick={onStart} 
                size="lg"
                variant="white"
                color="navy"
                leftSection={<PlayCircle size={20} />}
              >
                {hasStarted ? 'Değerlendirmeye Devam Et' : 'Değerlendirmeyi Başlat'}
              </Button>
            </Stack>
          </Card>
        </motion.div>
      </Stack>
    </Container>
  );
};

export default function AssessmentPage() {
  const { isCompleted } = useAssessmentStore();
  const [showAssessment, setShowAssessment] = useState(false);

  // Check if we should show assessment or results on load
  useEffect(() => {
    const { answers } = useAssessmentStore.getState();
    if (answers.length > 0 && !isCompleted) {
      setShowAssessment(true);
    }
  }, [isCompleted]);

  const handleStartAssessment = () => {
    setShowAssessment(true);
  };

  return (
    <Box className="fairveri-hero-gradient" mih="100vh">
      <AnimatePresence mode="wait">
        {isCompleted ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <AssessmentResults />
          </motion.div>
        ) : showAssessment ? (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FairAssessmentTool />
          </motion.div>
        ) : (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <WelcomeSection onStart={handleStartAssessment} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}