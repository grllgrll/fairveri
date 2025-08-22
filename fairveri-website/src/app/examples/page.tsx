'use client';

import { Container, Title, Text, Stack, Grid, Tabs, Badge, Card as MantineCard, Button, Group, Progress, List, RingProgress, Modal, Code } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconExternalLink, IconCheck, IconDownload, IconEye } from '@tabler/icons-react';
import dynamic from 'next/dynamic';

interface Example {
  id: string;
  title: string;
  description: string;
  scenario: string;
  category: string;
  discipline: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dataset: {
    title: string;
    description: string;
    sampleSize: string;
    timeframe: string;
  };
  fairCompliance: {
    findable: { score: number; items: string[] };
    accessible: { score: number; items: string[] };
    interoperable: { score: number; items: string[] };
    reusable: { score: number; items: string[] };
  };
  downloads?: {
    name: string;
    url: string;
    size: string;
    format: string;
    description: string;
  }[];
}

const examplesData: Example[] = [
  // Survey Data Examples
  {
    id: 'social-survey',
    title: 'Sosyal Medya Kullanım Araştırması',
    description: '5000 katılımcılı sosyal medya kullanım alışkanlıklarını araştıran kapsamlı anket verisi',
    scenario: 'Üniversite öğrencilerinin sosyal medya platformlarını kullanım şekilleri ve etkileri',
    category: 'survey-data',
    discipline: 'Sosyal Bilimler',
    difficulty: 'beginner',
    dataset: {
      title: 'Sosyal Medya Kullanım Alışkanlıkları Araştırması 2024',
      description: 'Türk üniversite öğrencilerinin sosyal medya platformlarını kullanım şekilleri ve etkileri',
      sampleSize: '5,247 katılımcı',
      timeframe: 'Ocak-Mart 2024'
    },
    fairCompliance: {
      findable: {
        score: 92,
        items: ['DOI tanımlayıcısı mevcut', 'Zengin metadata', 'Anahtar kelimeler tanımlanmış']
      },
      accessible: {
        score: 88,
        items: ['HTTP/HTTPS protokolü', 'Açık erişim', 'Standart formatlar']
      },
      interoperable: {
        score: 85,
        items: ['JSON-LD metadata', 'Schema.org standartları', 'Controlled vocabularies']
      },
      reusable: {
        score: 90,
        items: ['Creative Commons lisansı', 'Kullanım kılavuzu', 'Provenance bilgisi']
      }
    },
    downloads: [
      {
        name: 'Ana Veri Seti',
        url: '/datasets/survey-data/social-media/social_media_survey_data.csv',
        size: '15KB',
        format: 'CSV',
        description: '5,247 katılımcının anket yanıtları'
      },
      {
        name: 'Metadata',
        url: '/datasets/survey-data/social-media/survey_metadata.json',
        size: '8KB',
        format: 'JSON',
        description: 'Schema.org uyumlu metadata'
      },
      {
        name: 'Metodoloji',
        url: '/datasets/survey-data/social-media/methodology.md',
        size: '12KB',
        format: 'Markdown',
        description: 'Araştırma metodolojisi'
      },
      {
        name: 'Dokümantasyon',
        url: '/datasets/survey-data/social-media/README.md',
        size: '3KB',
        format: 'Markdown',
        description: 'Kullanım kılavuzu'
      }
    ]
  },
  {
    id: 'education-survey',
    title: 'Eğitim Sistemi Memnuniyet Anketi',
    description: 'Öğretmen ve velilerin eğitim sisteminden memnuniyetini ölçen geniş kapsamlı araştırma',
    scenario: 'Ulusal düzeyde eğitim kalitesi algısı ve iyileştirme önerilerini toplayan anket çalışması',
    category: 'survey-data',
    discipline: 'Eğitim Bilimleri',
    difficulty: 'intermediate',
    dataset: {
      title: 'Ulusal Eğitim Memnuniyet Araştırması 2024',
      description: 'Öğretmen, veli ve öğrenci perspektifinden eğitim sistemi değerlendirmesi',
      sampleSize: '12,500 katılımcı',
      timeframe: 'Şubat-Mayıs 2024'
    },
    fairCompliance: {
      findable: {
        score: 89,
        items: ['DOI ve ORCID bağlantıları', 'Detaylı metadata', 'Kategorizasyon sistemi']
      },
      accessible: {
        score: 91,
        items: ['Açık erişim deposu', 'CSV ve JSON formatları', 'API erişimi']
      },
      interoperable: {
        score: 87,
        items: ['Dublin Core metadata', 'Standard kodlama', 'Veri sözlüğü']
      },
      reusable: {
        score: 93,
        items: ['CC BY 4.0 lisansı', 'Metodoloji dokümantasyonu', 'Kullanım örnekleri']
      }
    },
    downloads: [
      {
        name: 'Ana Veri Seti',
        url: '/datasets/survey-data/education/education_survey_data.csv',
        size: '18KB',
        format: 'CSV',
        description: '12,500 katılımcının anket yanıtları'
      },
      {
        name: 'Metadata',
        url: '/datasets/survey-data/education/education_metadata.json',
        size: '10KB',
        format: 'JSON',
        description: 'Schema.org uyumlu metadata'
      },
      {
        name: 'Metodoloji',
        url: '/datasets/survey-data/education/methodology.md',
        size: '15KB',
        format: 'Markdown',
        description: 'Araştırma metodolojisi'
      },
      {
        name: 'Dokümantasyon',
        url: '/datasets/survey-data/education/README.md',
        size: '5KB',
        format: 'Markdown',
        description: 'Kullanım kılavuzu'
      }
    ]
  },

  // Lab Data Examples
  {
    id: 'chemistry-lab',
    title: 'Organik Sentez Karakterizasyon Verileri',
    description: 'Yeni organik bileşiklerin sentezi ve karakterizasyonu için toplanan laboratuvar verileri',
    scenario: 'NMR, IR, MS spektroskopi verileri ve kristalografik analizler',
    category: 'lab-data',
    discipline: 'Kimya',
    difficulty: 'intermediate',
    dataset: {
      title: 'Organik Sentez Karakterizasyon Verileri',
      description: 'NMR, IR, MS spektroskopi verileri ve kristalografik analizler',
      sampleSize: '127 bileşik',
      timeframe: '2023-2024'
    },
    fairCompliance: {
      findable: {
        score: 89,
        items: ['DOI ve ORCID bağlantıları', 'ChemSpider kayıtları', 'Zengin metadata']
      },
      accessible: {
        score: 87,
        items: ['Open access repository', 'Standard file formats', 'API erişimi']
      },
      interoperable: {
        score: 94,
        items: ['CIF format', 'InChI identifiers', 'Standard ontologies']
      },
      reusable: {
        score: 86,
        items: ['CC BY lisansı', 'Experimental protocols', 'Quality assessments']
      }
    },
    downloads: [
      {
        name: 'Bileşik Verileri',
        url: '/datasets/lab-data/chemistry/compound_data.csv',
        size: '25KB',
        format: 'CSV',
        description: '127 bileşik karakterizasyon verisi'
      },
      {
        name: 'Metadata',
        url: '/datasets/lab-data/chemistry/chemistry_metadata.json',
        size: '12KB',
        format: 'JSON',
        description: 'Schema.org uyumlu metadata'
      }
    ]
  },
  {
    id: 'genomic-wgs',
    title: 'Tüm Genom Dizileme (WGS) Verisi',
    description: '1000 bireyin tüm genom dizileme verilerinin GA4GH standartlarına uygun FAIR prensiplere göre paylaşımı',
    scenario: 'Popülasyon genomik çalışması için toplanan WGS verileri ve varyant analizleri',
    category: 'lab-data',
    discipline: 'Genomik',
    difficulty: 'advanced',
    dataset: {
      title: 'Türk Popülasyonu Genom Projesi',
      description: 'Türk popülasyonundaki genetik çeşitliliği haritalayan kapsamlı genom dizileme projesi',
      sampleSize: '1,000 birey',
      timeframe: '2023-2025'
    },
    fairCompliance: {
      findable: {
        score: 95,
        items: ['DOI ve BioProject ID', 'EGA/dbGaP kayıtları', 'Beacon Network entegrasyonu']
      },
      accessible: {
        score: 85,
        items: ['Kontrollü erişim (DAC)', 'htsget protokolü', 'Güvenli bulut altyapısı']
      },
      interoperable: {
        score: 90,
        items: ['GA4GH standartları', 'VCF/CRAM formatları', 'Phenopackets v2']
      },
      reusable: {
        score: 92,
        items: ['DUO ontolojisi', 'MINSEQE metadata', 'Genomic Data Commons uyumlu']
      }
    },
    downloads: [
      {
        name: 'Özet İstatistikler',
        url: '/datasets/lab-data/genomics/genomics_summary.csv',
        size: '12KB',
        format: 'CSV',
        description: '1,000 bireyin genom dizileme özet verileri'
      },
      {
        name: 'GA4GH Metadata',
        url: '/datasets/lab-data/genomics/genomics_metadata.json',
        size: '15KB',
        format: 'JSON',
        description: 'GA4GH standartlarına uygun metadata'
      },
      {
        name: 'Veri Erişim Kılavuzu',
        url: '/datasets/lab-data/genomics/data_access_guide.md',
        size: '20KB',
        format: 'Markdown',
        description: 'Kontrollü erişim prosedürleri'
      }
    ]
  },

  // Software Project Examples
  {
    id: 'open-source-bioinformatics',
    title: 'Açık Kaynak Biyoinformatik Araç Seti',
    description: 'Genomik veri analizi için geliştirilmiş Python tabanlı açık kaynak araç koleksiyonu',
    scenario: 'NGS veri analizi pipeline\'ları ve görselleştirme araçlarını içeren yazılım paketi',
    category: 'software-project',
    discipline: 'Biyoinformatik',
    difficulty: 'advanced',
    dataset: {
      title: 'GenomicsPy - Python Genomics Toolkit',
      description: 'NGS veri analizi, variant calling ve genomik görselleştirme araçları',
      sampleSize: '15,000+ kod satırı',
      timeframe: '2022-2024'
    },
    fairCompliance: {
      findable: {
        score: 96,
        items: ['GitHub repository', 'PyPI paketi', 'DOI ile versiyon takibi']
      },
      accessible: {
        score: 94,
        items: ['MIT License', 'Docker containers', 'Conda paketi']
      },
      interoperable: {
        score: 91,
        items: ['Standard file formats', 'RESTful API', 'Plugin architecture']
      },
      reusable: {
        score: 88,
        items: ['Detaylı dokümantasyon', 'Unit testler', 'CI/CD pipeline']
      }
    },
    downloads: [
      {
        name: 'Python Paketi',
        url: '/datasets/software-projects/bioinformatics-toolkit/genomicspy/__init__.py',
        size: '5KB',
        format: 'Python',
        description: 'Ana Python modül dosyası'
      },
      {
        name: 'Requirements',
        url: '/datasets/software-projects/bioinformatics-toolkit/requirements.txt',
        size: '1KB', 
        format: 'Text',
        description: 'Gerekli Python paketleri'
      },
      {
        name: 'Dokümantasyon',
        url: '/datasets/software-projects/bioinformatics-toolkit/README.md',
        size: '8KB',
        format: 'Markdown',
        description: 'Kurulum ve kullanım kılavuzu'
      }
    ]
  },
  {
    id: 'data-management-platform',
    title: 'FAIR Veri Yönetim Platformu',
    description: 'Araştırma kurumları için FAIR prensiplerine uygun veri yönetim web platformu',
    scenario: 'Metadata yönetimi, veri paylaşımı ve FAIR değerlendirme araçlarını içeren entegre sistem',
    category: 'software-project',
    discipline: 'Veri Bilimi',
    difficulty: 'advanced',
    dataset: {
      title: 'FAIRDataHub - Research Data Management Platform',
      description: 'Web tabanlı veri yönetim, paylaşım ve FAIR değerlendirme platformu',
      sampleSize: '25,000+ kod satırı',
      timeframe: '2023-2024'
    },
    fairCompliance: {
      findable: {
        score: 93,
        items: ['GitHub organization', 'Software DOI', 'Comprehensive README']
      },
      accessible: {
        score: 89,
        items: ['Apache 2.0 License', 'Docker deployment', 'Cloud-ready']
      },
      interoperable: {
        score: 95,
        items: ['OpenAPI specification', 'Standard protocols', 'Plugin ecosystem']
      },
      reusable: {
        score: 91,
        items: ['Architecture documentation', 'Deployment guides', 'Example configurations']
      }
    },
    downloads: [
      {
        name: 'Sistem Mimarisi',
        url: '/datasets/software-projects/data-platform/architecture.md',
        size: '25KB',
        format: 'Markdown',
        description: 'Detaylı sistem mimarisi dokümantasyonu'
      },
      {
        name: 'Kurulum Kılavuzu',
        url: '/datasets/software-projects/data-platform/deployment_guide.md',
        size: '18KB',
        format: 'Markdown', 
        description: 'Production deployment kılavuzu'
      },
      {
        name: 'Proje Dokümantasyonu',
        url: '/datasets/software-projects/data-platform/README.md',
        size: '12KB',
        format: 'Markdown',
        description: 'Ana proje dokümantasyonu'
      }
    ]
  }
];

