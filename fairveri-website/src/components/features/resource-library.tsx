'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Book, Globe, GraduationCap, Users, Zap, Star, Filter, FileText, Link } from 'lucide-react'
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Badge, 
  Button, 
  Group, 
  Stack, 
  Grid, 
  TextInput,
  Select,
  Tabs,
  Divider,
  Anchor
} from '@mantine/core'
import { cn } from '@/lib/utils'
import resourcesData from '@/data/resources.json'

interface ResourceLibraryProps {
  className?: string
  showFilters?: boolean
  showQuickLinks?: boolean
  featuredOnly?: boolean
}

const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ 
  className, 
  showFilters = true, 
  showQuickLinks = true, 
  featuredOnly = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('all')
  const [selectedDomain, setSelectedDomain] = useState('all')
  const [activeCategory, setActiveCategory] = useState('foundational')

  const categories = resourcesData.resources.categories
  const quickLinks = resourcesData.quickLinks || { title: 'Hızlı Bağlantılar', essential: [] }

  const filteredResources = categories.find(cat => cat.id === activeCategory)?.items.filter(resource => {
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesType = selectedType === 'all' || resource.type === selectedType
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage
    const matchesDomain = selectedDomain === 'all' || resource.domain === selectedDomain

    return matchesSearch && matchesType && matchesLanguage && matchesDomain
  }) || []

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />
      case 'website': return <Globe className="h-4 w-4" />
      case 'guide': return <Book className="h-4 w-4" />
      case 'course': return <GraduationCap className="h-4 w-4" />
      case 'platform': return <Zap className="h-4 w-4" />
      case 'community': return <Users className="h-4 w-4" />
      case 'standard': return <Star className="h-4 w-4" />
      default: return <Link className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article': return 'blue'
      case 'website': return 'green'
      case 'guide': return 'orange'
      case 'course': return 'grape'
      case 'platform': return 'pink'
      case 'community': return 'gray'
      case 'standard': return 'indigo'
      default: return 'gray'
    }
  }

  const getLanguageBadge = (language: string) => {
    switch (language) {
      case 'tr': return { label: 'Türkçe', variant: 'green' }
      case 'en': return { label: 'English', variant: 'blue' }
      default: return { label: language, variant: 'gray' }
    }
  }

  const getDomainBadge = (domain: string) => {
    switch (domain) {
      case 'general': return { label: 'Genel', variant: 'outline' as const }
      case 'research-data': return { label: 'Araştırma Verisi', variant: 'info' as const }
      case 'social-sciences': return { label: 'Sosyal Bilimler', variant: 'purple' as const }
      case 'biodiversity': return { label: 'Biyoçeşitlilik', variant: 'success' as const }
      case 'chemistry': return { label: 'Kimya', variant: 'warning' as const }
      case 'healthcare': return { label: 'Sağlık', variant: 'destructive' as const }
      default: return { label: domain, variant: 'outline' as const }
    }
  }

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'foundational': return '📚'
      case 'turkish': return '🇹🇷'
      case 'education': return '🎓'
      case 'standards': return '⚙️'
      case 'communities': return '👥'
      case 'funding': return '💰'
      case 'projects': return '🚀'
      default: return '📄'
    }
  }

  return (
    <Stack gap="xl" className={className}>
      {/* Header */}
      <Stack align="center" ta="center" gap="md">
        <Title order={2} size="h2">
          {resourcesData.resources.title}
        </Title>
        <Text size="lg" c="dimmed">
          {resourcesData.resources.description}
        </Text>
      </Stack>

      {/* Quick Links */}
      {showQuickLinks && (
        <Card className="fairveri-card-hover">
          <Card.Section inheritPadding py="md">
            <Group>
              <Zap size={20} />
              <Title order={3}>{quickLinks.title}</Title>
            </Group>
          </Card.Section>
          <Card.Section inheritPadding pb="md">
            <Grid>
              {quickLinks.essential?.map((link, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, lg: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="fairveri-card-hover" h="100%">
                      <Stack gap="md">
                        <Title order={4}>{link.title}</Title>
                        <Text size="sm" c="dimmed">
                          {link.description}
                        </Text>
                        <Button 
                          component="a"
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="light"
                          fullWidth
                          rightSection={<ExternalLink size={16} />}
                        >
                          Ziyaret Et
                        </Button>
                      </Stack>
                    </Card>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>
          </Card.Section>
        </Card>
      )}

      {/* Search and Filters */}
      {showFilters && (
        <Card className="fairveri-card-hover">
          <Card.Section inheritPadding py="md">
            <Group>
              <Filter size={20} />
              <Title order={3}>Kaynakları Filtrele</Title>
            </Group>
          </Card.Section>
          <Card.Section inheritPadding pb="md">
            <Stack gap="md">
              <TextInput
                placeholder="Kaynak başlığı veya açıklama ile ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <Group>
                <Select
                  label="Tür"
                  value={selectedType}
                  onChange={(value) => setSelectedType(value || 'all')}
                  data={[
                    { value: 'all', label: 'Tüm Türler' },
                    { value: 'article', label: 'Makale' },
                    { value: 'website', label: 'Web Sitesi' },
                    { value: 'guide', label: 'Rehber' },
                    { value: 'course', label: 'Kurs' },
                    { value: 'platform', label: 'Platform' },
                    { value: 'community', label: 'Topluluk' },
                    { value: 'standard', label: 'Standard' }
                  ]}
                />
                
                <Select
                  label="Dil"
                  value={selectedLanguage}
                  onChange={(value) => setSelectedLanguage(value || 'all')}
                  data={[
                    { value: 'all', label: 'Tüm Diller' },
                    { value: 'tr', label: 'Türkçe' },
                    { value: 'en', label: 'İngilizce' }
                  ]}
                />
                
                <Select
                  label="Alan"
                  value={selectedDomain}
                  onChange={(value) => setSelectedDomain(value || 'all')}
                  data={[
                    { value: 'all', label: 'Tüm Alanlar' },
                    { value: 'general', label: 'Genel' },
                    { value: 'research-data', label: 'Araştırma Verisi' },
                    { value: 'social-sciences', label: 'Sosyal Bilimler' },
                    { value: 'biodiversity', label: 'Biyoçeşitlilik' },
                    { value: 'chemistry', label: 'Kimya' },
                    { value: 'healthcare', label: 'Sağlık' }
                  ]}
                />
              </Group>
            </Stack>
          </Card.Section>
        </Card>
      )}

      {/* Categories using Mantine Tabs */}
      <Tabs value={activeCategory} onChange={setActiveCategory}>
        <Tabs.List>
          {categories.map((category) => (
            <Tabs.Tab 
              key={category.id} 
              value={category.id}
            >
              <Stack align="center" gap="xs">
                <Text size="lg">{getCategoryIcon(category.id)}</Text>
                <Text size="xs" ta="center">{category.title}</Text>
              </Stack>
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {categories.map((category) => (
          <Tabs.Panel key={category.id} value={category.id} pt="md">
            <Stack gap="md">
              <Stack align="center" ta="center" gap="xs">
                <Title order={3}>{category.title}</Title>
                <Text c="dimmed">{category.description}</Text>
              </Stack>
              
              <Text size="sm" c="dimmed">
                {filteredResources.length} kaynak bulundu
              </Text>

              <Grid>
                {filteredResources.map((resource, index) => (
                  <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="fairveri-card-hover" h="100%">
                        <Stack gap="md">
                          <Group>
                            {getTypeIcon(resource.type)}
                            <Title order={4}>{resource.title}</Title>
                          </Group>
                          
                          {resource.authors && (
                            <Text size="sm" c="dimmed">
                              {resource.authors} ({resource.year})
                            </Text>
                          )}
                          
                          {resource.organization && (
                            <Text size="sm" c="dimmed">
                              {resource.organization}
                            </Text>
                          )}
                          
                          <Text size="sm">
                            {resource.description}
                          </Text>
                          
                          <Group gap="xs">
                            <Badge variant="light" color={getTypeColor(resource.type)}>
                              {resource.type === 'article' ? 'Makale' :
                               resource.type === 'website' ? 'Web Sitesi' :
                               resource.type === 'guide' ? 'Rehber' :
                               resource.type === 'course' ? 'Kurs' :
                               resource.type === 'platform' ? 'Platform' :
                               resource.type === 'community' ? 'Topluluk' :
                               resource.type === 'standard' ? 'Standard' : resource.type}
                            </Badge>
                            
                            {resource.language && (
                              <Badge variant="light" color={getLanguageBadge(resource.language).variant as any}>
                                {getLanguageBadge(resource.language).label}
                              </Badge>
                            )}
                          </Group>

                          {resource.url ? (
                            <Button 
                              component="a"
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              variant="light"
                              fullWidth
                              rightSection={<ExternalLink size={16} />}
                            >
                              Ziyaret Et
                            </Button>
                          ) : (
                            <Button disabled variant="light" fullWidth>
                              Bağlantı Mevcut Değil
                            </Button>
                          )}
                        </Stack>
                      </Card>
                    </motion.div>
                  </Grid.Col>
                ))}
              </Grid>

              {filteredResources.length === 0 && (
                <Stack align="center" py="xl">
                  <Text c="dimmed">
                    Arama kriterlerinize uygun kaynak bulunamadı.
                  </Text>
                </Stack>
              )}
            </Stack>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  )
}

export default ResourceLibrary