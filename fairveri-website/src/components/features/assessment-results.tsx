'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAssessmentStore } from '@/lib/assessment-store';
import { useTranslation } from '@/contexts/language-context';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Download, 
  Share2, 
  RotateCcw,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  FileText,
  Lightbulb,
  Award,
  PieChart
} from 'lucide-react';
import { RadarChart } from '@/components/ui/radar-chart';

// Import assessment data
import assessmentData from '@/data/assessment-questions.json';
import { generateAssessmentPDF } from '@/lib/pdf-export';

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  color: string;
  icon: string;
  description?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ 
  title, 
  score, 
  maxScore, 
  color, 
  icon, 
  description 
}) => {
  const { t } = useTranslation();
  const percentage = (score / maxScore) * 100;
  
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
        </div>
        <Badge 
          style={{ backgroundColor: color + '20', color: color }}
          className="text-sm font-semibold"
        >
          {score}/{maxScore}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{t('assessment.results.progress')}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <Progress value={percentage} className="h-3" />
      </div>
    </Card>
  );
};

const OverallScoreCard: React.FC = () => {
  const { t } = useTranslation();
  const { results } = useAssessmentStore();
  
  if (!results) return null;
  
  const percentage = (results.totalScore / results.maxScore) * 100;
  const level = assessmentData.assessment.scoring.levels.find((l: any) => 
    results.totalScore >= l.min && results.totalScore <= l.max
  );
  
  return (
    <Card className="p-8 text-center space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
          <Award className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">{t('assessment.results.overallScore')}</span>
        </div>
        
        <div className="text-6xl font-bold text-gray-900">
          {Math.round(percentage)}%
        </div>
        
        <div className="text-lg text-gray-600">
          {results.totalScore} out of {results.maxScore} points
        </div>
      </div>
      
      <div className="space-y-4">
        <Progress value={percentage} className="h-4" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
             style={{ backgroundColor: level?.color + '20', color: level?.color }}>
          <CheckCircle className="h-4 w-4" />
          <span className="font-semibold">{level?.level}</span>
        </div>
        
        <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
          {level?.description}
        </p>
      </div>
    </Card>
  );
};