const categories = [
  { id: 'survey-data', name: 'Anket Verisi', icon: '📊', color: '#3b82f6' },
  { id: 'lab-data', name: 'Laboratuvar Verisi', icon: '🔬', color: '#10b981' },
  { id: 'software-project', name: 'Yazılım Projesi', icon: '💻', color: '#8b5cf6' }
];

export default function ExamplesPage() {
  const [activeTab, setActiveTab] = useState('survey-data');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync with URL hash on component mount and hash changes
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && categories.some(c => c.id === hash)) {
        setActiveTab(hash);
      }
    }
  }, [mounted]);

  // Update URL when tab changes
  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
      if (mounted && typeof window !== 'undefined') {
        window.history.replaceState({}, '', `#${value}`);
      }
    }
  };

  const filteredExamples = examplesData.filter(example => example.category === activeTab);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green';
      case 'intermediate': return 'orange';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Başlangıç';
      case 'intermediate': return 'Orta';
      case 'advanced': return 'İleri';
      default: return difficulty;
    }
  };

  const calculateOverallScore = (compliance: any) => {
    const scores = [
      compliance.findable?.score || 0,
      compliance.accessible?.score || 0,
      compliance.interoperable?.score || 0,
      compliance.reusable?.score || 0
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  if (!mounted) {
    return (
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <div style={{ textAlign: 'center' }}>
            <Title order={1} size="h1" className="fairveri-gradient-text" mb="md">Pratik FAIR Örnekleri</Title>
            <Text size="xl" c="dimmed" maw={900} style={{ margin: '0 auto' }}>
              Gerçek projelerden FAIR veri prensiplerinin nasıl uygulandığını görün. 
              Anket verilerinden laboratuvar verilerine kadar kapsamlı örnekler.
            </Text>
          </div>
        </Stack>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Main Content */}
        <MantineCard p="xl">
          <Stack gap="xl">
            <div style={{ textAlign: 'center' }}>
              <Title order={1} size="h1" className="fairveri-gradient-text" mb="md">Pratik FAIR Örnekleri</Title>
              <Text size="xl" c="dimmed" maw={900} style={{ margin: '0 auto' }}>
                Gerçek projelerden FAIR veri prensiplerinin nasıl uygulandığını görün. 
                Anket verilerinden laboratuvar verilerine kadar kapsamlı örnekler.
              </Text>
            </div>

            <Tabs value={activeTab} onChange={handleTabChange} variant="outline">
              <Tabs.List grow>
                {categories.map((category) => (
                  <Tabs.Tab 
                    key={category.id} 
                    value={category.id}
                    leftSection={<span style={{ fontSize: '1.2rem' }}>{category.icon}</span>}
                  >
                    {category.name}
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              {categories.map((category) => (
                <Tabs.Panel key={category.id} value={category.id} pt="xl">
                  <Stack gap="lg">
                    {/* Category Description */}
                    <Text c="dimmed" ta="center" size="md" mb="md">
                      {category.id === 'survey-data' && 'Anket ve sosyal araştırma verilerinin FAIR prensiplere uygun organize edilmesi örnekleri.'}
                      {category.id === 'lab-data' && 'Laboratuvar deneylerinden elde edilen bilimsel verilerin FAIR yönetimi örnekleri.'}
                      {category.id === 'software-project' && 'Açık kaynak yazılım projelerinin FAIR prensiplerine uygun geliştirilmesi örnekleri.'}
                    </Text>

                    {/* Examples Grid */}
                    <Grid>
                      {filteredExamples.map((example) => (
                        <Grid.Col key={example.id} span={{ base: 12, lg: 6 }}>
                          <MantineCard p="lg" withBorder h="100%" className="fairveri-card-hover">
                            <Stack gap="md" h="100%">
                              {/* Header */}
                              <div>
                                <Group justify="space-between" align="flex-start" mb="xs">
                                  <Title order={4}>{example.title}</Title>
                                  <Badge color={getDifficultyColor(example.difficulty)}>
                                    {getDifficultyText(example.difficulty)}
                                  </Badge>
                                </Group>
                                <Text size="sm" c="dimmed" mb="md">
                                  {example.description}
                                </Text>
                                <Badge variant="outline" mb="md">
                                  {example.discipline}
                                </Badge>
                              </div>

                              {/* Content Tabs */}
                              <div style={{ flex: 1 }}>
                                <Tabs defaultValue="overview" variant="pills">
                                  <Tabs.List>
                                    <Tabs.Tab value="overview">Genel</Tabs.Tab>
                                    <Tabs.Tab value="dataset">Veri Seti</Tabs.Tab>
                                    <Tabs.Tab value="fair">FAIR</Tabs.Tab>
                                  </Tabs.List>
                                  
                                  <Tabs.Panel value="overview" pt="md">
                                    <Stack gap="md">
                                      <MantineCard p="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                                        <Title order={6} mb="xs">Senaryo</Title>
                                        <Text size="sm">{example.scenario}</Text>
                                      </MantineCard>
                                      
                                      <Group justify="center">
                                        <RingProgress
                                          size={120}
                                          thickness={12}
                                          sections={[
                                            { value: calculateOverallScore(example.fairCompliance), color: 'blue' }
                                          ]}
                                          label={
                                            <Text c="blue" fw={700} ta="center" size="lg">
                                              {calculateOverallScore(example.fairCompliance)}%
                                            </Text>
                                          }
                                        />
                                      </Group>
                                    </Stack>
                                  </Tabs.Panel>
                                  
                                  <Tabs.Panel value="dataset" pt="md">
                                    <Stack gap="sm">
                                      <Text><strong>Başlık:</strong> {example.dataset.title}</Text>
                                      <Text><strong>Açıklama:</strong> {example.dataset.description}</Text>
                                      <Text><strong>Örneklem:</strong> {example.dataset.sampleSize}</Text>
                                      <Text><strong>Zaman:</strong> {example.dataset.timeframe}</Text>
                                      
                                      {example.downloads && Array.isArray(example.downloads) && example.downloads.length > 0 && (
                                        <>
                                          <Text fw={600} mt="md">İndirilebilir Dosyalar:</Text>
                                          <Stack gap="xs">
                                            {example.downloads.map((download, downloadIndex) => (
                                              <MantineCard key={downloadIndex} p="sm" withBorder>
                                                <Group justify="space-between" align="center">
                                                  <div style={{ flex: 1 }}>
                                                    <Group gap="xs" mb="xs">
                                                      <Text fw={500} size="sm">{download.name}</Text>
                                                      <Badge size="xs" variant="outline">{download.format}</Badge>
                                                      <Badge size="xs" variant="light">{download.size}</Badge>
                                                    </Group>
                                                    <Text size="xs" c="dimmed">{download.description}</Text>
                                                  </div>
                                                  <Group gap="xs">
                                                    <Button
                                                      size="xs"
                                                      variant="light"
                                                      leftSection={<IconEye size={16} />}
                                                      onClick={() => window.open(download.url, '_blank')}
                                                    >
                                                      Önizle
                                                    </Button>
                                                    <Button
                                                      size="xs"
                                                      leftSection={<IconDownload size={16} />}
                                                      component="a"
                                                      href={download.url}
                                                      download
                                                    >
                                                      İndir
                                                    </Button>
                                                  </Group>
                                                </Group>
                                              </MantineCard>
                                            ))}
                                          </Stack>
                                        </>
                                      )}
                                    </Stack>
                                  </Tabs.Panel>
                                  
                                  <Tabs.Panel value="fair" pt="md">
                                    <Stack gap="md">
                                      {Object.entries(example.fairCompliance).map(([key, value]) => (
                                        <MantineCard key={key} p="md" withBorder>
                                          <Group justify="space-between" mb="xs">
                                            <Text fw={600}>
                                              {key === 'findable' ? 'Bulunabilirlik' :
                                               key === 'accessible' ? 'Erişilebilirlik' :
                                               key === 'interoperable' ? 'Birlikte Çalışabilirlik' :
                                               key === 'reusable' ? 'Yeniden Kullanılabilirlik' : key}
                                            </Text>
                                            <Badge variant="outline">{value.score}%</Badge>
                                          </Group>
                                          <Progress value={value.score} mb="md" />
                                          <List spacing="xs" size="sm">
                                            {value.items.map((item: string, itemIndex: number) => (
                                              <List.Item
                                                key={itemIndex}
                                                icon={<IconCheck size={16} color="var(--mantine-color-green-6)" />}
                                              >
                                                {item}
                                              </List.Item>
                                            ))}
                                          </List>
                                        </MantineCard>
                                      ))}
                                    </Stack>
                                  </Tabs.Panel>
                                </Tabs>
                              </div>
                            </Stack>
                          </MantineCard>
                        </Grid.Col>
                      ))}
                    </Grid>

                    {filteredExamples.length === 0 && (
                      <Stack align="center" py="xl">
                        <Text c="dimmed">
                          Bu kategoride henüz örnek bulunmuyor.
                        </Text>
                      </Stack>
                    )}
                  </Stack>
                </Tabs.Panel>
              ))}
            </Tabs>
          </Stack>
        </MantineCard>

        {/* Next Steps */}
        <MantineCard p="xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Stack gap="lg" align="center" ta="center">
            <Title order={3} style={{ color: 'white' }}>Sonraki Adımlar</Title>
            <Text size="lg" style={{ color: 'white', opacity: 0.9 }}>
              Örnekleri inceledikten sonra kendi verilerinizi FAIR hale getirmek için
            </Text>
            <Group>
              <Button 
                variant="white" 
                color="dark"
                component="a"
                href="/tools"
              >
                Araçları Kullanın
              </Button>
              <Button 
                variant="white" 
                color="dark"
                component="a"
                href="/assessment"
              >
                Değerlendirme Yapın
              </Button>
              <Button 
                variant="white" 
                color="dark"
                component="a"
                href="/principles"
              >
                Prensipleri Öğrenin
              </Button>
            </Group>
          </Stack>
        </MantineCard>
      </Stack>
    </Container>
  );
}