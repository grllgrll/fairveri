'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  Badge,
  Button,
  Tabs,
  Accordion,
  Progress,
  TextInput,
  Container,
  Title,
  Text,
  Stack,
  Group,
  Grid,
  Select,
  RingProgress,
  List,
  Code,
  ActionIcon
} from '@mantine/core'
import {
  IconExternalLink,
  IconCopy,
  IconCheck,
  IconDownload,
  IconEye,
  IconCode,
  IconFileText,
  IconTrendingUp,
  IconSearch
} from '@tabler/icons-react'

interface ExampleShowcaseProps {
  className?: string
  showFilters?: boolean
  featuredOnly?: boolean
}

// Mock data for examples since we don't have the examples.json file
const mockExamplesData = {
  examples: {
    title: "FAIR Veri Örnekleri",
    description: "Gerçek projelerden FAIR veri prensiplerinin uygulanması örnekleri",
    categories: [
      {
        id: "social-survey",
        title: "Sosyal Bilimler Anket Verisi",
        description: "5000 katılımcılı sosyal medya kullanım araştırması verilerinin FAIR prensiplere uygun hazırlanması",
        discipline: "social-sciences",
        difficulty: "beginner",
        example: {
          scenario: "Üniversite öğrencilerinin sosyal medya kullanım alışkanlıklarını araştıran kapsamlı anket verisi",
          dataset: {
            title: "Sosyal Medya Kullanım Alışkanlıkları Araştırması 2024",
            description: "Türk üniversite öğrencilerinin sosyal medya platformlarını kullanım şekilleri ve etkileri",
            sampleSize: "5,247 katılımcı",
            timeframe: "Ocak-Mart 2024"
          },
          fairCompliance: {
            findable: {
              score: 92,
              items: ["DOI tanımlayıcısı mevcut", "Zengin metadata", "Anahtar kelimeler tanımlanmış"]
            },
            accessible: {
              score: 88,
              items: ["HTTP/HTTPS protokolü", "Açık erişim", "Standart formatlar"]
            },
            interoperable: {
              score: 85,
              items: ["JSON-LD metadata", "Schema.org standartları", "Controlled vocabularies"]
            },
            reusable: {
              score: 90,
              items: ["Creative Commons lisansı", "Kullanım kılavuzu", "Provenance bilgisi"]
            }
          }
        }
      },
      {
        id: "chemistry-lab",
        title: "Kimya Laboratuvarı Verisi",
        description: "Organik sentez deneylerinden elde edilen spektroskopi ve karakterizasyon verilerinin yapılandırılması",
        discipline: "chemistry",
        difficulty: "intermediate",
        example: {
          scenario: "Yeni organik bileşiklerin sentezi ve karakterizasyonu için toplanan laboratuvar verileri",
          dataset: {
            title: "Organik Sentez Karakterizasyon Verileri",
            description: "NMR, IR, MS spektroskopi verileri ve kristalografik analizler",
            sampleSize: "127 bileşik",
            timeframe: "2023-2024"
          },
          fairCompliance: {
            findable: {
              score: 89,
              items: ["DOI ve ORCID bağlantıları", "ChemSpider kayıtları", "Zengin metadata"]
            },
            accessible: {
              score: 87,
              items: ["Open access repository", "Standard file formats", "API erişimi"]
            },
            interoperable: {
              score: 94,
              items: ["CIF format", "InChI identifiers", "Standard ontologies"]
            },
            reusable: {
              score: 86,
              items: ["CC BY lisansı", "Experimental protocols", "Quality assessments"]
            }
          }
        }
      },
      {
        id: "genomic-wgs",
        title: "Tüm Genom Dizileme (WGS) Verisi",
        description: "1000 bireyin tüm genom dizileme verilerinin GA4GH standartlarına uygun FAIR prensiplere göre paylaşımı",
        discipline: "genomics",
        difficulty: "advanced",
        example: {
          scenario: "Popülasyon genomik çalışması için toplanan WGS verileri ve varyant analizleri",
          dataset: {
            title: "Türk Popülasyonu Genom Projesi",
            description: "Türk popülasyonundaki genetik çeşitliliği haritalayan kapsamlı genom dizileme projesi",
            sampleSize: "1,000 birey",
            timeframe: "2023-2025"
          },
          fairCompliance: {
            findable: {
              score: 95,
              items: ["DOI ve BioProject ID", "EGA/dbGaP kayıtları", "Beacon Network entegrasyonu"]
            },
            accessible: {
              score: 85,
              items: ["Kontrollü erişim (DAC)", "htsget protokolü", "Güvenli bulut altyapısı"]
            },
            interoperable: {
              score: 90,
              items: ["GA4GH standartları", "VCF/CRAM formatları", "Phenopackets v2"]
            },
            reusable: {
              score: 92,
              items: ["DUO ontolojisi", "MINSEQE metadata", "Genomic Data Commons uyumlu"]
            }
          }
        }
      },
      {
        id: "multi-omics",
        title: "Kanser Multi-Omiks Verisi",
        description: "100 kanser hastasının genomik, transkriptomik ve proteomik verilerinin entegre FAIR yönetimi",
        discipline: "multi-omics",
        difficulty: "advanced",
        example: {
          scenario: "Meme kanseri hastalarının tedavi yanıtını tahmin etmek için multi-omiks veri entegrasyonu",
          dataset: {
            title: "Entegre Kanser Omiks Projesi",
            description: "WGS, RNA-seq, proteomik ve metabolomik verilerin ISA-Tab standardında entegrasyonu",
            sampleSize: "100 hasta, 500 örnek",
            timeframe: "2024-2026"
          },
          fairCompliance: {
            findable: {
              score: 93,
              items: ["Multi-omiks DOI sistemi", "OmicsDI entegrasyonu", "Zengin cross-omiks metadata"]
            },
            accessible: {
              score: 87,
              items: ["Katmanlı erişim kontrolü", "API tabanlı veri erişimi", "FAIR Data Point"]
            },
            interoperable: {
              score: 88,
              items: ["ISA-Tab metadata", "mzML/mzIdentML", "DICOM entegrasyonu"]
            },
            reusable: {
              score: 91,
              items: ["Detaylı protokoller", "Referans veri setleri", "Docker container'lar"]
            }
          }
        }
      },
      {
        id: "clinical-ehr",
        title: "Elektronik Sağlık Kayıtları (EHR)",
        description: "10,000 hastanın anonimize edilmiş EHR verilerinin araştırma amaçlı FAIR paylaşımı",
        discipline: "clinical",
        difficulty: "intermediate",
        example: {
          scenario: "Diyabet hastalarının uzun dönem takip verileri ve tedavi sonuçları",
          dataset: {
            title: "Ulusal Diyabet Kohort Çalışması",
            description: "HL7 FHIR standardında yapılandırılmış klinik veriler",
            sampleSize: "10,000 hasta",
            timeframe: "2020-2025"
          },
          fairCompliance: {
            findable: {
              score: 88,
              items: ["Hasta kayıt numaraları", "ICD-10 kodlaması", "SNOMED CT terminoloji"]
            },
            accessible: {
              score: 82,
              items: ["GDPR/KVKK uyumlu", "Etik kurul onaylı", "Federated learning"]
            },
            interoperable: {
              score: 85,
              items: ["HL7 FHIR", "OMOP CDM", "i2b2 uyumlu"]
            },
            reusable: {
              score: 83,
              items: ["Synthetic data", "De-identification SOP", "Cohort tanımları"]
            }
          }
        }
      }
    ]
  }
}

