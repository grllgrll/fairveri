'use client';

import { useState } from 'react';
import { 
  Card, 
  Text, 
  Group, 
  Stack, 
  Button, 
  Progress, 
  Badge, 
  Box, 
  ThemeIcon,
  Stepper,
  Radio,
  Textarea,
  Title,
  Alert,
  ActionIcon,
  Tooltip
} from '@mantine/core';
import { 
  IconCheck, 
  IconX, 
  IconInfoCircle, 
  IconTarget, 
  IconChartBar,
  IconDownload,
  IconShare,
  IconBookmark
} from '@tabler/icons-react';

interface AssessmentQuestion {
  id: string;
  category: 'findable' | 'accessible' | 'interoperable' | 'reusable';
  question: string;
  description: string;
  options: {
    value: number;
    label: string;
    description: string;
  }[];
  weight: number;
  helpText?: string;
}

interface AssessmentResult {
  overall: number;
  findable: number;
  accessible: number;
  interoperable: number;
  reusable: number;
  recommendations: string[];
  strengths: string[];
  improvements: string[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  // Findable Questions
  {
    id: 'f1',
    category: 'findable',
    question: 'Verileriniz kalıcı bir tanımlayıcıya (DOI, Handle, vb.) sahip mi?',
    description: 'Kalıcı tanımlayıcılar verilerinizin uzun vadede bulunabilir kalmasını sağlar.',
    options: [
      { value: 100, label: 'Evet, DOI veya Handle gibi kalıcı tanımlayıcım var', description: 'Mükemmel! Kalıcı tanımlayıcılar FAIR\'in temel gereksinimlerinden biridir.' },
      { value: 50, label: 'URL\'im var ama kalıcı değil', description: 'URL\'ler değişebilir veya kırılabilir. Kalıcı tanımlayıcı almanız önerilir.' },
      { value: 0, label: 'Hayır, herhangi bir tanımlayıcım yok', description: 'Verilerinizi bulunabilir hale getirmek için kalıcı tanımlayıcı gereklidir.' }
    ],
    weight: 1.5,
    helpText: 'DataCite, ORCID veya kurumsal depolardan DOI alabilirsiniz.'
  },
  {
    id: 'f2',
    category: 'findable',
    question: 'Verileriniz zengin metadata ile tanımlanmış mı?',
    description: 'Kapsamlı metadata, verilerinizin arama motorlarında bulunmasını kolaylaştırır.',
    options: [
      { value: 100, label: 'Evet, kapsamlı metadata sağladım (başlık, yazar, konu, tarih, format vb.)', description: 'Harika! Zengin metadata FAIR\'in temel taşlarından biridir.' },
      { value: 75, label: 'Temel metadata var ama eksik alanlar mevcut', description: 'İyi başlangıç. Eksik alanları tamamlamak bulunabilirliği artıracaktır.' },
      { value: 25, label: 'Çok az metadata sağladım', description: 'Daha fazla metadata eklemek verilerinizin keşfedilebilirliğini önemli ölçüde artıracaktır.' },
      { value: 0, label: 'Metadata sağlamadım', description: 'Metadata olmadan verilerinizi bulmak neredeyse imkansızdır.' }
    ],
    weight: 1.0
  },
  // Accessible Questions
  {
    id: 'a1',
    category: 'accessible',
    question: 'Verilerinize standart protokollerle (HTTP/HTTPS, FTP vb.) erişilebiliyor mu?',
    description: 'Standart protokoller evrensel erişimi sağlar.',
    options: [
      { value: 100, label: 'Evet, HTTP/HTTPS ile erişilebilir', description: 'Mükemmel! Standart protokoller FAIR erişimin temelidir.' },
      { value: 50, label: 'Özel yazılım gerekiyor', description: 'Bu erişilebilirliği sınırlar. Standart protokoller tercih edilir.' },
      { value: 0, label: 'Erişim mümkün değil', description: 'Veriler erişilebilir olmalıdır, en azından metadata seviyesinde.' }
    ],
    weight: 1.2
  },
  {
    id: 'a2',
    category: 'accessible',
    question: 'Verilerinizin erişim koşulları açıkça belirtilmiş mi?',
    description: 'Lisans ve kullanım koşulları belirsizliği giderir.',
    options: [
      { value: 100, label: 'Evet, açık lisans (CC BY, MIT vb.) kullanıyorum', description: 'Harika! Açık lisanslar yeniden kullanımı kolaylaştırır.' },
      { value: 75, label: 'Lisans belirtilmiş ama kısİtlı', description: 'İyi. Kısıtlı lisanslar da FAIR olabilir.' },
      { value: 25, label: 'Belirsiz ifadeler kullandım', description: 'Belirsizlik kullanımı zorlaştırır. Net lisans belirtmeniz önerilir.' },
      { value: 0, label: 'Lisans bilgisi yok', description: 'Lisans bilgisi olmadan veriler kullanılamaz.' }
    ],
    weight: 1.0
  },
  // Interoperable Questions  
  {
    id: 'i1',
    category: 'interoperable',
    question: 'Verileriniz standart formatlarda (CSV, JSON, XML vb.) mı?',
    description: 'Standart formatlar farklı sistemlerle uyumluluğu sağlar.',
    options: [
      { value: 100, label: 'Evet, yaygın standart formatlar kullanıyorum', description: 'Mükemmel! Standart formatlar birlikte çalışabilirliğin temelidir.' },
      { value: 75, label: 'Çoğunlukla standart, bazı özel formatlar var', description: 'İyi. Özel formatları açıklamanız önerilir.' },
      { value: 25, label: 'Çoğunlukla özel formatlar', description: 'Bu birlikte çalışabilirliği zorlaştırır.' },
      { value: 0, label: 'Sadece özel formatlar', description: 'Standart formatlara dönüştürmeniz gerekli.' }
    ],
    weight: 1.0
  },
  {
    id: 'i2',
    category: 'interoperable',
    question: 'Kontrollü kelime dağarcığı veya standart terminoloji kullanıyor musunuz?',
    description: 'Standart terminoloji veriler arası bağlantıları mümkün kılar.',
    options: [
      { value: 100, label: 'Evet, alan-specific standart terminoloji kullanıyorum', description: 'Harika! Bu verilerinizin diğer çalışmalarla entegrasyonunu kolaylaştırır.' },
      { value: 50, label: 'Kısmen standart terminoloji kullanıyorum', description: 'İyi başlangıç. Daha tutarlı terminoloji kullanmanız önerilir.' },
      { value: 0, label: 'Standart terminoloji kullanmıyorum', description: 'Standart terminoloji birlikte çalışabilirlik için kritiktir.' }
    ],
    weight: 0.8
  },
  // Reusable Questions
  {
    id: 'r1',
    category: 'reusable',
    question: 'Verilerinizin nasıl üretildiği detaylı olarak dokümante edilmiş mi?',
    description: 'Metodoloji bilgisi yeniden kullanım için esastır.',
    options: [
      { value: 100, label: 'Evet, detaylı metodoloji ve veri toplama süreci dokümante edilmiş', description: 'Mükemmel! Bu verilerinizin güvenle yeniden kullanılmasını sağlar.' },
      { value: 75, label: 'Temel metodoloji bilgisi mevcut', description: 'İyi. Daha detaylı dokümantasyon yeniden kullanımı artıracaktır.' },
      { value: 25, label: 'Çok az dokümantasyon var', description: 'Daha fazla dokümantasyon gerekli.' },
      { value: 0, label: 'Metodoloji dokümante edilmemiş', description: 'Dokümantasyon olmadan güvenli yeniden kullanım mümkün değildir.' }
    ],
    weight: 1.2
  },
  {
    id: 'r2',
    category: 'reusable',
    question: 'Verilerinizde kullanılan kısaltmalar ve kodlar açıklanmış mı?',
    description: 'Kod kitapları ve kısaltma açıklamaları verilerinizi anlaşılır hale getirir.',
    options: [
      { value: 100, label: 'Evet, tüm kısaltmalar ve kodlar detaylıca açıklanmış', description: 'Harika! Bu verilerinizi kullanmayı kolaylaştırır.' },
      { value: 50, label: 'Bazı açıklamalar mevcut ama eksik', description: 'Tüm kısaltmaları açıklamak önemlidir.' },
      { value: 0, label: 'Açıklama yok', description: 'Kısaltmalar ve kodlar mutlaka açıklanmalıdır.' }
    ],
    weight: 0.8
  }
];

export function EnhancedFAIRAssessment() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const categorizedQuestions = {
    findable: assessmentQuestions.filter(q => q.category === 'findable'),
    accessible: assessmentQuestions.filter(q => q.category === 'accessible'),
    interoperable: assessmentQuestions.filter(q => q.category === 'interoperable'),
    reusable: assessmentQuestions.filter(q => q.category === 'reusable')
  };

