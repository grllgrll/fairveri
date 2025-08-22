'use client';

import React, { useState } from 'react';
import { Card, Radio, Button, Group, Stack, Title, Text, Alert, Badge } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

interface LicenseSelectorProps {
  element: any;
  onRecommendationUpdate: (recommendation: any) => void;
}

const licenses = [
  {
    id: 'cc0',
    name: 'CC0 (Public Domain)',
    description: 'No rights reserved - complete freedom',
    commercial: true,
    attribution: false,
    shareAlike: false,
    score: 100
  },
  {
    id: 'cc-by',
    name: 'CC BY (Attribution)',
    description: 'Free use with attribution required',
    commercial: true,
    attribution: true,
    shareAlike: false,
    score: 95
  },
  {
    id: 'cc-by-sa',
    name: 'CC BY-SA (Attribution-ShareAlike)',
    description: 'Free use with attribution and share-alike',
    commercial: true,
    attribution: true,
    shareAlike: true,
    score: 85
  },
  {
    id: 'cc-by-nc',
    name: 'CC BY-NC (Attribution-NonCommercial)',
    description: 'Non-commercial use only with attribution',
    commercial: false,
    attribution: true,
    shareAlike: false,
    score: 70
  },
  {
    id: 'all-rights-reserved',
    name: 'All Rights Reserved',
    description: 'Traditional copyright - restricted use',
    commercial: false,
    attribution: true,
    shareAlike: false,
    score: 30
  }
];

export function LicenseSelector({ element, onRecommendationUpdate }: LicenseSelectorProps) {
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null);
  const [requirements, setRequirements] = useState({
    commercial: false,
    attribution: true,
    shareAlike: false
  });

  const handleRequirementChange = (requirement: string, value: boolean) => {
    const newRequirements = { ...requirements, [requirement]: value };
    setRequirements(newRequirements);
    
    // Find best matching license
    const bestMatch = licenses
      .filter(license => 
        license.commercial >= newRequirements.commercial &&
        license.attribution >= newRequirements.attribution &&
        license.shareAlike >= newRequirements.shareAlike
      )
      .sort((a, b) => b.score - a.score)[0];
    
    if (bestMatch) {
      onRecommendationUpdate({
        license: bestMatch,
        requirements: newRequirements,
        fairnessScore: bestMatch.score
      });
    }
  };

  const selectedLicenseData = licenses.find(l => l.id === selectedLicense);

  return (
    <Card padding="lg" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>{element.title}</Title>
          {selectedLicenseData && (
            <Badge variant="light" size="lg" color={selectedLicenseData.score > 80 ? 'green' : selectedLicenseData.score > 60 ? 'yellow' : 'red'}>
              FAIR Score: {selectedLicenseData.score}%
            </Badge>
          )}
        </Group>
        
        <Text size="sm" c="dimmed">{element.description}</Text>
        
        <Title order={5}>Your Requirements:</Title>
        <Stack gap="xs">
          <Group>
            <input
              type="checkbox"
              checked={requirements.commercial}
              onChange={(e) => handleRequirementChange('commercial', e.target.checked)}
            />
            <Text size="sm">Commercial use allowed</Text>
          </Group>
          
          <Group>
            <input
              type="checkbox"
              checked={requirements.attribution}
              onChange={(e) => handleRequirementChange('attribution', e.target.checked)}
            />
            <Text size="sm">Attribution required</Text>
          </Group>
          
          <Group>
            <input
              type="checkbox"
              checked={requirements.shareAlike}
              onChange={(e) => handleRequirementChange('shareAlike', e.target.checked)}
            />
            <Text size="sm">Share-alike required</Text>
          </Group>
        </Stack>
        
        <Title order={5}>Available Licenses:</Title>
        <Radio.Group
          value={selectedLicense}
          onChange={setSelectedLicense}
        >
          <Stack gap="sm">
            {licenses.map((license) => (
              <Card key={license.id} padding="sm" withBorder style={{ backgroundColor: selectedLicense === license.id ? 'var(--mantine-color-blue-0)' : undefined }}>
                <Radio
                  value={license.id}
                  label={
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text fw={500}>{license.name}</Text>
                        <Badge size="sm" color={license.score > 80 ? 'green' : license.score > 60 ? 'yellow' : 'red'}>
                          {license.score}%
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed">{license.description}</Text>
                      <Group gap="xs">
                        {license.commercial && <Badge size="xs" variant="light" color="green">Commercial OK</Badge>}
                        {license.attribution && <Badge size="xs" variant="light" color="blue">Attribution</Badge>}
                        {license.shareAlike && <Badge size="xs" variant="light" color="orange">Share-Alike</Badge>}
                      </Group>
                    </Stack>
                  }
                />
              </Card>
            ))}
          </Stack>
        </Radio.Group>
        
        {selectedLicenseData && (
          <Alert
            icon={<IconInfoCircle size={16} />}
            title="License Analysis"
            color={selectedLicenseData.score > 80 ? 'green' : selectedLicenseData.score > 60 ? 'yellow' : 'red'}
          >
            <Text size="sm">
              {selectedLicenseData.name} provides a FAIR score of {selectedLicenseData.score}%. 
              {selectedLicenseData.score > 80 ? ' This is an excellent choice for open science!' : 
               selectedLicenseData.score > 60 ? ' This is a good balance of openness and control.' : 
               ' This restricts reusability but may be necessary for sensitive data.'}
            </Text>
          </Alert>
        )}
      </Stack>
    </Card>
  );
}