'use client';

import React, { useState } from 'react';
import { Card, TextInput, Button, Group, Stack, Title, Text, Badge } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

interface MetadataBuilderProps {
  element: any;
  onScoreUpdate: (score: number) => void;
}

export function MetadataBuilder({ element, onScoreUpdate }: MetadataBuilderProps) {
  const [metadata, setMetadata] = useState<Record<string, string>>({
    title: '',
    description: '',
    creator: '',
    subject: '',
    date: '',
    format: '',
  });
  
  const [customFields, setCustomFields] = useState<Array<{ key: string; value: string }>>([]);
  
  const handleMetadataChange = (field: string, value: string) => {
    const newMetadata = { ...metadata, [field]: value };
    setMetadata(newMetadata);
    
    // Calculate score based on filled fields
    const filledFields = Object.values(newMetadata).filter(v => v.trim() !== '').length;
    const totalFields = Object.keys(newMetadata).length + customFields.length;
    const score = Math.round((filledFields / Math.max(totalFields, 6)) * 100);
    onScoreUpdate(score);
  };
  
  const addCustomField = () => {
    setCustomFields([...customFields, { key: '', value: '' }]);
  };
  
  const removeCustomField = (index: number) => {
    const newFields = customFields.filter((_, i) => i !== index);
    setCustomFields(newFields);
  };
  
  return (
    <Card padding="lg" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={4}>{element.title}</Title>
          <Badge variant="light" size="lg">
            Score: {Math.round((Object.values(metadata).filter(v => v.trim() !== '').length / 6) * 100)}%
          </Badge>
        </Group>
        
        <Text size="sm" c="dimmed">{element.description}</Text>
        
        <Stack gap="sm">
          <TextInput
            label="Title"
            placeholder="Enter dataset title"
            value={metadata.title}
            onChange={(e) => handleMetadataChange('title', e.target.value)}
          />
          
          <TextInput
            label="Description"
            placeholder="Describe your dataset"
            value={metadata.description}
            onChange={(e) => handleMetadataChange('description', e.target.value)}
          />
          
          <TextInput
            label="Creator"
            placeholder="Data creator/author"
            value={metadata.creator}
            onChange={(e) => handleMetadataChange('creator', e.target.value)}
          />
          
          <TextInput
            label="Subject"
            placeholder="Research subject/domain"
            value={metadata.subject}
            onChange={(e) => handleMetadataChange('subject', e.target.value)}
          />
          
          <TextInput
            label="Date"
            placeholder="Creation date"
            value={metadata.date}
            onChange={(e) => handleMetadataChange('date', e.target.value)}
          />
          
          <TextInput
            label="Format"
            placeholder="Data format (CSV, JSON, etc.)"
            value={metadata.format}
            onChange={(e) => handleMetadataChange('format', e.target.value)}
          />
        </Stack>
        
        {customFields.map((field, index) => (
          <Group key={index} align="end" gap="sm">
            <TextInput
              label="Custom Field Name"
              placeholder="Field name"
              value={field.key}
              onChange={(e) => {
                const newFields = [...customFields];
                newFields[index].key = e.target.value;
                setCustomFields(newFields);
              }}
              style={{ flex: 1 }}
            />
            <TextInput
              label="Value"
              placeholder="Field value"
              value={field.value}
              onChange={(e) => {
                const newFields = [...customFields];
                newFields[index].value = e.target.value;
                setCustomFields(newFields);
              }}
              style={{ flex: 1 }}
            />
            <Button
              variant="light"
              color="red"
              onClick={() => removeCustomField(index)}
              size="sm"
            >
              <IconTrash size={16} />
            </Button>
          </Group>
        ))}
        
        <Button
          variant="light"
          leftSection={<IconPlus size={16} />}
          onClick={addCustomField}
        >
          Add Custom Field
        </Button>
      </Stack>
    </Card>
  );
}