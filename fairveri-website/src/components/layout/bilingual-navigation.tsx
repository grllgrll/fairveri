'use client';

import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Group,
  Button,
  Menu,
  Burger,
  Container,
  Drawer,
  Stack,
  Text,
  Badge,
  Box,
  Divider,
} from '@mantine/core';
import {
  IconChevronDown,
} from '@tabler/icons-react';
import { designTokens } from '@/theme/design-tokens';
import { useTranslation } from '@/contexts/language-context';
import { LanguageSelector } from '@/components/ui/language-selector';

interface NavigationItem {
  titleKey: string;
  href: string;
  descriptionKey?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
}

// Navigation structure with translation keys
const getNavigationItems = (): NavigationItem[] => [
  {
    titleKey: 'navigation.principles',
    href: '/principles',
    descriptionKey: 'fair.subtitle',
    icon: '📚',
    children: [
      {
        titleKey: 'fair.findable.title',
        href: '/principles#findable',
        descriptionKey: 'fair.findable.description',
        icon: '🔍'
      },
      {
        titleKey: 'fair.accessible.title',
        href: '/principles#accessible',
        descriptionKey: 'fair.accessible.description',
        icon: '🔓'
      },
      {
        titleKey: 'fair.interoperable.title',
        href: '/principles#interoperable',
        descriptionKey: 'fair.interoperable.description',
        icon: '🔗'
      },
      {
        titleKey: 'fair.reusable.title',
        href: '/principles#reusable',
        descriptionKey: 'fair.reusable.description',
        icon: '♻️'
      }
    ]
  },
  {
    titleKey: 'navigation.tools',
    href: '/tools',
    descriptionKey: 'navigation.tools',
    icon: '🔧',
    children: [
      {
        titleKey: 'footer.links.assessmentTools',
        href: '/tools#assessment',
        descriptionKey: 'assessment.subtitle',
        icon: '📊'
      },
      {
        titleKey: 'navigation.metadataTools',
        href: '/tools#metadata',
        descriptionKey: 'accessibility.descriptions.metadataTools',
        icon: '📝'
      },
      {
        titleKey: 'navigation.dataCleaning',
        href: '/tools#cleaning',
        descriptionKey: 'accessibility.descriptions.dataCleaning',
        icon: '🧹'
      },
      {
        titleKey: 'navigation.dataRepositories',
        href: '/tools#repositories',
        descriptionKey: 'accessibility.descriptions.dataRepositories',
        icon: '🏛️'
      }
    ]
  },
  {
    titleKey: 'navigation.examples',
    href: '/examples',
    descriptionKey: 'accessibility.descriptions.examples',
    icon: '💡',
    children: [
      {
        titleKey: 'navigation.surveyData',
        href: '/examples#survey-data',
        descriptionKey: 'accessibility.descriptions.surveyData',
        icon: '📊'
      },
      {
        titleKey: 'navigation.labData',
        href: '/examples#lab-data',
        descriptionKey: 'accessibility.descriptions.labData',
        icon: '🔬'
      },
      {
        titleKey: 'navigation.softwareProject',
        href: '/examples#software-project',
        descriptionKey: 'accessibility.descriptions.softwareProject',
        icon: '💻'
      }
    ]
  },
  {
    titleKey: 'navigation.learn',
    href: '/learn',
    descriptionKey: 'accessibility.descriptions.learn',
    icon: '🎓',
    badge: 'Yeni',
    children: [
      {
        titleKey: 'navigation.gettingStarted',
        href: '/learn#basics',
        descriptionKey: 'accessibility.descriptions.gettingStarted',
        icon: '📖'
      },
      {
        titleKey: 'navigation.assessment',
        href: '/assessment',
        descriptionKey: 'assessment.subtitle',
        icon: '🎯'
      }
    ]
  },
  {
    titleKey: 'navigation.faq',
    href: '/faq',
    descriptionKey: 'accessibility.descriptions.faq',
    icon: '❓',
    children: [
      {
        titleKey: 'navigation.generalQuestions',
        href: '/faq#general',
        descriptionKey: 'accessibility.descriptions.generalQuestions',
        icon: '💭'
      },
      {
        titleKey: 'navigation.technicalQuestions',
        href: '/faq#technical',
        descriptionKey: 'accessibility.descriptions.technicalQuestions',
        icon: '⚙️'
      }
    ]
  },
  {
    titleKey: 'navigation.resources',
    href: '/resources',
    descriptionKey: 'accessibility.descriptions.resources',
    icon: '📚'
  },
  {
    titleKey: 'navigation.partners',
    href: '/partners',
    descriptionKey: 'navigation.partnersDescription',
    icon: '🤝'
  },
  {
    titleKey: 'navigation.contact',
    href: '/contact',
    descriptionKey: 'navigation.contactDescription',
    icon: '📧'
  }
];

