import { Metadata } from 'next'
import {
  Container,
  Card,
  Badge,
  Title,
  Text,
  Stack,
  Group,
  Grid,
  ThemeIcon
} from '@mantine/core'
import { IconInfoCircle, IconSearch, IconFilter, IconLink } from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'FAIR Veri Sözlüğü | FairVeri',
  description: 'FAIR veri yönetimi ile ilgili terimler ve açıklamaları - kapsamlı sözlük ve referans kaynağı',
  keywords: ['FAIR sözlük', 'veri terimleri', 'metadata', 'ontoloji', 'veri yönetimi terimleri', 'açık veri'],
  openGraph: {
    title: 'FAIR Veri Sözlüğü',
    description: 'FAIR veri yönetimi ile ilgili terimler ve açıklamalarını içeren kapsamlı sözlük',
    type: 'website',
  },
}

export default function GlossaryPage() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack align="center" ta="center" gap="xl" py="xl">
          <Title order={1} size="h1">
            FAIR Veri Sözlüğü
          </Title>
          <Text size="xl" c="dimmed" maw={900} ta="center">
            FAIR veri yönetimi ile ilgili terimler, açıklamalar ve referanslar - kapsamlı sözlük ve rehber kaynağınız
          </Text>
        </Stack>

        <Card p="xl" withBorder>
          <Stack gap="md" align="center">
            <Title order={3}>Sözlük Özelliği Geliştiriliyor</Title>
            <Text c="dimmed" ta="center">
              FAIR veri terimleri sözlüğü yakında hazır olacak. 
              Şimdilik diğer bölümlerden yararlanabilirsiniz.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}