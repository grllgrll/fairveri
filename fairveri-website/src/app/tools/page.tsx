'use client';

import { Container, Title, Text, Stack, Grid, Tabs, Badge, Card as MantineCard, Button, Group, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import { IconSearch, IconExternalLink } from '@tabler/icons-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags: string[];
  pricing: 'free' | 'paid' | 'freemium';
  features: string[];
  turkishSupport?: boolean;
}

const toolsData: Tool[] = [
  // Assessment Tools
  {
    id: 'f-uji',
    name: 'F-UJI',
    description: 'FAIR veri uyumluluk değerlendirme aracı. Veri setlerinizin FAIR prensiplere ne kadar uygun olduğunu otomatik olarak analiz eder.',
    url: 'https://www.f-uji.net/',
    category: 'assessment',
    tags: ['FAIR evaluation', 'automated assessment', 'metrics'],
    pricing: 'free',
    features: ['Otomatik FAIR değerlendirme', 'Detaylı rapor oluşturma', 'API desteği', 'Toplu değerlendirme']
  },
  {
    id: 'fair-aware',
    name: 'FAIR-Aware',
    description: 'FAIR farkındalık ve değerlendirme platformu. Veri yöneticileri için eğitim materyalleri ve değerlendirme araçları sağlar.',
    url: 'https://fairaware.dans.knaw.nl/',
    category: 'assessment',
    tags: ['education', 'awareness', 'self-assessment'],
    pricing: 'free',
    features: ['Kendi kendine değerlendirme', 'Eğitim materyalleri', 'İlerleme takibi', 'Sertifika programı']
  },
  {
    id: 'fair-metrics',
    name: 'FAIR Metrics',
    description: 'FAIR veri metriklerini ölçen araç. Akademik topluluk tarafından geliştirilen standart metrikleri kullanır.',
    url: 'https://github.com/FAIRMetrics/Metrics',
    category: 'assessment',
    tags: ['metrics', 'evaluation', 'community standards'],
    pricing: 'free',
    features: ['Standart FAIR metrikleri', 'GitHub entegrasyonu', 'Topluluk destekli', 'API tabanlı']
  },
  {
    id: 'fairshake',
    name: 'FAIRshake',
    description: 'Dijital kaynakların FAIR uyumluluğunu değerlendiren topluluk destekli platform.',
    url: 'https://fairshake.cloud/',
    category: 'assessment',
    tags: ['community assessment', 'digital resources', 'rubrics'],
    pricing: 'free',
    features: ['Topluluk değerlendirmesi', 'Esnek rubrikler', 'Karşılaştırma araçları', 'İstatistiksel analiz']
  },

  // Metadata Tools
  {
    id: 'datacite-metadata',
    name: 'DataCite Metadata Store',
    description: 'Metadata oluşturma ve yönetim aracı. DOI kayıt sistemi ile entegre çalışır.',
    url: 'https://datacite.org/dois.html',
    category: 'metadata',
    tags: ['DOI', 'metadata creation', 'standards'],
    pricing: 'free',
    features: ['DOI oluşturma', 'Metadata editörü', 'Şema validasyonu', 'API erişimi']
  },
  {
    id: 'dublin-core-editor',
    name: 'Dublin Core Metadata Editor',
    description: 'Dublin Core standardında metadata oluşturmak için web tabanlı editör.',
    url: 'https://www.dublincore.org/tools/',
    category: 'metadata',
    tags: ['Dublin Core', 'metadata editor', 'web-based'],
    pricing: 'free',
    features: ['Dublin Core uyumlu', 'Kolay arayüz', 'XML çıktısı', 'Validasyon desteği']
  },
  {
    id: 'schema-org-generator',
    name: 'Schema.org Metadata Generator',
    description: 'Schema.org formatında yapılandırılmış veri oluşturmak için araç.',
    url: 'https://schema.org/docs/gs.html',
    category: 'metadata',
    tags: ['Schema.org', 'structured data', 'SEO'],
    pricing: 'free',
    features: ['Schema.org uyumlu', 'JSON-LD çıktısı', 'SEO optimizasyonu', 'Çoklu format desteği']
  },
  {
    id: 'metadata-quality-checker',
    name: 'Metadata Quality Assessment Tool',
    description: 'Metadata kalitesini değerlendiren ve iyileştirme önerileri sunan araç.',
    url: 'https://www.dcc.ac.uk/resources/metadata-standards',
    category: 'metadata',
    tags: ['quality assessment', 'improvement', 'standards compliance'],
    pricing: 'free',
    features: ['Kalite analizi', 'İyileştirme önerileri', 'Standart uyumluluk', 'Toplu işlem']
  },

  // Data Cleaning Tools
  {
    id: 'openrefine',
    name: 'OpenRefine',
    description: 'Güçlü veri temizleme ve dönüştürme aracı. Büyük veri setlerini işlemek için ideal.',
    url: 'https://openrefine.org/',
    category: 'cleaning',
    tags: ['data cleaning', 'transformation', 'open source'],
    pricing: 'free',
    features: ['Toplu veri düzenleme', 'API entegrasyonu', 'Eklenti desteği', 'İleri filtreleme']
  },
  {
    id: 'trifacta-wrangler',
    name: 'Trifacta Wrangler',
    description: 'Görsel arayüz ile veri hazırlama ve temizleme platformu.',
    url: 'https://www.trifacta.com/products/wrangler/',
    category: 'cleaning',
    tags: ['visual interface', 'data preparation', 'commercial'],
    pricing: 'freemium',
    features: ['Görsel veri profilleme', 'Akıllı öneriler', 'Collaboration araçları', 'Bulut entegrasyonu']
  },
  {
    id: 'data-cleaner',
    name: 'DataCleaner',
    description: 'Açık kaynak veri kalitesi analiz ve temizleme aracı.',
    url: 'https://datacleaner.github.io/',
    category: 'cleaning',
    tags: ['data quality', 'profiling', 'open source'],
    pricing: 'free',
    features: ['Veri profilleme', 'Kalite kuralları', 'Görselleştirme', 'Raporlama']
  },
  {
    id: 'csvkit',
    name: 'csvkit',
    description: 'CSV dosyaları için komut satırı araçları koleksiyonu.',
    url: 'https://csvkit.readthedocs.io/',
    category: 'cleaning',
    tags: ['CSV', 'command line', 'utilities'],
    pricing: 'free',
    features: ['CSV manipülasyonu', 'SQL sorguları', 'İstatistiksel analiz', 'Format dönüştürme']
  },

  // Data Repositories
  {
    id: 'zenodo',
    name: 'Zenodo',
    description: 'CERN tarafından işletilen açık erişim veri deposu. Her türlü araştırma verisi için.',
    url: 'https://zenodo.org/',
    category: 'repositories',
    tags: ['open access', 'DOI', 'versioning'],
    pricing: 'free',
    features: ['Ücretsiz depolama', 'DOI atama', 'Versiyon kontrolü', 'GitHub entegrasyonu'],
    turkishSupport: true
  },
  {
    id: 'figshare',
    name: 'Figshare',
    description: 'Araştırma çıktıları için bulut tabanlı depo. Figürler, veri setleri ve makaleler için.',
    url: 'https://figshare.com/',
    category: 'repositories',
    tags: ['cloud storage', 'research outputs', 'DOI'],
    pricing: 'freemium',
    features: ['Bulut depolama', 'Altmetrics', 'Collaboration', 'API erişimi']
  },
  {
    id: 'dryad',
    name: 'Dryad',
    description: 'Bilimsel makalelerle ilişkili veri setleri için uzmanlaşmış depo.',
    url: 'https://datadryad.org/',
    category: 'repositories',
    tags: ['scientific data', 'journal integration', 'peer review'],
    pricing: 'paid',
    features: ['Makale entegrasyonu', 'Peer review', 'Uzun vadeli koruma', 'Metadata zenginleştirme']
  },
  {
    id: 'dataverse',
    name: 'Dataverse',
    description: 'Harvard tarafından geliştirilen açık kaynak veri deposu yazılımı.',
    url: 'https://dataverse.org/',
    category: 'repositories',
    tags: ['institutional', 'open source', 'customizable'],
    pricing: 'free',
    features: ['Kurumsal çözüm', 'Özelleştirilebilir', 'Metadata standartları', 'API desteği']
  },
  {
    id: 'tubitak-aperta',
    name: 'TÜBİTAK APERTA',
    description: 'Türkiye\'nin ulusal açık erişim arşivi. TÜBİTAK ULAKBİM tarafından işletilir.',
    url: 'https://aperta.ulakbim.gov.tr/',
    category: 'repositories',
    tags: ['Turkish', 'national archive', 'institutional'],
    pricing: 'free',
    features: ['Türkçe arayüz', 'Ulusal arşiv', 'OAI-PMH uyumlu', 'Kurumsal hesaplar'],
    turkishSupport: true
  }
];