export default function BilingualNavigation() {
  const [opened, { toggle, close }] = useDisclosure(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { t } = useTranslation();

  const navigationItems = getNavigationItems();

  // Helper function to get display text based on screen size
  const getDisplayText = (titleKey: string, useShort: boolean = false) => {
    const shortKeyMap: Record<string, string> = {
      'navigation.principles': 'navigation.principlesShort',
      'navigation.examples': 'navigation.examplesShort', 
      'navigation.faq': 'navigation.faqShort',
      'navigation.assessment': 'navigation.assessmentShort',
    };
    
    if (useShort && shortKeyMap[titleKey]) {
      return t(shortKeyMap[titleKey]);
    }
    return t(titleKey);
  };

  const isCurrentPath = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleDropdown = (title: string) => {
    setActiveDropdown(activeDropdown === title ? null : title);
  };

  return (
    <Box
      component="header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${designTokens.colors.neutral[200]}`,
        boxShadow: designTokens.shadows.sm,
      }}
      className="safe-area-padding"
    >
      <Container size="xl" style={{ maxWidth: '100%' }}>
        <Group 
          justify="space-between" 
          h={{ base: 64, md: 72 }} 
          px={{ base: 'sm', md: 'sm', xl: 'md' }}
          style={{ flexWrap: 'nowrap' }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Group gap="sm">
              <Text
                fw={800}
                variant="gradient"
                gradient={{ from: 'navy', to: 'electricBlue', deg: 45 }}
                style={{
                  fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                  lineHeight: 1.2,
                }}
              >
                FairVeri
              </Text>
            </Group>
          </Link>

          {/* Desktop Navigation - Full Version (lg+) */}
          <Group gap="md" visibleFrom="lg" style={{ flexWrap: 'nowrap' }}>
            {navigationItems.map((item) => (
              <div key={item.titleKey} style={{ position: 'relative' }}>
                {item.children ? (
                  <Menu
                    opened={activeDropdown === item.titleKey}
                    onChange={(opened) => setActiveDropdown(opened ? item.titleKey : null)}
                    trigger="click"
                    openDelay={0}
                    closeDelay={100}
                    zIndex={150}
                    width={380}
                    position="bottom-start"
                    withinPortal={false}
                    transitionProps={{ transition: 'fade', duration: 150 }}
                  >
                    <Menu.Target>
                      <Button
                        variant={isCurrentPath(item.href) ? 'light' : 'subtle'}
                        color={isCurrentPath(item.href) ? 'navy' : 'gray'}
                        rightSection={<IconChevronDown size={14} />}
                        leftSection={<span style={{ fontSize: '0.9rem' }}>{item.icon}</span>}
                        size="sm"
                        style={{
                          padding: '8px 12px',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          minHeight: '36px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {getDisplayText(item.titleKey, false)}
                        {item.badge && (
                          <Badge size="xs" ml="xs" variant="light">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </Menu.Target>

                    <Menu.Dropdown
                      style={{
                        padding: '8px',
                        border: '1px solid #e9ecef',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        maxWidth: '380px',
                        minWidth: '320px'
                      }}
                    >
                      <Menu.Label style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '8px' }}>
                        {getDisplayText(item.titleKey, false)}
                      </Menu.Label>
                      {item.children.map((child) => (
                        <Menu.Item
                          key={child.titleKey}
                          component={Link}
                          href={child.href}
                          leftSection={<span style={{ fontSize: '1rem' }}>{child.icon}</span>}
                          style={{
                            borderRadius: '6px',
                            padding: '8px 12px',
                            marginBottom: '4px'
                          }}
                        >
                          <div>
                            <Text size="sm" fw={500} style={{ lineHeight: 1.3 }}>
                              {t(child.titleKey)}
                            </Text>
                            {child.descriptionKey && (
                              <Text size="xs" c="dimmed" style={{ marginTop: '2px', lineHeight: 1.2 }}>
                                {t(child.descriptionKey)}
                              </Text>
                            )}
                          </div>
                        </Menu.Item>
                      ))}
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <Button
                    component={Link}
                    href={item.href}
                    variant={isCurrentPath(item.href) ? 'light' : 'subtle'}
                    color={isCurrentPath(item.href) ? 'navy' : 'gray'}
                    leftSection={<span style={{ fontSize: '0.9rem' }}>{item.icon}</span>}
                    size="sm"
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      minHeight: '36px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getDisplayText(item.titleKey, false)}
                    {item.badge && (
                      <Badge size="xs" ml="xs" variant="light">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </Group>

          {/* Right Section */}
          <Group gap="xs">

            {/* Language Selector - Always Visible on Desktop */}
            <Box visibleFrom="md">
              <LanguageSelector variant="compact" />
            </Box>

            {/* Mobile Controls */}
            <Group gap="xs" hiddenFrom="md">
              <Burger
                opened={opened}
                onClick={toggle}
                size="sm"
                style={{ minHeight: '44px', minWidth: '44px' }}
              />
            </Group>

          </Group>
        </Group>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="85vw"
        padding="lg"
        title={<Text fw={700} size="xl">Menu</Text>}
        hiddenFrom="md"
        zIndex={200}
        classNames={{
          content: 'safe-area-padding',
        }}
      >
        <Stack gap="xs">
          {navigationItems.map((item) => (
            <div key={item.titleKey}>
              <Button
                component={Link}
                href={item.href}
                variant={isCurrentPath(item.href) ? 'light' : 'subtle'}
                color={isCurrentPath(item.href) ? 'navy' : 'gray'}
                leftSection={<span style={{ fontSize: '1.1rem' }}>{item.icon}</span>}
                fullWidth
                justify="flex-start"
                onClick={close}
                size="lg"
                style={{
                  minHeight: '56px',
                  fontSize: '1rem',
                  fontWeight: 500,
                  borderRadius: '12px',
                  padding: '12px 16px',
                }}
              >
                {t(item.titleKey)}
                {item.badge && (
                  <Badge size="xs" ml="auto" variant="light">
                    {item.badge}
                  </Badge>
                )}
              </Button>

              {item.children && (
                <Stack gap="xs" pl="lg" mt="xs">
                  {item.children.map((child) => (
                    <Button
                      key={child.titleKey}
                      component={Link}
                      href={child.href}
                      variant="subtle"
                      color="gray"
                      size="md"
                      leftSection={<span style={{ fontSize: '1rem' }}>{child.icon}</span>}
                      fullWidth
                      justify="flex-start"
                      onClick={close}
                      style={{
                        minHeight: '48px',
                        fontSize: '0.9rem',
                        borderRadius: '10px',
                        padding: '10px 14px',
                      }}
                    >
                      {t(child.titleKey)}
                    </Button>
                  ))}
                </Stack>
              )}
            </div>
          ))}

          <Divider my="md" />

          {/* Mobile Language Selector */}
          <LanguageSelector variant="button" />

        </Stack>
      </Drawer>
    </Box>
  );
}