  const calculateResults = (): AssessmentResult => {
    const categories = ['findable', 'accessible', 'interoperable', 'reusable'] as const;
    const scores: Record<string, number> = {};
    
    categories.forEach(category => {
      const categoryQuestions = categorizedQuestions[category];
      const totalWeight = categoryQuestions.reduce((sum, q) => sum + q.weight, 0);
      const weightedScore = categoryQuestions.reduce((sum, q) => {
        return sum + ((answers[q.id] || 0) * q.weight);
      }, 0);
      scores[category] = Math.round(weightedScore / totalWeight);
    });

    const overall = Math.round((scores.findable + scores.accessible + scores.interoperable + scores.reusable) / 4);

    // Generate recommendations
    const recommendations: string[] = [];
    const strengths: string[] = [];
    const improvements: string[] = [];

    if (scores.findable < 70) {
      recommendations.push('Kalıcı tanımlayıcı (DOI) alın ve metadata kalitesini artırın');
      improvements.push('Bulunabilirlik');
    } else {
      strengths.push('Verileriniz iyi düzeyde bulunabilir');
    }

    if (scores.accessible < 70) {
      recommendations.push('Standart protokollerle erişim sağlayın ve lisans bilgilerini netleştirin');
      improvements.push('Erişilebilirlik');
    } else {
      strengths.push('Verileriniz uygun şekilde erişilebilir');
    }

    if (scores.interoperable < 70) {
      recommendations.push('Standart formatları ve kontrollü kelime dağarcığını kullanın');
      improvements.push('Birlikte çalışabilirlik');
    } else {
      strengths.push('Verileriniz iyi düzeyde birlikte çalışabilir');
    }

    if (scores.reusable < 70) {
      recommendations.push('Metodoloji dokümantasyonunu genişletin ve kod kitapları ekleyin');
      improvements.push('Yeniden kullanılabilirlik');
    } else {
      strengths.push('Verileriniz yeniden kullanıma uygun');
    }

    return {
      overall,
      findable: scores.findable,
      accessible: scores.accessible,
      interoperable: scores.interoperable,
      reusable: scores.reusable,
      recommendations,
      strengths,
      improvements
    };
  };

