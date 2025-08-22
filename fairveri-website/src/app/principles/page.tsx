'use client';

import { Container, Title, Text, Stack, Grid, Tabs, Progress, List, ThemeIcon, Badge, Card as MantineCard, Button, Group, Alert, Accordion, Code, Tooltip } from '@mantine/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IconCheck, IconX, IconBulb, IconAlertCircle, IconTool, IconBook, IconTarget, IconTrophy, IconDownload, IconExternalLink, IconInfoCircle } from '@tabler/icons-react';

const principleData = [
  {
    id: 'findable',
    principle: 'F - Findable (Bulunabilir)',
    icon: '🔍',
    color: '#3B82F6',
    description: 'Verilerinizi ve araştırma çıktılarınızı hem insanlar hem de makineler tarafından kolayca bulunabilir hale getirin.',
    whyImportant: 'Araştırma verilerinin bulunabilir olması, bilimsel keşiflerin hızlanmasını, gereksiz çalışma tekrarlarının önlenmesini ve işbirliklerinin artmasını sağlar. Bulunabilir veriler, araştırmanızın etkisini ve görünürlüğünü artırır.',
    subPrinciples: [
      {
        id: 'F1',
        title: 'F1. Metaveri ve veri kalıcı, küresel olarak benzersiz ve çözülebilir tanımlayıcılarla atanmalıdır',
        description: 'Her veri kümesi için DOI, Handle veya benzer kalıcı tanımlayıcılar kullanılmalıdır.',
        examples: [
          'DOI: 10.5281/zenodo.1234567',
          'Handle: 20.500.12345/67890',
          'ARK: ark:/12345/b6789gh12'
        ],
        tools: [
          { name: 'DataCite', url: 'https://datacite.org' },
          { name: 'Zenodo', url: 'https://zenodo.org' },
          { name: 'Figshare', url: 'https://figshare.com' },
          { name: 'Dryad', url: 'https://datadryad.org' }
        ]
      },
      {
        id: 'F2', 
        title: 'F2. Veri, zengin metaveri ile tanımlanmalıdır',
        description: 'Verinin bulunabilmesi için kapsamlı metadata ile desteklenmesi gerekir.',
        examples: [
          'Dublin Core metadata standardı',
          'DataCite Metadata Schema',
          'Schema.org yapılandırılmış veri'
        ],
        tools: [
          { name: 'DataCite Metadata Generator', url: 'https://schema.datacite.org/meta/kernel-4.4' },
          { name: 'Dublin Core Metadata Editor', url: 'https://www.dublincore.org/tools' }
        ]
      },
      {
        id: 'F3',
        title: 'F3. Metaveri, verinin tanımlayıcısını açık ve net bir şekilde belirtmelidir',
        description: 'Metadata, hangi veriye ait olduğunu kesin olarak belirtmelidir.',
        examples: [
          'related_identifier alanında DOI referansı',
          'dc:identifier kullanımı'
        ]
      },
      {
        id: 'F4',
        title: 'F4. Metaveri ve veri aranabilir kaynaklarda kayıtlı veya indekslenmelidir',
        description: 'Veriler arama motorları ve kataloglarda bulunabilir olmalıdır.',
        examples: [
          'Google Dataset Search',
          'DataCite Search',
          'OpenAIRE Explore'
        ]
      }
    ],
    bestPractices: [
      'Açıklayıcı ve benzersiz başlıklar kullanın',
      'Zengin anahtar kelimeler ekleyin',
      'ORCID ile yazar tanımlama yapın',
      'Disipline özgü metadata standartlarını kullanın',
      'Versiyon kontrolü uygulayın'
    ],
    commonMistakes: [
      'Genel veya belirsiz başlıklar kullanmak',
      'Metadata alanlarını boş bırakmak',
      'Geçici URL\'ler kullanmak',
      'Anahtar kelimeleri ihmal etmek'
    ],
    checklist: [
      { id: 'f-check-1', label: 'Verileriniz için kalıcı tanımlayıcı (DOI) aldınız mı?', checked: false, tooltip: 'DOI, Handle veya ARK gibi kalıcı tanımlayıcılar verilerinizin uzun vadede bulunabilir olmasını sağlar.' },
      { id: 'f-check-2', label: 'Tüm zorunlu metadata alanlarını doldurdunuz mu?', checked: false, tooltip: 'Başlık, yazar, açıklama, konu alanları gibi temel metadata alanları doldurulmalıdır.' },
      { id: 'f-check-3', label: 'En az 5 alakalı anahtar kelime eklediniz mi?', checked: false, tooltip: 'Anahtar kelimeler verilerinizin arama motorlarında daha kolay bulunmasını sağlar.' },
      { id: 'f-check-4', label: 'ORCID tanımlayıcınızı eklediniz mi?', checked: false, tooltip: 'ORCID kimliğiniz, çalışmalarınızın size doğru şekilde atfedilmesini sağlar.' },
      { id: 'f-check-5', label: 'Verileriniz arama motorlarında indekslendi mi?', checked: false, tooltip: 'Google Dataset Search, DataCite Search gibi platformlarda verilerinizin görünür olduğunu kontrol edin.' }
    ],
    turkeyContext: {
      title: 'Türkiye\'de FAIR Bulunabilirlik',
      content: [
        'TÜBİTAK ULAKBİM, Türk araştırmacılar için DOI hizmeti sunmaktadır',
        'YÖK Tez Merkezi, tezler için kalıcı tanımlayıcılar sağlar',
        'Açık Bilim politikaları gereği, kamu destekli araştırmaların bulunabilir olması zorunludur'
      ],
      resources: [
        { name: 'TÜBİTAK DOI Servisi', url: 'https://doi.tubitak.gov.tr' },
        { name: 'APERTA - TÜBİTAK Açık Arşiv', url: 'https://aperta.ulakbim.gov.tr' }
      ]
    }
  },
  {
    id: 'accessible',
    principle: 'A - Accessible (Erişilebilir)', 
    icon: '🌐',
    color: '#10B981',
    description: 'Verilerinize standart protokoller üzerinden güvenli ve kontrollü erişim sağlayın.',
    whyImportant: 'Erişilebilir veriler, bilimsel şeffaflığı artırır, araştırma sonuçlarının doğrulanmasını sağlar ve yeni keşiflere olanak tanır. Uygun erişim kontrolleri ile hassas verilerin güvenliği de sağlanır.',
    subPrinciples: [
      {
        id: 'A1',
        title: 'A1. Metaveri ve veri, standartlaştırılmış iletişim protokolü kullanılarak tanımlayıcıları aracılığıyla alınabilir olmalıdır',
        description: 'HTTP, FTP gibi standart protokollerle erişilebilir olmalıdır.',
        examples: [
          'HTTPS üzerinden REST API',
          'OAI-PMH protokolü',
          'SPARQL endpoint\'leri'
        ],
        tools: [
          { name: 'DSpace', url: 'https://duraspace.org/dspace' },
          { name: 'Dataverse', url: 'https://dataverse.org' },
          { name: 'CKAN', url: 'https://ckan.org' }
        ]
      },
      {
        id: 'A1.1',
        title: 'A1.1. Protokol açık, ücretsiz ve evrensel olarak uygulanabilir olmalıdır',
        description: 'Erişim protokolleri herkesçe kullanılabilir olmalıdır.',
        examples: [
          'HTTP/HTTPS kullanımı',
          'Açık API spesifikasyonları'
        ]
      },
      {
        id: 'A1.2',
        title: 'A1.2. Protokol, gerektiğinde bir kimlik doğrulama ve yetkilendirme prosedürüne izin vermelidir',
        description: 'Hassas veriler için güvenli erişim mekanizmaları bulunmalıdır.',
        examples: [
          'OAuth 2.0 kimlik doğrulama',
          'API anahtarları',
          'Federated authentication'
        ]
      },
      {
        id: 'A2',
        title: 'A2. Metaveri, veri artık mevcut olmasa bile erişilebilir olmalıdır',
        description: 'Veri silinse bile metadata korunmalıdır.',
        examples: [
          'Tombstone sayfaları',
          'Veri geri çekme bildirimleri'
        ]
      }
    ],
    bestPractices: [
      'HTTPS kullanarak güvenli erişim sağlayın',
      'API dokümantasyonu hazırlayın',
      'Erişim logları tutun',
      'Farklı erişim seviyeleri tanımlayın',
      'Metadata\'yı her zaman açık erişimli yapın'
    ],
    commonMistakes: [
      'Özel protokoller kullanmak',
      'Metadata\'yı da kısıtlamak',
      'Dokümantasyon eksikliği',
      'Güvenlik önlemlerini ihmal etmek'
    ],
    checklist: [
      { id: 'a-check-1', label: 'Verileriniz HTTPS üzerinden erişilebilir mi?', checked: false, tooltip: 'Güvenli HTTPS protokolü ile veri erişimi sağlanmalı, HTTP yerine HTTPS kullanılmalıdır.' },
      { id: 'a-check-2', label: 'API dokümantasyonunuz var mı?', checked: false, tooltip: 'Verilerinize nasıl erişileceğini açıklayan detaylı API dokümantasyonu hazırlanmalıdır.' },
      { id: 'a-check-3', label: 'Kimlik doğrulama mekanizması kurdunuz mu?', checked: false, tooltip: 'Hassas veriler için OAuth, API anahtarları gibi güvenli kimlik doğrulama yöntemleri kullanılmalıdır.' },
      { id: 'a-check-4', label: 'Metadata\'nız açık erişimli mi?', checked: false, tooltip: 'Veri erişimi kısıtlı olsa bile metadata her zaman açık erişimli olmalıdır.' },
      { id: 'a-check-5', label: 'Veri kullanım koşullarını belirttiniz mi?', checked: false, tooltip: 'Verilerinizin nasıl kullanılabileceği, kısıtlamalar ve gereksinimler açıkça belirtilmelidir.' }
    ],
    turkeyContext: {
      title: 'Türkiye\'de Veri Erişilebilirliği',
      content: [
        'KVKK kapsamında kişisel veri güvenliği sağlanmalıdır',
        'Sağlık verileri için özel izin ve anonimizasyon gerekir',
        'TÜBİTAK projelerinde açık erişim zorunluluğu vardır'
      ],
      resources: [
        { name: 'KVKK Rehberi', url: 'https://www.kvkk.gov.tr' },
        { name: 'Sağlık Bakanlığı Veri Paylaşım', url: '#' }
      ]
    }
  },
  {
    id: 'interoperable',
    principle: 'I - Interoperable (Birlikte Çalışabilir)',
    icon: '🔗', 
    color: '#8B5CF6',
    description: 'Verilerinizi diğer sistemler ve veri setleri ile entegre edilebilir hale getirin.',
    whyImportant: 'Birlikte çalışabilir veriler, farklı kaynaklardan gelen bilgilerin birleştirilmesini, meta-analizlerin yapılmasını ve disiplinler arası araştırmaların gerçekleştirilmesini mümkün kılar.',
    subPrinciples: [
      {
        id: 'I1',
        title: 'I1. Metaveri ve veri, bilginin temsili için resmi, erişilebilir, paylaşılan ve geniş çapta uygulanabilir bir dil kullanmalıdır',
        description: 'JSON, XML, RDF gibi standart formatlar kullanılmalıdır.',
        examples: [
          'JSON-LD for metadata',
          'XML Schema definitions',
          'RDF triples'
        ],
        tools: [
          { name: 'JSON Schema Validator', url: 'https://www.jsonschemavalidator.net' },
          { name: 'XML Validator', url: 'https://www.xmlvalidation.com' },
          { name: 'RDF Validator', url: 'https://www.w3.org/RDF/Validator' }
        ]
      },
      {
        id: 'I2',
        title: 'I2. Metaveri, FAIR prensiplerini takip eden kelime dağarcıkları kullanmalıdır',
        description: 'Kontrollü sözlükler ve ontolojiler kullanılmalıdır.',
        examples: [
          'SNOMED CT (tıp)',
          'ChEBI (kimya)',
          'AGROVOC (tarım)'
        ],
        tools: [
          { name: 'BioPortal', url: 'https://bioportal.bioontology.org' },
          { name: 'Ontology Lookup Service', url: 'https://www.ebi.ac.uk/ols' }
        ]
      },
      {
        id: 'I3',
        title: 'I3. Metaveri, diğer metaveri ile nitelikli referanslar içermelidir',
        description: 'Veriler arasında anlamlı bağlantılar kurulmalıdır.',
        examples: [
          'isPartOf ilişkisi',
          'isDerivedFrom bağlantısı',
          'references listesi'
        ]
      }
    ],
    bestPractices: [
      'Standart veri formatları kullanın',
      'Ontolojileri ve kontrollü sözlükleri benimseyin',
      'Veri şemalarınızı dokümante edin',
      'API\'ler aracılığıyla veri sunun',
      'Linked Data prensiplerini uygulayın'
    ],
    commonMistakes: [
      'Özel veri formatları geliştirmek',
      'Dokümantasyon olmadan veri paylaşmak',
      'Standart olmayan kodlamalar kullanmak',
      'İlişkileri belirtmemek'
    ],
    checklist: [
      { id: 'i-check-1', label: 'Standart veri formatları kullanıyor musunuz?', checked: false, tooltip: 'JSON, XML, CSV gibi yaygın kabul görmüş standart formatları tercih edin, özel formatlardan kaçının.' },
      { id: 'i-check-2', label: 'Kontrollü sözlükler kullandınız mı?', checked: false, tooltip: 'Alanınıza özgü ontojiler ve kontrollü sözlükler (SNOMED CT, ChEBI vb.) kullanarak tutarlılık sağlayın.' },
      { id: 'i-check-3', label: 'Veri şemanızı dokümante ettiniz mi?', checked: false, tooltip: 'Veri yapınızı, alan tanımlarını ve ilişkileri açıklayan detaylı şema dokümantasyonu hazırlayın.' },
      { id: 'i-check-4', label: 'İlişkili veri setlerine referans verdiniz mi?', checked: false, tooltip: 'Diğer veri setleri ile olan bağlantıları ve referansları metadata içinde açık şekilde belirtin.' },
      { id: 'i-check-5', label: 'API spesifikasyonunuz var mı?', checked: false, tooltip: 'OpenAPI/Swagger gibi standartlarla API spesifikasyonunuzu dokümante edin.' }
    ],
    turkeyContext: {
      title: 'Türkiye\'de Birlikte Çalışabilirlik',
      content: [
        'e-Devlet entegrasyonları için standart formatlar kullanılmalıdır',
        'Sağlık Bakanlığı SBYS standartlarına uyum gerekir',
        'TÜBİTAK projeleri arası veri paylaşımı teşvik edilmektedir'
      ],
      resources: [
        { name: 'e-Devlet Veri Standartları', url: '#' },
        { name: 'SBYS Entegrasyon Kılavuzu', url: '#' }
      ]
    }
  },
  {
    id: 'reusable',
    principle: 'R - Reusable (Yeniden Kullanılabilir)',
    icon: '♻️',
    color: '#F59E0B', 
    description: 'Verilerinizi gelecekteki araştırmalar için yeniden kullanılabilir hale getirin.',
    whyImportant: 'Yeniden kullanılabilir veriler, bilimsel ilerlemeyi hızlandırır, kaynakların verimli kullanılmasını sağlar ve yeni keşiflere zemin hazırlar. İyi dokümante edilmiş veriler, gelecek nesil araştırmacılar için değerli bir kaynak oluşturur.',
    subPrinciples: [
      {
        id: 'R1',
        title: 'R1. Metaveri ve veri, çoklu doğru ve alakalı niteliklerle zengin bir şekilde tanımlanmıştır',
        description: 'Verinin yeniden kullanımı için yeterli bilgi sağlanmalıdır.',
        examples: [
          'Detaylı metodoloji açıklaması',
          'Kalite kontrol bilgileri',
          'Deneysel koşullar'
        ],
        tools: [
          { name: 'Protocols.io', url: 'https://www.protocols.io' },
          { name: 'MethodsX', url: 'https://www.journals.elsevier.com/methodsx' }
        ]
      },
      {
        id: 'R1.1',
        title: 'R1.1. Metaveri, net ve erişilebilir veri kullanım lisansı ile yayınlanmıştır',
        description: 'Kullanım koşulları açıkça belirtilmelidir.',
        examples: [
          'Creative Commons lisansları',
          'Open Database License (ODbL)',
          'MIT License (yazılım için)'
        ],
        tools: [
          { name: 'Creative Commons Chooser', url: 'https://chooser.creativecommons.org' },
          { name: 'License Selector', url: 'https://ufal.github.io/public-license-selector' }
        ]
      },
      {
        id: 'R1.2',
        title: 'R1.2. Metaveri, verinin kökenini detaylandırmıştır',
        description: 'Verinin nasıl oluşturulduğu ve işlendiği bilinmelidir.',
        examples: [
          'PROV-O ontolojisi',
          'Audit trail kayıtları',
          'Versiyon geçmişi'
        ]
      },
      {
        id: 'R1.3',
        title: 'R1.3. Metaveri, alanın topluluk standartlarını karşılamaktadır',
        description: 'Disiplin-spesifik gerekliliklere uygun olmalıdır.',
        examples: [
          'MIAME (microarray)',
          'MINSEQE (sequencing)',
          'ARRIVE (hayvan deneyleri)'
        ]
      }
    ],
    bestPractices: [
      'Açık lisanslar kullanın',
      'Detaylı dokümantasyon hazırlayın',
      'Kod ve scriptleri paylaşın',
      'Veri kalitesini belirtin',
      'Kullanım örnekleri sağlayın'
    ],
    commonMistakes: [
      'Belirsiz lisans koşulları',
      'Eksik dokümantasyon',
      'Ham veri paylaşımı',
      'Bağlam bilgisi eksikliği'
    ],
    checklist: [
      { id: 'r-check-1', label: 'Açık bir lisans seçtiniz mi?', checked: false, tooltip: 'Creative Commons, MIT veya benzeri açık lisanslar seçerek verilerinizin yeniden kullanımını kolaylaştırın.' },
      { id: 'r-check-2', label: 'Veri toplama metodolojisini açıkladınız mı?', checked: false, tooltip: 'Verilerinizin nasıl toplandığı, işlendiği ve analiz edildiğini detaylandıran metodoloji dokümantasyonu sağlayın.' },
      { id: 'r-check-3', label: 'Veri kalite metrikleri sağladınız mı?', checked: false, tooltip: 'Verilerinizin doğruluğu, tamlığı ve güvenilirliği hakkında ölçülebilir kalite göstergeleri sunun.' },
      { id: 'r-check-4', label: 'Kullanım örnekleri eklediniz mi?', checked: false, tooltip: 'Verilerinizin nasıl kullanılabileceğini gösteren somut örnekler ve kullanım senaryoları hazırlayın.' },
      { id: 'r-check-5', label: 'Topluluk standartlarına uyum sağladınız mı?', checked: false, tooltip: 'Alanınızdaki kabul edilmiş standartlara (MIAME, MINSEQE vb.) uygun metadata ve dokümantasyon sağlayın.' }
    ],
    turkeyContext: {
      title: 'Türkiye\'de Veri Yeniden Kullanımı',
      content: [
        'TÜBİTAK destekli araştırmalarda açık lisans kullanımı teşvik edilir',
        'Üniversiteler arası veri paylaşım protokolleri geliştirilmektedir',
        'Ulusal Açık Bilim politikası veri yeniden kullanımını destekler'
      ],
      resources: [
        { name: 'TÜBİTAK Açık Bilim Politikası', url: '#' },
        { name: 'Creative Commons Türkiye', url: 'https://creativecommons.org.tr' }
      ]
    }
  }
];