const ExampleShowcase: React.FC<ExampleShowcaseProps> = ({ 
  className, 
  showFilters = true, 
  featuredOnly = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>('all')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const examples = mockExamplesData.examples.categories

  const filteredExamples = examples.filter(example => {
    const matchesSearch = example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         example.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesDiscipline = selectedDiscipline === 'all' || example.discipline === selectedDiscipline
    const matchesDifficulty = selectedDifficulty === 'all' || example.difficulty === selectedDifficulty

    return matchesSearch && matchesDiscipline && matchesDifficulty
  })

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedCode(id)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      // Failed to copy text to clipboard
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'green'
      case 'intermediate': return 'orange'
      case 'advanced': return 'red'
      default: return 'gray'
    }
  }

  const getDisciplineIcon = (discipline: string) => {
    switch (discipline) {
      case 'social-sciences': return '👥'
      case 'chemistry': return '🧪'
      case 'genomics': return '🧬'
      case 'multi-omics': return '🔬'
      case 'clinical': return '🏥'
      case 'computer-science': return '💻'
      case 'earth-sciences': return '🌍'
      case 'medical-sciences': return '⚕️'
      default: return '📊'
    }
  }

  const calculateOverallScore = (compliance: any) => {
    const scores = [
      compliance.findable?.score || 0,
      compliance.accessible?.score || 0,
      compliance.interoperable?.score || 0,
      compliance.reusable?.score || 0
    ]
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  return (
    <Container size="xl" className={className}>
      <Stack gap="xl">
        {/* Header */}
        <Stack align="center" ta="center" gap="md">
          <Title order={2} size="h2">
            {mockExamplesData.examples.title}
          </Title>
          <Text size="lg" c="dimmed">
            {mockExamplesData.examples.description}
          </Text>
        </Stack>

        {/* Search and Filters */}
        {showFilters && (
          <Card p="lg" withBorder>
            <Stack gap="md">
              <Title order={4}>Örnekleri Filtrele</Title>
              
              <TextInput
                placeholder="Örnek başlığı veya açıklama ile ara..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
              />
              
              <Group>
                <Select
                  label="Disiplin"
                  placeholder="Disiplin seçin"
                  value={selectedDiscipline}
                  onChange={setSelectedDiscipline}
                  data={[
                    { value: 'all', label: 'Tüm Disiplinler' },
                    { value: 'social-sciences', label: 'Sosyal Bilimler' },
                    { value: 'chemistry', label: 'Kimya' },
                    { value: 'genomics', label: 'Genomik' },
                    { value: 'multi-omics', label: 'Multi-Omiks' },
                    { value: 'clinical', label: 'Klinik Araştırma' },
                    { value: 'computer-science', label: 'Bilgisayar Bilimleri' },
                    { value: 'earth-sciences', label: 'Yer Bilimleri' },
                    { value: 'medical-sciences', label: 'Tıp Bilimleri' },
                  ]}
                />
                
                <Select
                  label="Zorluk"
                  placeholder="Zorluk seviyesi"
                  value={selectedDifficulty}
                  onChange={setSelectedDifficulty}
                  data={[
                    { value: 'all', label: 'Tüm Seviyeler' },
                    { value: 'beginner', label: 'Başlangıç' },
                    { value: 'intermediate', label: 'Orta' },
                    { value: 'advanced', label: 'İleri' },
                  ]}
                />
              </Group>
            </Stack>
          </Card>
        )}

        {/* Examples Grid */}
        <Grid>
          {filteredExamples.map((example, index) => (
            <Grid.Col key={example.id} span={{ base: 12, lg: 6 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card p="lg" withBorder h="100%" className="fairveri-card-hover">
                  <Stack gap="md">
                    {/* Header */}
                    <Group align="flex-start">
                      <Text size="2xl">{getDisciplineIcon(example.discipline)}</Text>
                      <Stack gap="xs" style={{ flex: 1 }}>
                        <Title order={4}>{example.title}</Title>
                        <Text size="sm" c="dimmed">
                          {example.description}
                        </Text>
                        <Group gap="xs">
                          <Badge color={getDifficultyColor(example.difficulty)}>
                            {example.difficulty === 'beginner' ? 'Başlangıç' : 
                             example.difficulty === 'intermediate' ? 'Orta' : 
                             example.difficulty === 'advanced' ? 'İleri' : example.difficulty}
                          </Badge>
                          <Badge variant="outline">
                            {example.discipline === 'social-sciences' ? 'Sosyal Bilimler' :
                             example.discipline === 'chemistry' ? 'Kimya' :
                             example.discipline === 'genomics' ? 'Genomik' :
                             example.discipline === 'multi-omics' ? 'Multi-Omiks' :
                             example.discipline === 'clinical' ? 'Klinik Araştırma' :
                             example.discipline === 'computer-science' ? 'Bilgisayar Bilimleri' :
                             example.discipline === 'earth-sciences' ? 'Yer Bilimleri' :
                             example.discipline === 'medical-sciences' ? 'Tıp Bilimleri' : example.discipline}
                          </Badge>
                        </Group>
                      </Stack>
                    </Group>
                    
                    {/* Content */}
                    <Tabs defaultValue="overview">
                      <Tabs.List grow>
                        <Tabs.Tab value="overview">Genel</Tabs.Tab>
                        <Tabs.Tab value="dataset">Veri Seti</Tabs.Tab>
                        <Tabs.Tab value="fair">FAIR</Tabs.Tab>
                      </Tabs.List>
                      
                      <Tabs.Panel value="overview" pt="md">
                        <Stack gap="md">
                          <Card p="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                            <Title order={6} mb="xs">Senaryo</Title>
                            <Text size="sm">{example.example.scenario}</Text>
                          </Card>
                          
                          <Group justify="center">
                            <RingProgress
                              size={120}
                              thickness={12}
                              sections={[
                                { value: calculateOverallScore(example.example.fairCompliance), color: 'blue' }
                              ]}
                              label={
                                <Text c="blue" fw={700} ta="center" size="lg">
                                  {calculateOverallScore(example.example.fairCompliance)}%
                                </Text>
                              }
                            />
                          </Group>
                        </Stack>
                      </Tabs.Panel>
                      
                      <Tabs.Panel value="dataset" pt="md">
                        <Stack gap="sm">
                          <Text><strong>Başlık:</strong> {example.example.dataset.title}</Text>
                          <Text><strong>Açıklama:</strong> {example.example.dataset.description}</Text>
                          {example.example.dataset.sampleSize && (
                            <Text><strong>Örneklem:</strong> {example.example.dataset.sampleSize}</Text>
                          )}
                          {example.example.dataset.timeframe && (
                            <Text><strong>Zaman:</strong> {example.example.dataset.timeframe}</Text>
                          )}
                        </Stack>
                      </Tabs.Panel>
                      
                      <Tabs.Panel value="fair" pt="md">
                        <Stack gap="md">
                          {Object.entries(example.example.fairCompliance).map(([key, value]) => (
                            <Card key={key} p="md" withBorder>
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
                            </Card>
                          ))}
                        </Stack>
                      </Tabs.Panel>
                    </Tabs>
                  </Stack>
                </Card>
              </motion.div>
            </Grid.Col>
          ))}
        </Grid>

        {filteredExamples.length === 0 && (
          <Stack align="center" py="xl">
            <Text c="dimmed">
              Arama kriterlerinize uygun örnek bulunamadı.
            </Text>
          </Stack>
        )}
      </Stack>
    </Container>
  )
}

export default ExampleShowcase