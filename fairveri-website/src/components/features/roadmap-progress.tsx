'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { 
  CheckCircle, Clock, AlertCircle, Star, ChevronRight, 
  Download, Share2, BookOpen, Target, Zap, Award,
  Calendar, Users, FileText, Link, Settings, BarChart3
} from 'lucide-react'

interface RoadmapItem {
  id: string
  title: string
  description: string
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  resources: Array<{
    type: 'tool' | 'guide' | 'template' | 'example'
    title: string
    url?: string
    description: string
  }>
  prerequisites?: string[]
  tips?: string[]
  checkpoints: Array<{
    id: string
    task: string
    description: string
    completed: boolean
  }>
}

interface RoadmapPhase {
  id: string
  title: string
  description: string
  color: string
  icon: React.ReactNode
  estimatedTime: string
  items: RoadmapItem[]
}

const RoadmapProgress: React.FC = () => {
  const [activePhase, setActivePhase] = useState<string>('planning')
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())
  const [userProfile, setUserProfile] = useState({
    role: 'researcher', // researcher, data_manager, librarian, policy_maker
    experience: 'beginner', // beginner, intermediate, advanced
    discipline: 'general', // general, life_sciences, social_sciences, physical_sciences
    institution: 'university' // university, research_institute, government, ngo
  })

  // Load completed tasks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fair-roadmap-progress')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setCompletedTasks(new Set(data.completedTasks || []))
        setUserProfile(prev => ({ ...prev, ...data.userProfile }))
      } catch (error) {
        // Error loading progress from localStorage
      }
    }
  }, [])

  // Save progress to localStorage
  useEffect(() => {
    const data = {
      completedTasks: Array.from(completedTasks),
      userProfile,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem('fair-roadmap-progress', JSON.stringify(data))
  }, [completedTasks, userProfile])

  const phases: RoadmapPhase[] = [
    {
      id: 'planning',
      title: 'Planlama Aşaması',
      description: 'Veri yönetimi stratejisi ve altyapı planlama',
      color: '#3B82F6',
      icon: <FileText className="h-5 w-5" />,
      estimatedTime: '1-2 hafta',
      items: [
        {
          id: 'dmp-creation',
          title: 'Veri Yönetim Planı Oluşturma',
          description: 'Proje boyunca verilerin nasıl yönetileceğini tanımlayan kapsamlı plan hazırlama',
          estimatedTime: '3-5 gün',
          difficulty: 'medium',
          resources: [
            {
              type: 'tool',
              title: 'DMPTool',
              url: 'https://dmptool.org',
              description: 'Online veri yönetim planı oluşturma aracı'
            },
            {
              type: 'template',
              title: 'TÜBİTAK DMP Şablonu',
              description: 'Türkiye projeler için uygun DMP şablonu'
            },
            {
              type: 'guide',
              title: 'DMP Yazma Rehberi',
              description: 'Adım adım veri yönetim planı yazma kılavuzu'
            }
          ],
          tips: [
            'Projenin başında DMP oluşturmaya başlayın',
            'Mevcut kurumsal politikaları dikkate alın',
            'Ekip üyeleriyle birlikte hazırlayın'
          ],
          checkpoints: [
            {
              id: 'dmp-scope',
              task: 'Proje kapsamını tanımla',
              description: 'Hangi verilerin toplanacağını, nasıl kullanılacağını belirle',
              completed: false
            },
            {
              id: 'dmp-metadata',
              task: 'Metadata standartlarını seç',
              description: 'Disipline uygun metadata şemalarını araştır ve seç',
              completed: false
            },
            {
              id: 'dmp-storage',
              task: 'Depolama stratejisini planla',
              description: 'Veri depolama, yedekleme ve arşivleme yöntemlerini belirle',
              completed: false
            },
            {
              id: 'dmp-sharing',
              task: 'Paylaşım politikasını oluştur',
              description: 'Verilerin nasıl ve ne zaman paylaşılacağını planla',
              completed: false
            }
          ]
        },
        {
          id: 'standards-selection',
          title: 'Metadata Standartları Seçimi',
          description: 'Disiplinize uygun metadata standartları ve kelime dağarcıklarını belirleme',
          estimatedTime: '2-3 gün',
          difficulty: 'hard',
          resources: [
            {
              type: 'tool',
              title: 'RDA Metadata Standards Catalog',
              description: 'Disipline göre metadata standartları kataloğu'
            },
            {
              type: 'guide',
              title: 'Metadata Standartları Seçim Rehberi',
              description: 'Doğru standartı seçmek için kriterlər'
            }
          ],
          checkpoints: [
            {
              id: 'standards-research',
              task: 'Mevcut standartları araştır',
              description: 'Alanınızda kullanılan metadata standartlarını listele',
              completed: false
            },
            {
              id: 'standards-compare',
              task: 'Standartları karşılaştır',
              description: 'Seçenekleri proje ihtiyaçlarına göre değerlendir',
              completed: false
            },
            {
              id: 'standards-document',
              task: 'Seçimleri belgele',
              description: 'Neden bu standartları seçtiğinizi kayıt altına al',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 'implementation',
      title: 'Uygulama Aşaması',
      description: 'FAIR prensiplerini verilerinize uygulama',
      color: '#10B981',
      icon: <Settings className="h-5 w-5" />,
      estimatedTime: '2-4 hafta',
      items: [
        {
          id: 'identifier-setup',
          title: 'Kalıcı Tanımlayıcılar Kurulumu',
          description: 'DOI, ORCID ve diğer kalıcı tanımlayıcıları alma ve entegre etme',
          estimatedTime: '1-2 gün',
          difficulty: 'easy',
          resources: [
            {
              type: 'tool',
              title: 'ORCID',
              url: 'https://orcid.org',
              description: 'Araştırmacı kimliği oluşturma'
            },
            {
              type: 'tool',
              title: 'Zenodo',
              url: 'https://zenodo.org',
              description: 'DOI alma için veri deposu'
            }
          ],
          checkpoints: [
            {
              id: 'orcid-create',
              task: 'ORCID hesabı oluştur',
              description: 'Kişisel ORCID kimliğinizi edinin',
              completed: false
            },
            {
              id: 'doi-reserve',
              task: 'DOI rezerve et',
              description: 'Veri setiniz için DOI tanımlayıcısı ayırın',
              completed: false
            },
            {
              id: 'identifiers-integrate',
              task: 'Tanımlayıcıları entegre et',
              description: 'Tüm tanımlayıcıları metadata\'ya ekleyin',
              completed: false
            }
          ]
        },
        {
          id: 'metadata-creation',
          title: 'Zengin Metadata Oluşturma',
          description: 'Seçilen standartlara uygun kapsamlı metadata hazırlama',
          estimatedTime: '1 hafta',
          difficulty: 'medium',
          resources: [
            {
              type: 'tool',
              title: 'CEDAR Workbench',
              url: 'https://cedar.metadatacenter.org',
              description: 'Metadata şablonu oluşturma aracı'
            }
          ],
          checkpoints: [
            {
              id: 'metadata-template',
              task: 'Metadata şablonu hazırla',
              description: 'Standartlara uygun metadata şablonu oluştur',
              completed: false
            },
            {
              id: 'metadata-fill',
              task: 'Metadata bilgilerini doldur',
              description: 'Tüm gerekli metadata alanlarını tamamla',
              completed: false
            },
            {
              id: 'metadata-validate',
              task: 'Metadata\'yı doğrula',
              description: 'Metadata kalitesini kontrol et',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 'assessment',
      title: 'Değerlendirme Aşaması',
      description: 'FAIR uyumluluğunu ölçme ve iyileştirme',
      color: '#8B5CF6',
      icon: <BarChart3 className="h-5 w-5" />,
      estimatedTime: '1 hafta',
      items: [
        {
          id: 'automated-assessment',
          title: 'Otomatik FAIR Değerlendirmesi',
          description: 'F-UJI gibi araçlarla otomatik FAIR skoru hesaplama',
          estimatedTime: '1 gün',
          difficulty: 'easy',
          resources: [
            {
              type: 'tool',
              title: 'F-UJI',
              url: 'https://www.f-uji.net',
              description: 'Otomatik FAIR değerlendirme aracı'
            }
          ],
          checkpoints: [
            {
              id: 'fuji-run',
              task: 'F-UJI değerlendirmesi çalıştır',
              description: 'Veri setinizin URL\'si ile F-UJI testi yap',
              completed: false
            },
            {
              id: 'results-analyze',
              task: 'Sonuçları analiz et',
              description: 'FAIR skorlarını detaylı olarak incele',
              completed: false
            },
            {
              id: 'gaps-identify',
              task: 'Eksiklikleri belirle',
              description: 'Düşük skor alan alanları tespit et',
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 'maintenance',
      title: 'Sürdürme Aşaması',
      description: 'Uzun vadeli bakım ve sürekli iyileştirme',
      color: '#F59E0B',
      icon: <Target className="h-5 w-5" />,
      estimatedTime: 'Sürekli',
      items: [
        {
          id: 'monitoring-setup',
          title: 'İzleme Sistemi Kurulumu',
          description: 'Veri kullanımını izlemek için sistemler kurma',
          estimatedTime: '2-3 gün',
          difficulty: 'medium',
          resources: [
            {
              type: 'tool',
              title: 'Google Analytics',
              description: 'Veri setinize erişimi izleme'
            }
          ],
          checkpoints: [
            {
              id: 'analytics-setup',
              task: 'Analitik araçlarını kur',
              description: 'Veri erişim istatistiklerini izleme sistemini aktive et',
              completed: false
            },
            {
              id: 'reporting-schedule',
              task: 'Raporlama takvimi oluştur',
              description: 'Düzenli FAIR performans raporları için zaman planı yap',
              completed: false
            }
          ]
        }
      ]
    }
  ]

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks)
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId)
    } else {
      newCompleted.add(taskId)
    }
    setCompletedTasks(newCompleted)
  }

  const getPhaseProgress = (phaseId: string) => {
    const phase = phases.find(p => p.id === phaseId)
    if (!phase) return 0
    
    const totalTasks = phase.items.reduce((sum, item) => sum + item.checkpoints.length, 0)
    const completedCount = phase.items.reduce((sum, item) => 
      sum + item.checkpoints.filter(cp => completedTasks.has(cp.id)).length, 0
    )
    
    return totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
  }

  const getOverallProgress = () => {
    const totalTasks = phases.reduce((sum, phase) => 
      sum + phase.items.reduce((itemSum, item) => itemSum + item.checkpoints.length, 0), 0
    )
    const completedCount = phases.reduce((sum, phase) => 
      sum + phase.items.reduce((itemSum, item) => 
        itemSum + item.checkpoints.filter(cp => completedTasks.has(cp.id)).length, 0
      ), 0
    )
    
    return totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'hard': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'tool': return <Settings className="h-4 w-4" />
      case 'guide': return <BookOpen className="h-4 w-4" />
      case 'template': return <FileText className="h-4 w-4" />
      case 'example': return <Star className="h-4 w-4" />
      default: return <Link className="h-4 w-4" />
    }
  }

  const exportProgress = () => {
    const progressData = {
      userProfile,
      completedTasks: Array.from(completedTasks),
      overallProgress: getOverallProgress(),
      phaseProgress: phases.map(phase => ({
        id: phase.id,
        title: phase.title,
        progress: getPhaseProgress(phase.id)
      })),
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(progressData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `fair-roadmap-progress-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                İlerleme Durumu
              </CardTitle>
              <CardDescription>
                FAIR dönüşüm sürecinizdeki genel ilerleme ve aşama detayları
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportProgress}>
                <Download className="h-4 w-4 mr-2" />
                İlerlemeyi İndir
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Paylaş
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Genel İlerleme</span>
                <span className="text-2xl font-bold text-blue-600">{getOverallProgress()}%</span>
              </div>
              <Progress value={getOverallProgress()} className="h-3" />
              <p className="text-sm text-slate-600">
                Toplam {phases.reduce((sum, phase) => 
                  sum + phase.items.reduce((itemSum, item) => itemSum + item.checkpoints.length, 0), 0
                )} görevden {completedTasks.size} tanesi tamamlandı
              </p>
            </div>

            {/* Phase Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {phases.map((phase) => {
                const progress = getPhaseProgress(phase.id)
                return (
                  <div
                    key={phase.id}
                    className={cn(
                      "p-4 rounded-lg border-2 cursor-pointer transition-all",
                      activePhase === phase.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setActivePhase(phase.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: phase.color }}
                      >
                        {phase.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{phase.title}</h4>
                        <p className="text-xs text-slate-600">{phase.estimatedTime}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-600">İlerleme</span>
                        <span className="font-semibold">{progress}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Phase View */}
      <Tabs value={activePhase} onValueChange={setActivePhase}>
        <TabsList className="grid w-full grid-cols-4">
          {phases.map((phase) => (
            <TabsTrigger key={phase.id} value={phase.id} className="flex items-center gap-2">
              {phase.icon}
              <span className="hidden sm:inline">{phase.title}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {phases.map((phase) => (
          <TabsContent key={phase.id} value={phase.id} className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl"
                    style={{ backgroundColor: phase.color }}
                  >
                    {phase.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{phase.title}</CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {phase.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 mt-3">
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {phase.estimatedTime}
                      </Badge>
                      <Badge variant="secondary">
                        {getPhaseProgress(phase.id)}% Tamamlandı
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-6">
              {phase.items.map((item, itemIndex) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: itemIndex * 0.1 }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={getDifficultyColor(item.difficulty)}>
                              {item.difficulty === 'easy' ? 'Kolay' :
                               item.difficulty === 'medium' ? 'Orta' : 'Zor'}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.estimatedTime}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                          <CardDescription>
                            {item.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="checkpoints">
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Kontrol Listesi ({item.checkpoints.filter(cp => completedTasks.has(cp.id)).length}/{item.checkpoints.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              {item.checkpoints.map((checkpoint) => (
                                <div key={checkpoint.id} className="flex items-start gap-3 p-3 border rounded-lg">
                                  <Checkbox
                                    id={checkpoint.id}
                                    checked={completedTasks.has(checkpoint.id)}
                                    onCheckedChange={() => toggleTask(checkpoint.id)}
                                  />
                                  <div className="flex-1">
                                    <label
                                      htmlFor={checkpoint.id}
                                      className={cn(
                                        "font-medium cursor-pointer",
                                        completedTasks.has(checkpoint.id) && "line-through text-slate-500"
                                      )}
                                    >
                                      {checkpoint.task}
                                    </label>
                                    <p className="text-sm text-slate-600 mt-1">
                                      {checkpoint.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="resources">
                          <AccordionTrigger>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4" />
                              Kaynaklar ({item.resources.length})
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {item.resources.map((resource, resourceIndex) => (
                                <div key={resourceIndex} className="border rounded-lg p-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                                      {getResourceIcon(resource.type)}
                                    </div>
                                    <div className="flex-1">
                                      <h5 className="font-medium text-sm">{resource.title}</h5>
                                      <p className="text-xs text-slate-600 mt-1">
                                        {resource.description}
                                      </p>
                                      {resource.url && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="mt-2"
                                          asChild
                                        >
                                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            <Link className="h-3 w-3 mr-1" />
                                            Ziyaret Et
                                          </a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {item.tips && (
                          <AccordionItem value="tips">
                            <AccordionTrigger>
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                İpuçları ({item.tips.length})
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-2">
                                {item.tips.map((tip, tipIndex) => (
                                  <div key={tipIndex} className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-yellow-800">{tip}</p>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Achievement Badges */}
      <AnimatePresence>
        {getOverallProgress() >= 25 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-4 right-4 z-50"
          >
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6" />
                  <div>
                    <h4 className="font-semibold">Tebrikler!</h4>
                    <p className="text-sm opacity-90">FAIR yolculuğunda %{getOverallProgress()} ilerleme</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RoadmapProgress