export default function PrincipleDetailPage() {
  const [activeTab, setActiveTab] = useState('findable');
  const [checklists, setChecklists] = useState<Record<string, boolean>>({});

  // Sync with URL hash on component mount and hash changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && principleData.some(p => p.id === hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  // Update URL when tab changes
  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value);
      // Update URL hash without causing page reload
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', `#${value}`);
      }
    }
  };

  const toggleChecklist = (id: string) => {
    setChecklists(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getChecklistProgress = (principle: any) => {
    const completed = principle.checklist.filter((item: any) => checklists[item.id]).length;
    return (completed / principle.checklist.length) * 100;
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Hero Section */}
        <Stack align="center" ta="center" gap="xl" py="xl">
          <Stack gap="md" align="center">
            <Title order={1} size="h1" className="fairveri-gradient-text">
              FAIR Veri Prensipleri
            </Title>
            <Text size="xl" c="dimmed" maw={900} ta="center">
              FAIR (Findable, Accessible, Interoperable, Reusable) veri prensipleri, 
              araştırma verilerinin bilim insanları, kurumlar ve makineler tarafından 
              daha kolay bulunabilir, erişilebilir, birbirleriyle uyumlu ve yeniden 
              kullanılabilir olmasını sağlayan temel rehber ilkelerdir.
            </Text>
          </Stack>
        </Stack>

        {/* Principle Overview Cards */}
        <Grid>
          {principleData.map((principle) => (
            <Grid.Col key={principle.id} span={{ base: 12, md: 6, lg: 3 }}>
              <MantineCard 
                className="fairveri-card-hover" 
                p="lg" 
                h={240}
                style={{
                  borderLeft: `4px solid ${principle.color}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleTabChange(principle.id)}
              >
                <Stack align="center" justify="center" h="100%" gap="md">
                  <Text size="4rem" style={{ margin: 0 }}>{principle.icon}</Text>
                  <div style={{ textAlign: 'center' }}>
                    <Title order={4} ta="center" mb="xs">
                      {principle.principle.split(' - ')[0]}
                    </Title>
                    <Title order={5} ta="center" fw={400} c="dimmed" mb="xs">
                      {principle.principle.split(' - ')[1].replace(/[()]/g, '')}
                    </Title>
                    <Text size="sm" c="dimmed" ta="center">
                      {principle.subPrinciples.length} alt prensip
                    </Text>
                  </div>
                </Stack>
              </MantineCard>
            </Grid.Col>
          ))}
        </Grid>

        {/* Detailed Principles */}
        <MantineCard p="xl">
          <Stack gap="xl">
            <div style={{ textAlign: 'center' }}>
              <Title order={2} mb="md">Detaylı FAIR Prensipleri</Title>
              <Text c="dimmed" size="lg">
                Her FAIR prensibini derinlemesine keşfedin, pratik örnekler ve araçlarla verilerinizi FAIR yapın.
              </Text>
            </div>

            <Tabs value={activeTab} onChange={handleTabChange} variant="outline">
              <Tabs.List grow>
                {principleData.map((principle) => (
                  <Tabs.Tab 
                    key={principle.id} 
                    value={principle.id}
                    leftSection={<span style={{ fontSize: '1.2rem' }}>{principle.icon}</span>}
                  >
                    {principle.principle.split(' - ')[0]}
                  </Tabs.Tab>
                ))}
              </Tabs.List>

              {principleData.map((principle) => (
                <Tabs.Panel key={principle.id} value={principle.id} pt="xl">
                  <Stack gap="xl">
                    {/* Principle Header */}
                    <div style={{ textAlign: 'center' }}>
                      <Title order={3} c={principle.color} mb="md">
                        {principle.principle}
                      </Title>
                      <Text size="lg" c="dimmed" maw={800} style={{ margin: '0 auto' }}>
                        {principle.description}
                      </Text>
                    </div>

                    {/* Why Important Section */}
                    <Alert icon={<IconBulb size="1rem" />} title="Neden Önemli?" color={principle.color} variant="light">
                      <Text size="sm">{principle.whyImportant}</Text>
                    </Alert>

                    {/* Sub-principles */}
                    <div>
                      <Title order={4} mb="lg">Alt Prensipler</Title>
                      <Stack gap="md">
                        {principle.subPrinciples.map((subPrinciple) => (
                          <MantineCard key={subPrinciple.id} p="lg" withBorder>
                            <Stack gap="md">
                              <div>
                                <Title order={5} fw={600} mb="xs">
                                  {subPrinciple.title}
                                </Title>
                                <Text size="sm" c="dimmed" mb="md">
                                  {subPrinciple.description}
                                </Text>
                              </div>
                              
                              {subPrinciple.examples && (
                                <div>
                                  <Text fw={500} size="sm" mb="xs">Örnekler:</Text>
                                  <List size="sm" spacing="xs">
                                    {subPrinciple.examples.map((example, idx) => (
                                      <List.Item key={idx}>
                                        <Code>{example}</Code>
                                      </List.Item>
                                    ))}
                                  </List>
                                </div>
                              )}
                              
                              {subPrinciple.tools && (
                                <div>
                                  <Text fw={500} size="sm" mb="xs">Araçlar:</Text>
                                  <Group gap="xs">
                                    {subPrinciple.tools.map((tool, idx) => (
                                      <Badge 
                                        key={idx} 
                                        variant="light" 
                                        color={principle.color}
                                        component="a"
                                        href={tool.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ 
                                          cursor: 'pointer',
                                          textDecoration: 'none'
                                        }}
                                      >
                                        {tool.name} ↗
                                      </Badge>
                                    ))}
                                  </Group>
                                </div>
                              )}
                            </Stack>
                          </MantineCard>
                        ))}
                      </Stack>
                    </div>

                    {/* Best Practices & Common Mistakes */}
                    <Grid>
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <MantineCard p="lg" withBorder h="100%">
                          <Stack gap="md">
                            <Group>
                              <ThemeIcon color="green" size="lg">
                                <IconCheck size="1.2rem" />
                              </ThemeIcon>
                              <Title order={5}>En İyi Uygulamalar</Title>
                            </Group>
                            <List spacing="sm" size="sm">
                              {principle.bestPractices.map((practice, idx) => (
                                <List.Item 
                                  key={idx}
                                  icon={<ThemeIcon color="green" size="sm"><IconCheck size="0.8rem" /></ThemeIcon>}
                                >
                                  {practice}
                                </List.Item>
                              ))}
                            </List>
                          </Stack>
                        </MantineCard>
                      </Grid.Col>
                      
                      <Grid.Col span={{ base: 12, md: 6 }}>
                        <MantineCard p="lg" withBorder h="100%">
                          <Stack gap="md">
                            <Group>
                              <ThemeIcon color="red" size="lg">
                                <IconX size="1.2rem" />
                              </ThemeIcon>
                              <Title order={5}>Yaygın Hatalar</Title>
                            </Group>
                            <List spacing="sm" size="sm">
                              {principle.commonMistakes.map((mistake, idx) => (
                                <List.Item 
                                  key={idx}
                                  icon={<ThemeIcon color="red" size="sm"><IconX size="0.8rem" /></ThemeIcon>}
                                >
                                  {mistake}
                                </List.Item>
                              ))}
                            </List>
                          </Stack>
                        </MantineCard>
                      </Grid.Col>
                    </Grid>

                    {/* Interactive Checklist */}
                    <MantineCard p="lg" withBorder>
                      <Stack gap="md">
                        <Group justify="space-between">
                          <Group>
                            <ThemeIcon color={principle.color} size="lg">
                              <IconTarget size="1.2rem" />
                            </ThemeIcon>
                            <Title order={5}>Kontrol Listesi</Title>
                          </Group>
                          <Badge color={principle.color} size="lg">
                            {Math.round(getChecklistProgress(principle))}% Tamamlandı
                          </Badge>
                        </Group>
                        
                        <Progress value={getChecklistProgress(principle)} color={principle.color} size="sm" />
                        
                        <Stack gap="xs">
                          {principle.checklist.map((item) => (
                            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <input
                                type="checkbox"
                                checked={checklists[item.id] || false}
                                onChange={() => toggleChecklist(item.id)}
                                style={{ cursor: 'pointer' }}
                              />
                              <Text size="sm" style={{ cursor: 'pointer' }} onClick={() => toggleChecklist(item.id)}>
                                {item.label}
                              </Text>
                              <Tooltip
                                label={item.tooltip}
                                multiline
                                w={280}
                                withArrow
                                position="top"
                              >
                                <ThemeIcon
                                  variant="light"
                                  color="blue"
                                  size="sm"
                                  style={{ cursor: 'help', marginLeft: '0.25rem' }}
                                >
                                  <IconInfoCircle size="0.8rem" />
                                </ThemeIcon>
                              </Tooltip>
                            </div>
                          ))}
                        </Stack>
                      </Stack>
                    </MantineCard>

                    {/* Turkey Context */}
                    <MantineCard p="lg" withBorder style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
                      <Stack gap="md">
                        <Group>
                          <Text size="xl">🇹🇷</Text>
                          <Title order={5}>{principle.turkeyContext.title}</Title>
                        </Group>
                        
                        <List spacing="sm" size="sm">
                          {principle.turkeyContext.content.map((item, idx) => (
                            <List.Item key={idx}>{item}</List.Item>
                          ))}
                        </List>
                        
                        <div>
                          <Text fw={500} size="sm" mb="xs">İlgili Kaynaklar:</Text>
                          <Group gap="sm">
                            {principle.turkeyContext.resources.map((resource, idx) => (
                              <Button
                                key={idx}
                                component="a"
                                href={resource.url}
                                target="_blank"
                                variant="light"
                                color={principle.color}
                                size="sm"
                                rightSection={<IconExternalLink size="0.9rem" />}
                              >
                                {resource.name}
                              </Button>
                            ))}
                          </Group>
                        </div>
                      </Stack>
                    </MantineCard>
                  </Stack>
                </Tabs.Panel>
              ))}
            </Tabs>
          </Stack>
        </MantineCard>

        {/* Implementation Guide */}
        <MantineCard p="xl" className="fairveri-card-hover">
          <Stack gap="lg">
            <Title order={3} ta="center">FAIR Prensiplerini Uygulamak</Title>
            <Text c="dimmed" ta="center" size="lg">
              Bu prensipleri verilerinize uygulamak için pratik adımlar ve araçlar keşfedin.
            </Text>
            
            <Grid mt="lg">
              <Grid.Col span={{ base: 12, md: 4 }}>
                <MantineCard p="md" className="fairveri-card-hover" h="100%">
                  <Stack align="center" ta="center">
                    <Text size="2rem">📊</Text>
                    <Title order={4}>Değerlendirme</Title>
                    <Text size="sm" c="dimmed">
                      Mevcut verilerinizin FAIR seviyesini ölçün
                    </Text>
                    <Button 
                      component="a" 
                      href="/assessment" 
                      variant="light" 
                      size="sm"
                    >
                      Değerlendirmeye Başla
                    </Button>
                  </Stack>
                </MantineCard>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 4 }}>
                <MantineCard p="md" className="fairveri-card-hover" h="100%">
                  <Stack align="center" ta="center">
                    <Text size="2rem">🛠️</Text>
                    <Title order={4}>Araçlar</Title>
                    <Text size="sm" c="dimmed">
                      FAIR uygulaması için pratik araçları keşfedin
                    </Text>
                    <Button 
                      component="a" 
                      href="/tools" 
                      variant="light" 
                      size="sm"
                    >
                      Araçları Gör
                    </Button>
                  </Stack>
                </MantineCard>
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: 4 }}>
                <MantineCard p="md" className="fairveri-card-hover" h="100%">
                  <Stack align="center" ta="center">
                    <Text size="2rem">📚</Text>
                    <Title order={4}>Örnekler</Title>
                    <Text size="sm" c="dimmed">
                      Başarılı FAIR uygulamalarından öğrenin
                    </Text>
                    <Button 
                      component="a" 
                      href="/examples" 
                      variant="light" 
                      size="sm"
                    >
                      Örnekleri İncele
                    </Button>
                  </Stack>
                </MantineCard>
              </Grid.Col>
            </Grid>
          </Stack>
        </MantineCard>

        {/* Success Stories */}
        <MantineCard p="xl" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Stack gap="lg" align="center" ta="center">
            <IconTrophy size={48} />
            <Title order={3} style={{ color: 'white' }}>Başarı Hikayeleri</Title>
            <Text size="lg" style={{ color: 'white', opacity: 0.9 }}>
              Türkiye'den ve dünyadan FAIR veri prensiplerini başarıyla uygulayan projeler
            </Text>
            <Button 
              variant="white" 
              color="dark"
              component="a"
              href="/examples"
            >
              Başarı Hikayelerini Keşfet
            </Button>
          </Stack>
        </MantineCard>
      </Stack>
    </Container>
  );
}