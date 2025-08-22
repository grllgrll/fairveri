import { Metadata } from 'next'
import {
  Container,
  Card,
  Title,
  Text,
  Stack
} from '@mantine/core'

export const metadata: Metadata = {
  title: 'FAIR Uygulama Yol Haritası | FairVeri',
  description: 'Verilerinizi FAIR prensiplere uygun hale getirmek için adım adım rehber ve ilerleme takibi',
  keywords: ['FAIR yol haritası', 'veri yönetimi planı', 'uygulama rehberi', 'FAIR dönüşüm', 'veri standardları'],
  openGraph: {
    title: 'FAIR Uygulama Yol Haritası',
    description: 'Verilerinizi FAIR prensiplere uygun hale getirmek için kapsamlı rehber',
    type: 'website',
  },
}

export default function RoadmapPage() {
  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Stack align="center" ta="center" gap="xl" py="xl">
          <Title order={1} size="h1">
            FAIR Uygulama Yol Haritası
          </Title>
          <Text size="xl" c="dimmed" maw={900} ta="center">
            Verilerinizi FAIR prensiplere uygun hale getirmek için kapsamlı, adım adım rehber ve kişiselleştirilmiş ilerleme takibi
          </Text>
        </Stack>

        <Card p="xl" withBorder>
          <Stack gap="md" align="center">
            <Title order={3}>Yol Haritası Özelliği Geliştiriliyor</Title>
            <Text c="dimmed" ta="center">
              FAIR uygulama yol haritası yakında hazır olacak. 
              Şimdilik öğrenme modüllerinden yararlanabilirsiniz.
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  )
}