const DetailedBreakdown: React.FC = () => {
  const { results, answers } = useAssessmentStore();
  
  if (!results) return null;
  
  const { assessment } = assessmentData;
  
  // Prepare data for radar chart
  const radarData = assessment.categories.map((category: any) => {
    const categoryScore = results.categoryScores[category.id];
    return {
      label: category.title,
      value: categoryScore?.score || 0,
      maxValue: categoryScore?.maxScore || 0,
      color: category.color,
      icon: category.icon
    };
  });
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold">Detailed Breakdown</h3>
      </div>
      
      {/* Radar Chart Visualization */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <PieChart className="h-5 w-5 text-blue-600" />
          <h4 className="text-lg font-semibold">FAIR Principles Radar</h4>
        </div>
        <div className="flex justify-center" id="radar-chart-container">
          <RadarChart
            data={radarData}
            size={400}
            animated={true}
            className="mx-auto"
          />
        </div>
      </Card>
      
      {/* Category Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessment.categories.map((category: any) => {
          const categoryScore = results.categoryScores[category.id];
          return (
            <ScoreCard
              key={category.id}
              title={category.title}
              score={categoryScore?.score || 0}
              maxScore={categoryScore?.maxScore || 0}
              color={category.color}
              icon={category.icon}
              description={category.description}
            />
          );
        })}
      </div>
    </div>
  );
};

const RecommendationsSection: React.FC = () => {
  const { results, answers } = useAssessmentStore();
  
  if (!results) return null;
  
  const { assessment } = assessmentData;
  
  // Get specific recommendations based on low-scoring areas
  const categoryRecommendations = assessment.categories.map((category: any) => {
    const categoryScore = results.categoryScores[category.id];
    const percentage = categoryScore ? (categoryScore.score / categoryScore.maxScore) * 100 : 0;
    
    if (percentage < 70) {
      return {
        category: category.title,
        color: category.color,
        icon: category.icon,
        recommendations: category.questions
          .filter((q: any) => {
            const answer = answers.find(a => a.questionId === q.id);
            return !answer || answer.score < Math.max(...q.options.map((opt: any) => opt.score)) * 0.7;
          })
          .map((q: any) => ({
            title: q.title,
            tips: q.tips || []
          }))
      };
    }
    return null;
  }).filter(Boolean);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-yellow-600" />
        <h3 className="text-xl font-semibold">Recommendations for Improvement</h3>
      </div>
      
      {/* Overall recommendations */}
      <Card className="p-6 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-6 w-6 text-yellow-600 mt-0.5" />
          <div className="space-y-3">
            <h4 className="font-semibold text-yellow-800">Priority Actions</h4>
            <ul className="space-y-2">
              {results.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span className="text-sm text-yellow-800">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
      
      {/* Category-specific recommendations */}
      {categoryRecommendations.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800">Category-Specific Improvements</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryRecommendations.map((catRec: any, index) => (
              <Card key={index} className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{catRec.icon}</span>
                  <h5 className="font-medium">{catRec.category}</h5>
                </div>
                <div className="space-y-2">
                  {catRec.recommendations.slice(0, 3).map((rec: any, recIndex: number) => (
                    <div key={recIndex} className="text-sm">
                      <p className="font-medium text-gray-700">{rec.title}</p>
                      {rec.tips.length > 0 && (
                        <ul className="mt-1 ml-2 space-y-1">
                          {rec.tips.slice(0, 2).map((tip: string, tipIndex: number) => (
                            <li key={tipIndex} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-gray-400">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ActionableSteps: React.FC = () => {
  const { results } = useAssessmentStore();
  
  if (!results) return null;
  
  const totalScore = results.totalScore;
  const maxScore = results.maxScore;
  const percentage = (totalScore / maxScore) * 100;
  
  const getActionableSteps = () => {
    if (percentage < 25) {
      return [
        "Start with implementing unique identifiers (DOI, Handle, UUID) for your datasets",
        "Create basic metadata including title, description, authors, and creation date",
        "Choose an appropriate repository for your data (institutional, disciplinary, or general)",
        "Add a clear usage license (CC0, CC BY, or domain-specific license)",
        "Document your data collection methodology and basic quality information"
      ];
    } else if (percentage < 50) {
      return [
        "Enhance metadata with detailed methodology and data quality information",
        "Implement structured data formats (JSON, XML, CSV with clear schemas)",
        "Add controlled vocabularies and standardized terminologies",
        "Include detailed provenance information about data creation and processing",
        "Register your data in multiple discoverable repositories"
      ];
    } else if (percentage < 75) {
      return [
        "Implement semantic web formats (JSON-LD, RDF) for better machine readability",
        "Add comprehensive cross-references to related datasets",
        "Enhance metadata with detailed variable definitions and measurement units",
        "Implement API access for programmatic data retrieval",
        "Add version control and update procedures for your datasets"
      ];
    } else {
      return [
        "Share your FAIR implementation practices with the research community",
        "Mentor others in adopting FAIR principles in your domain",
        "Contribute to the development of domain-specific FAIR standards",
        "Regularly review and update your practices as standards evolve",
        "Consider becoming a FAIR data steward or champion in your institution"
      ];
    }
  };
  
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <h3 className="text-xl font-semibold">Next Steps</h3>
      </div>
      
      <div className="space-y-3">
        {getActionableSteps().map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <div className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mt-0.5">
              {index + 1}
            </div>
            <p className="text-sm text-green-800 leading-relaxed">{step}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

const ExportSection: React.FC = () => {
  const { results, exportResults, resetAssessment } = useAssessmentStore();
  const [exportFormat, setExportFormat] = useState<'json' | 'pdf' | 'csv'>('json');
  const [isExporting, setIsExporting] = useState(false);
  
  if (!results) return null;
  
  const handleExport = async () => {
    setIsExporting(true);
    const timestamp = new Date().toISOString().split('T')[0];
    
    try {
      if (exportFormat === 'pdf') {
        await generateAssessmentPDF(results, assessmentData, {
          title: 'FAIR Assessment Report',
          subtitle: `Generated on ${new Date().toLocaleDateString()}`,
          includeCharts: true,
          includeRecommendations: true
        });
      } else if (exportFormat === 'json') {
        const data = exportResults();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fair-assessment-results-${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (exportFormat === 'csv') {
        // Create CSV format
        const csvData = [
          ['Category', 'Score', 'Max Score', 'Percentage'],
          ...Object.entries(results.categoryScores).map(([category, score]) => [
            category,
            score.score.toString(),
            score.maxScore.toString(),
            Math.round(score.percentage).toString() + '%'
          ])
        ];
        
        const csvContent = csvData.map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `fair-assessment-results-${timestamp}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      // Export failed - error handled by UI feedback
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'FAIR Assessment Results',
        text: `I scored ${Math.round((results.totalScore / results.maxScore) * 100)}% on the FAIR principles assessment!`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      const shareText = `I scored ${Math.round((results.totalScore / results.maxScore) * 100)}% on the FAIR principles assessment! Check out your data's FAIR compliance at ${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      alert('Results copied to clipboard!');
    }
  };
  
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold">Export & Share</h3>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Format:</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value as 'json' | 'pdf' | 'csv')}
            className="px-3 py-1 border rounded text-sm"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="pdf">PDF Report</option>
          </select>
        </div>
        
        <Button 
          onClick={handleExport} 
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export Results'}
        </Button>
        
        <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Share Results
        </Button>
        
        <Button 
          variant="outline" 
          onClick={resetAssessment}
          className="flex items-center gap-2 text-red-600 hover:text-red-700"
        >
          <RotateCcw className="h-4 w-4" />
          Take Again
        </Button>
      </div>
    </Card>
  );
};

export const AssessmentResults: React.FC = () => {
  const { results } = useAssessmentStore();
  
  if (!results) return null;
  
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Your FAIR Assessment Results
        </h1>
        <p className="text-gray-600">
          Completed on {new Date(results.completedAt).toLocaleDateString()}
        </p>
      </div>
      
      {/* Overall Score */}
      <OverallScoreCard />
      
      {/* Detailed Breakdown */}
      <DetailedBreakdown />
      
      {/* Recommendations */}
      <RecommendationsSection />
      
      {/* Action Steps */}
      <ActionableSteps />
      
      {/* Export Options */}
      <ExportSection />
    </div>
  );
};