  const handleComplete = () => {
    const results = calculateResults();
    setResult(results);
    setShowResult(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'yellow';
    return 'red';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Mükemmel';
    if (score >= 60) return 'İyi';
    if (score >= 40) return 'Orta';
    return 'Geliştirilmeli';
  };

  if (showResult && result) {
    return (
      <Stack gap="lg">
        {/* Overall Score */}
        <Card shadow="lg" padding="xl" radius="lg" withBorder>
          <Group justify="space-between" mb="lg">
            <div>
              <Title order={2}>FAIR Değerlendirme Sonuçları</Title>
              <Text c="dimmed">Verilerinizin FAIR uyumluluğu analiz edildi</Text>
            </div>
            <Group gap="sm">
              <ActionIcon variant="light" color="blue" size="lg">
                <IconDownload size={20} />
              </ActionIcon>
              <ActionIcon variant="light" color="green" size="lg">
                <IconShare size={20} />
              </ActionIcon>
            </Group>
          </Group>

          <Box style={{ textAlign: 'center' }} mb="xl">
            <Text size="4rem" fw={700} c={getScoreColor(result.overall)}>
              {result.overall}
            </Text>
            <Text size="xl" fw={500} c={getScoreColor(result.overall)}>
              {getScoreLabel(result.overall)}
            </Text>
            <Text c="dimmed">Genel FAIR Skoru (%)</Text>
          </Box>

          <Progress
            value={result.overall}
            color={getScoreColor(result.overall)}
            size="xl"
            radius="xl"
            mb="xl"
          />
        </Card>

        {/* Category Scores */}
        <Card shadow="sm" padding="lg" radius="lg" withBorder>
          <Text fw={600} size="lg" mb="md">Kategori Bazlı Sonuçlar</Text>
          <Stack gap="md">
            {[
              { key: 'findable', label: 'Bulunabilirlik (Findable)', icon: '🔍', score: result.findable },
              { key: 'accessible', label: 'Erişilebilirlik (Accessible)', icon: '🔓', score: result.accessible },
              { key: 'interoperable', label: 'Birlikte Çalışabilirlik (Interoperable)', icon: '🔗', score: result.interoperable },
              { key: 'reusable', label: 'Yeniden Kullanılabilirlik (Reusable)', icon: '♻️', score: result.reusable }
            ].map(category => (
              <Box key={category.key} p="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)', borderRadius: '8px' }}>
                <Group justify="space-between" mb="xs">
                  <Group gap="sm">
                    <Text size="lg">{category.icon}</Text>
                    <Text fw={500}>{category.label}</Text>
                  </Group>
                  <Badge color={getScoreColor(category.score)} size="lg">
                    %{category.score}
                  </Badge>
                </Group>
                <Progress value={category.score} color={getScoreColor(category.score)} size="sm" radius="xl" />
              </Box>
            ))}
          </Stack>
        </Card>

        {/* Recommendations */}
        <Group gap="lg" align="flex-start">
          {/* Strengths */}
          {result.strengths.length > 0 && (
            <Card shadow="sm" padding="lg" radius="lg" withBorder style={{ flex: 1 }}>
              <Group gap="sm" mb="md">
                <ThemeIcon color="green" variant="light">
                  <IconCheck size={18} />
                </ThemeIcon>
                <Text fw={600} c="green">Güçlü Yönler</Text>
              </Group>
              <Stack gap="xs">
                {result.strengths.map((strength, index) => (
                  <Text key={index} size="sm">• {strength}</Text>
                ))}
              </Stack>
            </Card>
          )}

          {/* Improvements */}
          {result.improvements.length > 0 && (
            <Card shadow="sm" padding="lg" radius="lg" withBorder style={{ flex: 1 }}>
              <Group gap="sm" mb="md">
                <ThemeIcon color="yellow" variant="light">
                  <IconTarget size={18} />
                </ThemeIcon>
                <Text fw={600} c="orange">Geliştirilmesi Gerekenler</Text>
              </Group>
              <Stack gap="xs">
                {result.improvements.map((improvement, index) => (
                  <Text key={index} size="sm">• {improvement}</Text>
                ))}
              </Stack>
            </Card>
          )}
        </Group>

        {/* Action Recommendations */}
        <Card shadow="sm" padding="lg" radius="lg" withBorder>
          <Group gap="sm" mb="md">
            <ThemeIcon color="blue" variant="light">
              <IconInfoCircle size={18} />
            </ThemeIcon>
            <Text fw={600}>Önerilen Aksiyonlar</Text>
          </Group>
          <Stack gap="xs">
            {result.recommendations.map((recommendation, index) => (
              <Alert key={index} icon={<IconInfoCircle size={16} />} variant="light" color="blue">
                {recommendation}
              </Alert>
            ))}
          </Stack>
        </Card>

        {/* Action Buttons */}
        <Group gap="md" justify="center">
          <Button variant="outline" onClick={() => setShowResult(false)}>
            Değerlendirmeyi Tekrarla
          </Button>
          <Button variant="filled">
            Detaylı Rehber İndir
          </Button>
          <Button variant="light" leftSection={<IconBookmark size={16} />}>
            Sonuçları Kaydet
          </Button>
        </Group>
      </Stack>
    );
  }

  // Assessment Questions UI
  const currentCategory = Math.floor(currentStep / 2);
  const categoryNames = ['Bulunabilirlik', 'Erişilebilirlik', 'Birlikte Çalışabilirlik', 'Yeniden Kullanılabilirlik'];
  const totalSteps = 4; // One step per category
  const currentQuestion = assessmentQuestions[currentStep];

  return (
    <Stack gap="lg">
      {/* Progress Header */}
      <Card shadow="sm" padding="lg" radius="lg" withBorder>
        <Group justify="space-between" mb="md">
          <div>
            <Title order={2}>FAIR Veri Değerlendirmesi</Title>
            <Text c="dimmed">Verilerinizin FAIR uyumluluğunu değerlendirin</Text>
          </div>
          <Badge size="lg" variant="light">
            {currentStep + 1}/{assessmentQuestions.length}
          </Badge>
        </Group>

        <Stepper active={currentCategory} size="sm" mb="lg">
          {categoryNames.map((name, index) => (
            <Stepper.Step key={index} label={name} />
          ))}
        </Stepper>

        <Progress 
          value={(currentStep + 1) / assessmentQuestions.length * 100} 
          size="lg" 
          radius="xl" 
        />
      </Card>

      {/* Current Question */}
      {currentQuestion && (
        <Card shadow="sm" padding="xl" radius="lg" withBorder>
          <Stack gap="lg">
            <div>
              <Group gap="sm" mb="md">
                <Badge variant="light" color="blue">
                  {currentQuestion.category.toUpperCase()}
                </Badge>
                {currentQuestion.helpText && (
                  <Tooltip label={currentQuestion.helpText} multiline width={300}>
                    <ActionIcon variant="subtle" size="sm">
                      <IconInfoCircle size={16} />
                    </ActionIcon>
                  </Tooltip>
                )}
              </Group>
              
              <Title order={3} mb="xs">{currentQuestion.question}</Title>
              <Text c="dimmed" mb="lg">{currentQuestion.description}</Text>
            </div>

            <Radio.Group
              value={answers[currentQuestion.id]?.toString() || ''}
              onChange={(value) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: parseInt(value) }))}
            >
              <Stack gap="md">
                {currentQuestion.options.map((option) => (
                  <Card 
                    key={option.value} 
                    padding="md" 
                    radius="md" 
                    withBorder
                    style={{ cursor: 'pointer' }}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: option.value }))}
                  >
                    <Radio
                      value={option.value.toString()}
                      label={
                        <div>
                          <Text fw={500}>{option.label}</Text>
                          <Text size="sm" c="dimmed">{option.description}</Text>
                        </div>
                      }
                    />
                  </Card>
                ))}
              </Stack>
            </Radio.Group>

            <Textarea
              label="Ek Notlar (İsteğe bağlı)"
              placeholder="Bu soruyla ilgili ek bilgiler..."
              value={notes[currentQuestion.id] || ''}
              onChange={(e) => setNotes(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
              autosize
              minRows={2}
            />
          </Stack>
        </Card>
      )}

      {/* Navigation */}
      <Group justify="space-between">
        <Button 
          variant="outline" 
          disabled={currentStep === 0}
          onClick={() => setCurrentStep(prev => prev - 1)}
        >
          Önceki
        </Button>
        
        {currentStep === assessmentQuestions.length - 1 ? (
          <Button 
            onClick={handleComplete}
            disabled={!answers[currentQuestion?.id || '']}
            leftSection={<IconChartBar size={16} />}
          >
            Değerlendirmeyi Tamamla
          </Button>
        ) : (
          <Button 
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!answers[currentQuestion?.id || '']}
          >
            Sonraki
          </Button>
        )}
      </Group>
    </Stack>
  );
}