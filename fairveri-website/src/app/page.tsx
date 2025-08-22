'use client';

import { Container, Title, Text, Grid, Group, Stack, Box, Card as MantineCard, Button } from '@mantine/core';
import { designTokens } from '@/theme/design-tokens';
import { useTranslation } from '@/contexts/language-context';
import Link from 'next/link';

export default function BilingualHome() {
  const { t, isLoading } = useTranslation();

  // Helper function to safely get arrays from translation
  const getTranslationArray = (key: string): any[] => {
    try {
      const result = t(key, { returnObjects: true });
      if (Array.isArray(result)) {
        return result;
      }
      // Translation key did not return an array - fallback handled
      return [];
    } catch (error) {
      // Error getting translation array - fallback handled
      return [];
    }
  };

  if (isLoading) {
    return (
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </Box>
    );
  }

  // Debug: Check if basic translations are working
  const testTranslation = t('homepage.hero.subtitle');
  if (!testTranslation || testTranslation === 'homepage.hero.subtitle') {
    return (
      <Box style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Text>Translations not loaded properly. Please refresh the page.</Text>
      </Box>
    );
  }

  return (
    <Box style={{ minHeight: '100vh' }} className="safe-area-padding">
      {/* Hero Section */}
      <Box 
        style={{ 
          background: designTokens.gradients.hero,
          position: 'relative',
          paddingTop: 'clamp(2rem, 8vw, 4rem)',
          paddingBottom: 'clamp(2rem, 8vw, 4rem)',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <Box
          style={{
            position: 'absolute',
            top: '25%',
            left: '10%',
            width: 'clamp(12rem, 20vw, 18rem)',
            height: 'clamp(12rem, 20vw, 18rem)',
            background: `${designTokens.colors.primary[500]}10`,
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '25%',
            right: '10%',
            width: 'clamp(16rem, 25vw, 24rem)',
            height: 'clamp(16rem, 25vw, 24rem)',
            background: `${designTokens.colors.secondary[500]}10`,
            borderRadius: '50%',
            filter: 'blur(60px)',
          }}
        />
        
        <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
          <Stack align="center" gap="xl" ta="center">
            <Title 
              order={1} 
              style={{ 
                fontSize: 'clamp(1.75rem, 5vw, 4rem)',
                lineHeight: 1.2,
                maxWidth: '800px',
              }}
            >
              <span className="fairveri-gradient-text">FAIR</span>{' '}
              {t('fair.titleWithoutFair')}
            </Title>
            
            <Stack gap="md" align="center">
              <Text 
                style={{ 
                  fontSize: 'clamp(1rem, 3vw, 1.25rem)',
                  maxWidth: '650px',
                  lineHeight: 1.6,
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                {t('homepage.hero.subtitle')}
              </Text>
              <Text 
                c="dimmed"
                style={{ 
                  fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                  maxWidth: '550px',
                  lineHeight: 1.6,
                  textAlign: 'center',
                }}
              >
                {t('homepage.hero.description')}
              </Text>
            </Stack>
            
            <Group gap={{ base: 'sm', md: 'md' }} justify="center" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <Button 
                component={Link} 
                href="/assessment"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                size="lg"
                style={{ 
                  minWidth: 'clamp(240px, 50vw, 300px)',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                  padding: 'clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px)',
                  minHeight: '52px',
                  fontWeight: 600,
                }}
              >
                {t('homepage.hero.ctaStart')}
              </Button>
              <Button 
                component={Link} 
                href="/research"
                variant="outline"
                size="lg"
                style={{ 
                  minWidth: 'clamp(200px, 45vw, 260px)',
                  fontSize: 'clamp(0.875rem, 2.5vw, 1.125rem)',
                  padding: 'clamp(12px, 3vw, 16px) clamp(20px, 5vw, 32px)',
                  minHeight: '52px',
                  fontWeight: 600,
                }}
              >
                {t('homepage.hero.ctaExplore')}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>

      {/* FAIR Acronym Section */}
      <Box py={{ base: 'lg', md: 'xl' }} style={{ backgroundColor: designTokens.colors.neutral[50] }}>
        <Container size="xl">
          <Stack align="center" gap="xl" ta="center" mb="xl">
            <Title order={2}>{t('homepage.whatIsFair.title')}</Title>
            <Text size="xl" c="dimmed" style={{ maxWidth: '600px' }}>
              {t('homepage.whatIsFair.subtitle')}
            </Text>
          </Stack>
          
          <Grid gutter={{ base: 'md', md: 'lg' }}>
            {[
              {
                titleKey: 'fair.findable.title',
                descriptionKey: 'fair.findable.description',
                color: designTokens.colors.primary[600],
                letter: t('fair.findable.letter')
              },
              {
                titleKey: 'fair.accessible.title',
                descriptionKey: 'fair.accessible.description',
                color: designTokens.colors.success[500],
                letter: t('fair.accessible.letter')
              },
              {
                titleKey: 'fair.interoperable.title',
                descriptionKey: 'fair.interoperable.description',
                color: designTokens.colors.accent[500],
                letter: t('fair.interoperable.letter')
              },
              {
                titleKey: 'fair.reusable.title',
                descriptionKey: 'fair.reusable.description',
                color: designTokens.colors.warning[500],
                letter: t('fair.reusable.letter')
              }
            ].map((principle, index) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
                <MantineCard 
                  shadow="sm"
                  padding="lg"
                  radius="lg"
                  withBorder
                  style={{ 
                    height: '100%',
                    background: `linear-gradient(135deg, ${principle.color}08, ${principle.color}04)`,
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = designTokens.shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = designTokens.shadows.sm;
                  }}
                >
                  <Stack align="center" ta="center" gap="md">
                    <Box
                      style={{
                        width: '4rem',
                        height: '4rem',
                        borderRadius: '1rem',
                        backgroundColor: principle.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        boxShadow: designTokens.shadows.lg,
                      }}
                    >
                      {principle.letter}
                    </Box>
                    <Title order={4} ta="center">
                      {t(principle.titleKey)}
                    </Title>
                    <Text size="sm" c="dimmed" ta="center" style={{ lineHeight: 1.6 }}>
                      {t(principle.descriptionKey)}
                    </Text>
                  </Stack>
                </MantineCard>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Box py={{ base: 'lg', md: 'xl' }}>
        <Container size="xl">
          <Stack align="center" gap="xl" ta="center" mb="xl">
            <Title order={2}>{t('homepage.benefits.title')}</Title>
            <Text size="xl" c="dimmed" style={{ maxWidth: '600px' }}>
              {t('homepage.benefits.subtitle')}
            </Text>
          </Stack>
          
          <Grid gutter={{ base: 'md', md: 'lg', lg: 'xl' }}>
            {getTranslationArray('homepage.benefits.items').map((benefit: any, index: number) => (
              <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 4 }}>
                <MantineCard 
                  shadow="sm"
                  padding="lg"
                  radius="lg"
                  withBorder
                  style={{ 
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '280px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = designTokens.shadows.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = designTokens.shadows.sm;
                  }}
                >
                  <Stack align="center" ta="center" gap="md" style={{ flex: 1, justifyContent: 'space-between' }}>
                    <Stack align="center" gap="sm">
                      <Text 
                        size="2.5rem" 
                        style={{ 
                          lineHeight: 1,
                          transition: 'transform 200ms ease',
                        }}
                      >
                        {['📈', '🤝', '♻️', '⭐', '⏰', '🔒'][index]}
                      </Text>
                      <Title order={4} ta="center" c="navy" style={{ 
                        fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                        lineHeight: 1.3,
                      }}>
                        {benefit.title}
                      </Title>
                    </Stack>
                    <Text size="sm" c="dimmed" ta="center" style={{ 
                      lineHeight: 1.6,
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                    }}>
                      {benefit.description}
                    </Text>
                    {benefit.stats && (
                      <Text size="xs" fw={700} c="blue" ta="center" style={{ 
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        padding: '6px 12px',
                        borderRadius: '16px',
                        display: 'inline-block',
                        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
                      }}>
                        {benefit.stats}
                      </Text>
                    )}
                  </Stack>
                </MantineCard>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Big Data Types Section */}
      <Box py={{ base: 'lg', md: 'xl' }} style={{ backgroundColor: '#f8fafc' }}>
        <Container size="xl">
          <Stack align="center" gap="xl" ta="center" mb="xl">
            <Title order={2}>Büyük Veri Türleri</Title>
            <Text size="xl" c="dimmed" style={{ maxWidth: '800px' }}>
              Sosyal bilim anketlerinden IoT sensör verilerine, finansal işlemlerden coğrafi sistemlere kadar her türlü büyük veri için FAIR prensipleri uygulama rehberi
            </Text>
          </Stack>
          
          <Grid gutter={{ base: 'md', md: 'lg', lg: 'xl' }}>
            {/* Genomic & Biomedical Data */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <MantineCard 
                shadow="sm"
                padding="lg"
                radius="lg"
                withBorder
                style={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #3b82f610, #60a5fa10)',
                  borderColor: '#3b82f620'
                }}
              >
                <Stack gap="md">
                  <Group>
                    <Text size="2rem">🧬</Text>
                    <Title order={3} c="navy">Genomik ve Biyomedikal</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    WGS, RNA-seq, proteomik, klinik araştırma verileri için MINSEQE ve GA4GH standartları
                  </Text>
                  <Stack gap="xs">
                    <Text size="xs" fw={500}>✓ Genomik dizileme</Text>
                    <Text size="xs" fw={500}>✓ Klinik veriler</Text>
                    <Text size="xs" fw={500}>✓ Multi-omiks entegrasyon</Text>
                  </Stack>
                </Stack>
              </MantineCard>
            </Grid.Col>

            {/* Social Sciences Data */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <MantineCard 
                shadow="sm"
                padding="lg"
                radius="lg"
                withBorder
                style={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #10b98110, #34d39910)',
                  borderColor: '#10b98120'
                }}
              >
                <Stack gap="md">
                  <Group>
                    <Text size="2rem">📊</Text>
                    <Title order={3} c="navy">Sosyal Bilimler</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Anket verileri, demografik araştırmalar, sosyal ağ analizleri için DDI ve Dublin Core metadata
                  </Text>
                  <Stack gap="xs">
                    <Text size="xs" fw={500}>✓ Anket metodolojisi</Text>
                    <Text size="xs" fw={500}>✓ Demografik kodlama</Text>
                    <Text size="xs" fw={500}>✓ Etik kurul uyumluluğu</Text>
                  </Stack>
                </Stack>
              </MantineCard>
            </Grid.Col>

            {/* Engineering & IoT Data */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <MantineCard 
                shadow="sm"
                padding="lg"
                radius="lg"
                withBorder
                style={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #f5922210, #facc1510)',
                  borderColor: '#f5922220'
                }}
              >
                <Stack gap="md">
                  <Group>
                    <Text size="2rem">🏭</Text>
                    <Title order={3} c="navy">Mühendislik ve IoT</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Sensör verileri, makine öğrenimi modelleri, endüstriyel otomasyon için OPC-UA ve IEC standartları
                  </Text>
                  <Stack gap="xs">
                    <Text size="xs" fw={500}>✓ Time-series verileri</Text>
                    <Text size="xs" fw={500}>✓ Sensör kalibrasyonu</Text>
                    <Text size="xs" fw={500}>✓ Endüstri 4.0 uyumlu</Text>
                  </Stack>
                </Stack>
              </MantineCard>
            </Grid.Col>

            {/* Geographic & Environmental Data */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <MantineCard 
                shadow="sm"
                padding="lg"
                radius="lg"
                withBorder
                style={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #059f6f10, #16a34a10)',
                  borderColor: '#059f6f20'
                }}
              >
                <Stack gap="md">
                  <Group>
                    <Text size="2rem">🌍</Text>
                    <Title order={3} c="navy">Coğrafi ve Çevre</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    GIS verileri, uydu görüntüleri, meteoroloji verileri için OGC ve ISO 19115 standartları
                  </Text>
                  <Stack gap="xs">
                    <Text size="xs" fw={500}>✓ Koordinat sistemleri</Text>
                    <Text size="xs" fw={500}>✓ Raster/Vector formatları</Text>
                    <Text size="xs" fw={500}>✓ Temporal veriler</Text>
                  </Stack>
                </Stack>
              </MantineCard>
            </Grid.Col>

            {/* Financial & Economic Data */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <MantineCard 
                shadow="sm"
                padding="lg"
                radius="lg"
                withBorder
                style={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #7c3aed10, #9333ea10)',
                  borderColor: '#7c3aed20'
                }}
              >
                <Stack gap="md">
                  <Group>
                    <Text size="2rem">💰</Text>
                    <Title order={3} c="navy">Finansal ve Ekonomik</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    İşlem verileri, piyasa analizleri, risk modelleri için FIX ve ISO 20022 standartları
                  </Text>
                  <Stack gap="xs">
                    <Text size="xs" fw={500}>✓ İşlem kayıtları</Text>
                    <Text size="xs" fw={500}>✓ Risk hesaplamaları</Text>
                    <Text size="xs" fw={500}>✓ Regülasyon uyumluluğu</Text>
                  </Stack>
                </Stack>
              </MantineCard>
            </Grid.Col>

            {/* Educational & Research Data */}
            <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
              <MantineCard 
                shadow="sm"
                padding="lg"
                radius="lg"
                withBorder
                style={{ 
                  height: '100%',
                  background: 'linear-gradient(135deg, #dc268510, #f9731610)',
                  borderColor: '#dc268520'
                }}
              >
                <Stack gap="md">
                  <Group>
                    <Text size="2rem">🎓</Text>
                    <Title order={3} c="navy">Eğitim ve Araştırma</Title>
                  </Group>
                  <Text size="sm" c="dimmed">
                    Öğrenci performansı, e-öğrenme platformları, akademik yayınlar için SCORM ve LTI standartları
                  </Text>
                  <Stack gap="xs">
                    <Text size="xs" fw={500}>✓ Öğrenme analitiği</Text>
                    <Text size="xs" fw={500}>✓ Akademik metadata</Text>
                    <Text size="xs" fw={500}>✓ FERPA uyumluluğu</Text>
                  </Stack>
                </Stack>
              </MantineCard>
            </Grid.Col>
          </Grid>

          <Group justify="center" mt="xl">
            <Button
              component={Link}
              href="/genomics"
              size="lg"
              variant="gradient"
              gradient={{ from: 'navy', to: 'electricBlue' }}
              radius="full"
            >
              Genomik FAIR Rehberi
            </Button>
            <Button
              component={Link}
              href="/tools#genomic"
              size="lg"
              variant="outline"
              radius="full"
            >
              Genomik Araçları Keşfet
            </Button>
          </Group>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box py={{ base: 'lg', md: 'xl' }}>
        <Container size="xl">
          <Stack align="center" gap="xl" ta="center" mb="xl">
            <Title order={2}>{t('homepage.statistics.title')}</Title>
            <Text size="xl" c="dimmed" style={{ maxWidth: '600px' }}>
              {t('homepage.statistics.subtitle')}
            </Text>
          </Stack>
          
          <Grid gutter={{ base: 'md', md: 'lg' }}>
            {getTranslationArray('homepage.statistics.items').map((stat: any, index: number) => {
              const colors = [
                designTokens.colors.primary[600],
                designTokens.colors.success[600],
                designTokens.colors.accent[600],
                designTokens.colors.warning[600]
              ];
              const color = colors[index % colors.length];
              
              return (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 6, lg: 3 }}>
                  <MantineCard 
                    shadow="sm"
                    padding="lg"
                    radius="lg"
                    withBorder
                    style={{ 
                      height: '100%',
                      textAlign: 'center',
                      background: `linear-gradient(135deg, ${color}08, ${color}04)`,
                      borderColor: `${color}20`
                    }}
                  >
                    <Stack align="center" gap="md">
                      <Text 
                        size="3rem" 
                        fw={900} 
                        style={{ 
                          background: `linear-gradient(135deg, ${color}, ${color}BB)`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          lineHeight: 1
                        }}
                      >
                        {stat.number}
                      </Text>
                      <Title order={4} style={{ color }}>
                        {stat.label}
                      </Title>
                      <Text size="sm" c="dimmed" ta="center" style={{ lineHeight: 1.5 }}>
                        {stat.description}
                      </Text>
                    </Stack>
                  </MantineCard>
                </Grid.Col>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box 
        py={{ base: 'lg', md: 'xl' }}
        style={{
          background: designTokens.gradients.fair,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, transparent 100%)',
          }}
        />
        
        <Container size="lg" style={{ position: 'relative', zIndex: 1 }}>
          <Stack align="center" ta="center" gap="xl">
            <Stack gap="md" align="center">
              <Title order={2} c="white" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', textAlign: 'center' }}>
                {t('homepage.cta.title')}
              </Title>
              <Text size="xl" style={{ 
                opacity: 0.95, 
                maxWidth: '650px', 
                lineHeight: 1.6, 
                textAlign: 'center',
                fontSize: 'clamp(1rem, 3vw, 1.25rem)',
              }}>
                {t('homepage.cta.description')}
              </Text>
              <Group gap="xs" style={{ opacity: 0.9, justifyContent: 'center', flexWrap: 'wrap' }}>
                {getTranslationArray('homepage.cta.features').map((feature: string, index: number) => (
                  <Text key={index} size="sm" c="white" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}>
                    ✓ {feature}
                  </Text>
                ))}
              </Group>
            </Stack>
            
            <Stack gap="lg" align="center">
              <Group gap={{ base: 'sm', md: 'md' }} justify="center" style={{ flexWrap: 'wrap' }}>
                <Button 
                  component={Link} 
                  href="/assessment"
                  variant="filled"
                  color="white"
                  c="navy"
                  size="xl"
                  style={{ 
                    fontWeight: 700,
                    padding: 'clamp(14px, 3.5vw, 18px) clamp(28px, 7vw, 40px)',
                    fontSize: 'clamp(15px, 3.5vw, 20px)',
                    minWidth: 'clamp(260px, 60vw, 320px)',
                    minHeight: '56px',
                    borderRadius: '12px',
                  }}
                >
                  {t('homepage.cta.primaryButton')}
                </Button>
                <Button 
                  component={Link} 
                  href="/learn"
                  variant="outline"
                  color="white"
                  size="lg"
                  style={{ 
                    borderColor: 'rgba(255,255,255,0.4)',
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(10px)',
                    fontWeight: 600,
                    padding: 'clamp(12px, 3vw, 16px) clamp(24px, 6vw, 32px)',
                    fontSize: 'clamp(14px, 3vw, 18px)',
                    minWidth: 'clamp(220px, 55vw, 280px)',
                    minHeight: '52px',
                    borderRadius: '10px',
                  }}
                >
                  {t('homepage.cta.secondaryButton')}
                </Button>
              </Group>
              
              <Text size="sm" style={{ opacity: 0.8, textAlign: 'center' }}>
                {t('homepage.cta.tip')}
              </Text>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}