const categories = [
  { id: 'assessment', name: 'Değerlendirme Araçları', icon: '📊', color: '#3b82f6' },
  { id: 'metadata', name: 'Metadata Araçları', icon: '📝', color: '#f59e0b' },
  { id: 'cleaning', name: 'Veri Temizleme', icon: '🧹', color: '#10b981' },
  { id: 'repositories', name: 'Veri Depoları', icon: '🏛️', color: '#8b5cf6' }
];

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState('assessment');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync with URL hash on component mount and hash changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && categories.some(c => c.id === hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', `#${value}`);
      }
    }
  };

  const filteredTools = toolsData.filter(tool => {
    const matchesCategory = tool.category === activeTab;
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const getPricingColor = (pricing: string) => {
    switch (pricing) {
      case 'free': return { bg: '#dcfce7', color: '#166534' };
      case 'paid': return { bg: '#fecaca', color: '#991b1b' };
      case 'freemium': return { bg: '#fef3c7', color: '#92400e' };
      default: return { bg: '#f3f4f6', color: '#374151' };
    }
  };

  const getPricingText = (pricing: string) => {
    switch (pricing) {
      case 'free': return 'Ücretsiz';
      case 'paid': return 'Ücretli';
      case 'freemium': return 'Kısmi Ücretsiz';
      default: return pricing;
    }
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">



        {/* Tools by Category */}
        <MantineCard p="xl">
          <Stack gap="xl">
            <div style={{ textAlign: 'center' }}>
              <Title order={1} size="h1" className="fairveri-gradient-text" mb="md">FAIR Araçları Kategorileri</Title>
              <Text size="xl" c="dimmed" maw={900} style={{ margin: '0 auto' }}>
                İhtiyacınıza uygun araçları keşfedin ve FAIR veri yönetimini başlangıçtan sona kadar destekleyin.
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
                      {category.id === 'assessment' && 'Veri setlerinizin FAIR prensiplere uyumluluğunu değerlendirin ve iyileştirme alanlarını belirleyin.'}
                      {category.id === 'metadata' && 'Zengin ve standart uyumlu metadata oluşturun ve yönetin.'}
                      {category.id === 'cleaning' && 'Verilerinizi temizleyin, dönüştürün ve analiz için hazır hale getirin.'}
                      {category.id === 'repositories' && 'Verilerinizi güvenli ve erişilebilir depolarda yayınlayın ve paylaşın.'}
                    </Text>

                    {/* Tools Grid */}
                    <Grid>
                      {filteredTools.map((tool) => (
                        <Grid.Col key={tool.id} span={{ base: 12, md: 6, lg: 4 }}>
                          <MantineCard p="lg" withBorder h="100%" className="fairveri-card-hover">
                            <Stack gap="md" h="100%">
                              {/* Header */}
                              <div>
                                <Group justify="space-between" align="flex-start" mb="xs">
                                  <Title order={4}>{tool.name}</Title>
                                  {tool.turkishSupport && (
                                    <Badge size="sm" variant="light" color="green">
                                      🇹🇷 TR
                                    </Badge>
                                  )}
                                </Group>
                                <Text size="sm" c="dimmed" mb="md">
                                  {tool.description}
                                </Text>
                              </div>

                              {/* Features */}
                              <div style={{ flex: 1 }}>
                                <Text fw={500} size="sm" mb="xs">Özellikler:</Text>
                                <Stack gap="xs">
                                  {tool.features.slice(0, 3).map((feature, idx) => (
                                    <Text key={idx} size="xs" c="dimmed">
                                      • {feature}
                                    </Text>
                                  ))}
                                  {tool.features.length > 3 && (
                                    <Text size="xs" c="dimmed">
                                      ... ve {tool.features.length - 3} özellik daha
                                    </Text>
                                  )}
                                </Stack>
                              </div>

                              {/* Footer */}
                              <div>
                                <Group justify="space-between" align="center" mt="md">
                                  <Badge 
                                    style={{ 
                                      backgroundColor: getPricingColor(tool.pricing).bg,
                                      color: getPricingColor(tool.pricing).color
                                    }}
                                  >
                                    {getPricingText(tool.pricing)}
                                  </Badge>
                                  <Button
                                    component="a"
                                    href={tool.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    variant="light"
                                    size="sm"
                                    rightSection={<IconExternalLink size="0.9rem" />}
                                  >
                                    Ziyaret Et
                                  </Button>
                                </Group>
                              </div>
                            </Stack>
                          </MantineCard>
                        </Grid.Col>
                      ))}
                    </Grid>

                    {filteredTools.length === 0 && (
                      <Stack align="center" py="xl">
                        <Text c="dimmed">
                          {searchQuery ? 'Arama kriterlerinize uygun araç bulunamadı.' : 'Bu kategoride henüz araç bulunmuyor.'}
                        </Text>
                      </Stack>
                    )}
                  </Stack>
                </Tabs.Panel>
              ))}
            </Tabs>
          </Stack>
        </MantineCard>

        {/* Additional Resources */}
        <MantineCard p="xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Stack gap="lg" align="center" ta="center">
            <Title order={3} style={{ color: 'white' }}>Daha Fazla Kaynak</Title>
            <Text size="lg" style={{ color: 'white', opacity: 0.9 }}>
              FAIR veri yönetimi hakkında daha fazla bilgi ve kaynak için diğer bölümlerimizi keşfedin
            </Text>
            <Group>
              <Button 
                variant="white" 
                color="dark"
                component="a"
                href="/principles"
              >
                FAIR Prensipleri
              </Button>
              <Button 
                variant="white" 
                color="dark"
                component="a"
                href="/examples"
              >
                Pratik Örnekler
              </Button>
              <Button 
                variant="white" 
                color="dark"
                component="a"
                href="/assessment"
              >
                Değerlendirme
              </Button>
            </Group>
          </Stack>
        </MantineCard>
      </Stack>
    </Container>
  );
}