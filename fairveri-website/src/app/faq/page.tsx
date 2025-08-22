import { Metadata } from 'next'
import FAQSection from '@/components/features/faq-section'
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Badge, 
  Button, 
  Group, 
  Stack, 
  SimpleGrid,
  Anchor,
  rem
} from '@mantine/core'
import { 
  IconHelpCircle, 
  IconMessageCircle, 
  IconBook, 
  IconUsers, 
  IconArrowRight 
} from '@tabler/icons-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sık Sorulan Sorular | FairVeri',
  description: 'FAIR veri prensipleri hakkında en çok sorulan sorular ve detaylı yanıtları. Teknik, hukuki ve kurumsal konularda rehberlik.',
  keywords: ['FAIR sorular', 'veri yönetimi sorular', 'açık veri', 'metadata', 'lisans', 'veri paylaşımı', 'KVKK', 'GDPR'],
  openGraph: {
    title: 'Sık Sorulan Sorular - FAIR Veri',
    description: 'FAIR veri prensipleri hakkında en çok sorulan sorular ve detaylı yanıtları',
    type: 'website',
  },
}

export default function FAQPage() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        {/* Hero Section */}
        <Stack align="center" gap="xl" py={rem(48)}>
          <Stack align="center" gap="sm">
            <Title 
              order={1} 
              size={rem(48)} 
              ta="center"
              className="fairveri-gradient-text"
            >
              Sık Sorulan Sorular
            </Title>
            <Text 
              size="xl" 
              c="dimmed" 
              ta="center" 
              maw={rem(800)}
            >
              FAIR veri prensipleri hakkında en çok sorulan sorular ve detaylı yanıtları. 
              Genel kavramlardan teknik detaylara, hukuki hususlardan kurumsal uygulamalara kadar kapsamlı rehberlik.
            </Text>
          </Stack>
          
          <Group justify="center" gap="md">
            <Badge 
              color="navy" 
              variant="light" 
              size="lg"
              leftSection={<IconHelpCircle style={{ width: rem(16), height: rem(16) }} />}
            >
              25+ Soru
            </Badge>
            <Badge 
              color="success" 
              variant="light" 
              size="lg"
              leftSection={<IconMessageCircle style={{ width: rem(16), height: rem(16) }} />}
            >
              Detaylı Yanıtlar
            </Badge>
            <Badge 
              color="warning" 
              variant="light" 
              size="lg"
              leftSection={<IconBook style={{ width: rem(16), height: rem(16) }} />}
            >
              Pratik Öneriler
            </Badge>
          </Group>
        </Stack>

        {/* Quick Help */}
        <Card 
          className="fairveri-card-hover"
          style={{ 
            background: 'linear-gradient(135deg, #eff6ff 0%, #ecfdf5 100%)' 
          }}
        >
          <Stack gap="md">
            <Group gap="sm">
              <IconMessageCircle size={20} />
              <Title order={3}>Hızlı Yardım</Title>
            </Group>
            <Text c="dimmed">
              En sık sorulan sorulara hızlı erişim
            </Text>
            
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <Stack gap="md">
                <Title order={4}>Acil Sorular</Title>
                <Stack gap="xs">
                  <Button 
                    variant="subtle" 
                    justify="flex-start" 
                    component="a" 
                    href="#fair-vs-open"
                    h="auto"
                    p="md"
                  >
                    <Stack gap={4} align="flex-start">
                      <Text fw={500}>FAIR vs Açık Veri</Text>
                      <Text size="sm" c="dimmed">Temel fark nedir?</Text>
                    </Stack>
                  </Button>
                  <Button 
                    variant="subtle" 
                    justify="flex-start" 
                    component="a" 
                    href="#minimum-requirements"
                    h="auto"
                    p="md"
                  >
                    <Stack gap={4} align="flex-start">
                      <Text fw={500}>Minimum Gereksinimler</Text>
                      <Text size="sm" c="dimmed">Nereden başlamalı?</Text>
                    </Stack>
                  </Button>
                  <Button 
                    variant="subtle" 
                    justify="flex-start" 
                    component="a" 
                    href="#license-choice"
                    h="auto"
                    p="md"
                  >
                    <Stack gap={4} align="flex-start">
                      <Text fw={500}>Lisans Seçimi</Text>
                      <Text size="sm" c="dimmed">Hangi lisansı kullanmalı?</Text>
                    </Stack>
                  </Button>
                </Stack>
              </Stack>
              
              <Stack gap="md">
                <Title order={4}>Teknik Destek</Title>
                <Stack gap="xs">
                  <Button 
                    variant="subtle" 
                    justify="flex-start" 
                    component="a" 
                    href="#file-formats"
                    h="auto"
                    p="md"
                  >
                    <Stack gap={4} align="flex-start">
                      <Text fw={500}>Dosya Formatları</Text>
                      <Text size="sm" c="dimmed">Hangi formatlar uygun?</Text>
                    </Stack>
                  </Button>
                  <Button 
                    variant="subtle" 
                    justify="flex-start" 
                    component="a" 
                    href="#large-datasets"
                    h="auto"
                    p="md"
                  >
                    <Stack gap={4} align="flex-start">
                      <Text fw={500}>Büyük Veri Setleri</Text>
                      <Text size="sm" c="dimmed">Nasıl yönetilir?</Text>
                    </Stack>
                  </Button>
                  <Button 
                    variant="subtle" 
                    justify="flex-start" 
                    component="a" 
                    href="#personal-data"
                    h="auto"
                    p="md"
                  >
                    <Stack gap={4} align="flex-start">
                      <Text fw={500}>Kişisel Veri</Text>
                      <Text size="sm" c="dimmed">KVKK uyumu nasıl sağlanır?</Text>
                    </Stack>
                  </Button>
                </Stack>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Category Overview */}
        <SimpleGrid cols={{ base: 1, md: 2, lg: 4 }} spacing="lg">
          <Card className="fairveri-card-hover">
            <Stack gap="md">
              <Group gap="sm">
                <Text size={rem(32)}>❓</Text>
                <Title order={4}>Genel Sorular</Title>
              </Group>
              <Text size="sm" c="dimmed">
                FAIR'in temel kavramları ve faydaları
              </Text>
              <Stack gap={4}>
                <Text size="sm">• FAIR vs Açık Veri farkı</Text>
                <Text size="sm">• Zaman ve maliyet analizi</Text>
                <Text size="sm">• Minimum gereksinimler</Text>
                <Text size="sm">• Beklenen faydalar</Text>
              </Stack>
            </Stack>
          </Card>

          <Card className="fairveri-card-hover">
            <Stack gap="md">
              <Group gap="sm">
                <Text size={rem(32)}>🔧</Text>
                <Title order={4}>Teknik Sorular</Title>
              </Group>
              <Text size="sm" c="dimmed">
                Formatlar, araçlar ve uygulama
              </Text>
              <Stack gap={4}>
                <Text size="sm">• Dosya formatları</Text>
                <Text size="sm">• Büyük veri setleri</Text>
                <Text size="sm">• Versiyon kontrolü</Text>
                <Text size="sm">• Metadata otomasyonu</Text>
              </Stack>
            </Stack>
          </Card>

          <Card className="fairveri-card-hover">
            <Stack gap="md">
              <Group gap="sm">
                <Text size={rem(32)}>⚖️</Text>
                <Title order={4}>Hukuki Sorular</Title>
              </Group>
              <Text size="sm" c="dimmed">
                Lisanslar ve kişisel veri koruması
              </Text>
              <Stack gap={4}>
                <Text size="sm">• Lisans seçimi</Text>
                <Text size="sm">• Kişisel veri (KVKK)</Text>
                <Text size="sm">• Ticari veri koruması</Text>
                <Text size="sm">• Fikri mülkiyet hakları</Text>
              </Stack>
            </Stack>
          </Card>

          <Card className="fairveri-card-hover">
            <Stack gap="md">
              <Group gap="sm">
                <Text size={rem(32)}>🏛️</Text>
                <Title order={4}>Kurumsal Sorular</Title>
              </Group>
              <Text size="sm" c="dimmed">
                Kurumsal uygulama ve politikalar
              </Text>
              <Stack gap={4}>
                <Text size="sm">• Kurumsal teşvik</Text>
                <Text size="sm">• Altyapı gereksinimleri</Text>
                <Text size="sm">• Eğitim programları</Text>
                <Text size="sm">• Fon uyumluluğu</Text>
              </Stack>
            </Stack>
          </Card>
        </SimpleGrid>

        {/* Main FAQ Section */}
        <FAQSection 
          showSearch={true}
          showCategories={true}
          featured={false}
        />

        {/* Community Support */}
        <Card 
          className="fairveri-card-hover"
          style={{ 
            background: 'linear-gradient(135deg, #faf5ff 0%, #fdf2f8 100%)' 
          }}
        >
          <Stack gap="md">
            <Group gap="sm">
              <IconUsers size={20} />
              <Title order={3}>Topluluk Desteği</Title>
            </Group>
            <Text c="dimmed">
              Sorunuz burada yanıtlanmamış mı? Topluluktan destek alın
            </Text>
            
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <Stack gap="md">
                <Title order={4}>Türkiye Toplulukları</Title>
                <Stack gap="xs">
                  <Group gap="sm">
                    <Badge variant="outline" color="green">Aktif</Badge>
                    <Text size="sm">Açık Bilim Türkiye</Text>
                  </Group>
                  <Group gap="sm">
                    <Badge variant="outline" color="blue">Resmi</Badge>
                    <Text size="sm">TÜBİTAK Destek</Text>
                  </Group>
                  <Group gap="sm">
                    <Badge variant="outline" color="teal">Akademik</Badge>
                    <Text size="sm">Üniversite Kütüphaneleri</Text>
                  </Group>
                </Stack>
              </Stack>
              
              <Stack gap="md">
                <Title order={4}>Uluslararası Kaynaklar</Title>
                <Stack gap="xs">
                  <Group gap="sm">
                    <Badge variant="outline" color="navy">Global</Badge>
                    <Text size="sm">GO FAIR Community</Text>
                  </Group>
                  <Group gap="sm">
                    <Badge variant="outline" color="electricBlue">Teknik</Badge>
                    <Text size="sm">Research Data Alliance</Text>
                  </Group>
                  <Group gap="sm">
                    <Badge variant="outline" color="warning">Eğitim</Badge>
                    <Text size="sm">FOSTER Open Science</Text>
                  </Group>
                </Stack>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Contact Information */}
        <Card className="fairveri-card-hover">
          <Stack gap="md">
            <Title order={3}>Sorunuz Yanıtlanmadı mı?</Title>
            <Text c="dimmed">
              Ek sorularınız için aşağıdaki kanallardan ulaşabilirsiniz
            </Text>
            
            <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
              <Stack gap="sm">
                <Title order={4}>Teknik Destek</Title>
                <Text size="sm" c="dimmed">
                  Araçlar ve uygulama konularında destek
                </Text>
                <Button 
                  variant="outline" 
                  size="sm" 
                  component="a" 
                  href="mailto:teknik@fairveri.org"
                >
                  İletişime Geç
                </Button>
              </Stack>
              
              <Stack gap="sm">
                <Title order={4}>Kurumsal Danışmanlık</Title>
                <Text size="sm" c="dimmed">
                  Kurumsal uygulama ve politika desteği
                </Text>
                <Button 
                  variant="outline" 
                  size="sm" 
                  component="a" 
                  href="mailto:kurumsal@fairveri.org"
                >
                  Danışmanlık Al
                </Button>
              </Stack>
              
              <Stack gap="sm">
                <Title order={4}>Eğitim Talepleri</Title>
                <Text size="sm" c="dimmed">
                  Workshop ve eğitim organizasyonu
                </Text>
                <Button 
                  variant="outline" 
                  size="sm" 
                  component="a" 
                  href="mailto:egitim@fairveri.org"
                >
                  Eğitim Talep Et
                </Button>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Card>

        {/* Next Steps */}
        <Card className="fairveri-card-hover">
          <Stack gap="md">
            <Group gap="sm">
              <IconArrowRight size={20} />
              <Title order={3}>Sonraki Adımlar</Title>
            </Group>
            <Text c="dimmed">
              Sorularınızı yanıtladıktan sonra uygulamaya geçin
            </Text>
            
            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
              <Stack gap="sm">
                <Title order={4}>Pratik Örnekleri İnceleyin</Title>
                <Text size="sm" c="dimmed">
                  Gerçek projelerden örneklerle FAIR prensiplerinin nasıl uygulandığını görün
                </Text>
                <Button 
                  variant="outline" 
                  component={Link} 
                  href="/examples"
                  rightSection={<IconArrowRight size={16} />}
                >
                  Örnekleri Görüntüle
                </Button>
              </Stack>
              
              <Stack gap="sm">
                <Title order={4}>Kaynaklara Göz Atın</Title>
                <Text size="sm" c="dimmed">
                  Detaylı rehberler, standartlar ve topluluk kaynaklarından faydalanın
                </Text>
                <Button 
                  variant="outline" 
                  component={Link} 
                  href="/resources"
                  rightSection={<IconArrowRight size={16} />}
                >
                  Kaynakları Keşfet
                </Button>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}