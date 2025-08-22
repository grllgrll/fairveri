'use client'

import { Metadata } from 'next'
import { useState } from 'react'
import academicPapersData from '@/data/academic-papers.json'

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('foundational')
  const papersData = academicPapersData.papers

  return (
    <div style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Kaynaklar ve İleri Okuma
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
          FAIR veri prensipleri hakkında detaylı bilgi için kapsamlı kaynak koleksiyonu. 
          Akademik araştırma makalelerinden uygulamalı eğitim materyallerine, 
          Türkçe rehberlerden uluslararası standartlara kadar kapsamlı kaynaklar.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem', flexWrap: 'wrap' }}>
          <span style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#e3f2fd', 
            color: '#1976d2', 
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            📚 {papersData.totalPapers} Akademik Makale
          </span>
          <span style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#e8f5e8', 
            color: '#2e7d32', 
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            📊 {papersData.totalCitations.toLocaleString()} Toplam Atıf
          </span>
          <span style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: '#fff3e0', 
            color: '#f57c00', 
            borderRadius: '20px',
            fontSize: '0.9rem'
          }}>
            🏆 Q1 Dergi Makaleleri
          </span>
        </div>
      </div>

      {/* Academic Papers Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
          📖 Akademik Literatür Koleksiyonu
        </h2>
        <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem', textAlign: 'center' }}>
          FAIR veri prensipleri üzerine yapılmış peer-reviewed akademik çalışmalar. Tüm makaleler İngilizce olup, DOI ve Consensus AI bağlantıları ile erişilebilir.
        </p>
        
        {/* Category Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {papersData.categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '25px',
                backgroundColor: activeCategory === category.id ? '#1976d2' : '#f5f5f5',
                color: activeCategory === category.id ? 'white' : '#666',
                fontSize: '0.9rem',
                fontWeight: activeCategory === category.id ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {category.title} ({category.papers.length})
            </button>
          ))}
        </div>
        
        {/* Active Category Description */}
        {papersData.categories.map((category) => 
          activeCategory === category.id && (
            <div key={category.id} style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#333' }}>
                {category.title}
              </h3>
              <p style={{ color: '#666', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
                {category.description}
              </p>
            </div>
          )
        )}
        
        {/* Papers Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
          {papersData.categories
            .find(cat => cat.id === activeCategory)?.papers
            .map((paper) => (
              <div key={paper.id} style={{ 
                border: '1px solid #ddd', 
                borderRadius: '12px', 
                padding: '1.5rem',
                backgroundColor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ marginBottom: '1rem' }}>
                  <h4 style={{ 
                    fontSize: '1.1rem', 
                    margin: '0 0 0.5rem 0', 
                    lineHeight: '1.4',
                    color: '#333'
                  }}>
                    {paper.title}
                  </h4>
                  <p style={{ 
                    color: '#666', 
                    fontSize: '0.9rem', 
                    margin: '0.5rem 0',
                    lineHeight: '1.3'
                  }}>
                    {paper.authors}
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: '#888',
                      fontWeight: 'bold'
                    }}>
                      {paper.year}
                    </span>
                    {paper.citations > 0 && (
                      <span style={{ 
                        fontSize: '0.85rem', 
                        color: '#888'
                      }}>
                        📊 {paper.citations.toLocaleString()} citations
                      </span>
                    )}
                    {paper.sjrQuartile && (
                      <span style={{ 
                        padding: '0.2rem 0.5rem',
                        backgroundColor: paper.sjrQuartile === 'Q1' ? '#e8f5e8' : '#f0f0f0',
                        color: paper.sjrQuartile === 'Q1' ? '#2e7d32' : '#666',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        {paper.sjrQuartile}
                      </span>
                    )}
                  </div>
                  {paper.journal && (
                    <p style={{ 
                      color: '#999', 
                      fontSize: '0.85rem', 
                      fontStyle: 'italic',
                      margin: '0.5rem 0'
                    }}>
                      {paper.journal}
                    </p>
                  )}
                </div>
                
                {paper.takeaway && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ 
                      color: '#555', 
                      fontSize: '0.9rem', 
                      lineHeight: '1.4',
                      fontStyle: 'italic',
                      backgroundColor: '#f8f9fa',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      borderLeft: '3px solid #1976d2'
                    }}>
                      💡 {paper.takeaway}
                    </p>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <a 
                    href={`https://doi.org/${paper.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      padding: '0.5rem 1rem', 
                      backgroundColor: '#1976d2', 
                      color: 'white', 
                      textDecoration: 'none', 
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    🔗 DOI
                  </a>
                  <a 
                    href={paper.consensusLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      padding: '0.5rem 1rem', 
                      border: '1px solid #1976d2', 
                      color: '#1976d2', 
                      textDecoration: 'none', 
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    🤖 Consensus AI
                  </a>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      
      {/* Additional Resources Section */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
          📖 Ek Kaynaklar ve Belgeler
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>FAIR Veri Prensipleri (2016)</h3>
              <span style={{ 
                padding: '0.3rem 0.8rem', 
                backgroundColor: '#e3f2fd', 
                color: '#1976d2', 
                borderRadius: '15px',
                fontSize: '0.8rem'
              }}>
                Orijinal
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              Mark D. Wilkinson et al. - FAIR prensiplerini tanımlayan orijinal makale
            </p>
            <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Scientific Data, Nature
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a 
                href="https://doi.org/10.1038/sdata.2016.18" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                🔗 DOI
              </a>
              <a 
                href="https://www.nature.com/articles/sdata201618.pdf" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  border: '1px solid #1976d2', 
                  color: '#1976d2', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                📄 PDF
              </a>
            </div>
          </div>
          
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>FAIR Metrics - Nature</h3>
              <span style={{ 
                padding: '0.3rem 0.8rem', 
                backgroundColor: '#e8f5e8', 
                color: '#2e7d32', 
                borderRadius: '15px',
                fontSize: '0.8rem'
              }}>
                2018
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '0.5rem' }}>
              A design framework and exemplar metrics for FAIRness
            </p>
            <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Jacobsen et al., Scientific Data
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a 
                href="https://doi.org/10.1038/sdata.2018.118" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                🔗 DOI
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Türkçe Akademik Kaynaklar</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>TÜBİTAK FAIR Veri Yönetimi Rehberi (2023)</span>
              <a href="#" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[PDF]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Açık Bilim ve FAIR Prensipleri - Türkiye Perspektifi</span>
              <a href="#" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[DOI]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Üniversite Kütüphanelerinde FAIR Veri Uygulamaları</span>
              <a href="#" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[PDF]</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Eğitim Materyalleri */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
          🎓 Eğitim Materyalleri ve Kurslar
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>FAIR Data Management Course</h3>
              <span style={{ 
                padding: '0.3rem 0.8rem', 
                backgroundColor: '#e8f5e8', 
                color: '#2e7d32', 
                borderRadius: '15px',
                fontSize: '0.8rem'
              }}>
                Online
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              OpenAIRE tarafından hazırlanan kapsamlı FAIR eğitimi
            </p>
            <a 
              href="https://www.openaire.eu/fair-data-management-course" 
              target="_blank" 
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#2e7d32', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}
            >
              🎥 Kursa Git
            </a>
          </div>
          
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>FAIR Cooking Recipes</h3>
              <span style={{ 
                padding: '0.3rem 0.8rem', 
                backgroundColor: '#fff3e0', 
                color: '#f57c00', 
                borderRadius: '15px',
                fontSize: '0.8rem'
              }}>
                Pratik
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              FAIR-COOK projesi tarafından hazırlanan pratik rehberler
            </p>
            <a 
              href="https://faircookbook.elixir-europe.org/" 
              target="_blank" 
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#f57c00', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}
            >
              📚 Rehberleri Gör
            </a>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Video Eğitimleri</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>FAIR Prensiplerinin Temelleri (Türkçe Altyazılı)</span>
              <a href="#" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[YouTube]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>Metadata Oluşturma Workshop Kayıtları</span>
              <a href="#" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[Vimeo]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>DataCite DOI Oluşturma Eğitimi</span>
              <a href="#" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[YouTube]</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Araçlar */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
          🛠️ Araçlar ve Yazılımlar
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>F-UJI</h3>
              <span style={{ 
                padding: '0.3rem 0.8rem', 
                backgroundColor: '#e3f2fd', 
                color: '#1976d2', 
                borderRadius: '15px',
                fontSize: '0.8rem'
              }}>
                Web
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              Otomatik FAIR değerlendirme aracı
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a 
                href="https://www.f-uji.net/" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                🔗 Kullan
              </a>
              <a 
                href="https://github.com/pangaea-data-publisher/fuji" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  border: '1px solid #333', 
                  color: '#333', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                📦 GitHub
              </a>
            </div>
          </div>
          
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>FAIR Data Point</h3>
              <span style={{ 
                padding: '0.3rem 0.8rem', 
                backgroundColor: '#e8f5e8', 
                color: '#2e7d32', 
                borderRadius: '15px',
                fontSize: '0.8rem'
              }}>
                Self-Host
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              FAIR metadata katalog sistemi
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a 
                href="https://www.fairdatapoint.org/" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#2e7d32', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                🗄️ Demo
              </a>
              <a 
                href="https://github.com/FAIRDataTeam/FAIRDataPoint" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  border: '1px solid #333', 
                  color: '#333', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                📦 GitHub
              </a>
            </div>
          </div>
          
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.5rem',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', margin: 0 }}>DataCite Commons</h3>
              <span style={{ 
                padding: '0.3rem 0.8rem', 
                backgroundColor: '#f3e5f5', 
                color: '#7b1fa2', 
                borderRadius: '15px',
                fontSize: '0.8rem'
              }}>
                Repository
              </span>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              DOI ve metadata arama platformu
            </p>
            <a 
              href="https://commons.datacite.org/" 
              target="_blank" 
              style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#7b1fa2', 
                color: 'white', 
                textDecoration: 'none', 
                borderRadius: '4px',
                fontSize: '0.9rem'
              }}
            >
              🔍 Ara
            </a>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Python/R Kütüphaneleri</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>pyfair:</strong> Python FAIR değerlendirme kütüphanesi</span>
              <a href="https://pypi.org/project/pyfair/" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[PyPI]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>datacite:</strong> R DataCite API wrapper</span>
              <a href="https://cran.r-project.org/package=datacite" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[CRAN]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>jsonld:</strong> JSON-LD işleme kütüphanesi</span>
              <a href="https://github.com/digitalbazaar/jsonld.js" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[GitHub]</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Standartlar */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
          📜 Standartlar ve Şemalar
        </h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Metadata Standartları</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1.5rem',
              backgroundColor: '#fff'
            }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Dublin Core</h4>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                15 temel metadata elementinden oluşan standart
              </p>
              <a 
                href="https://www.dublincore.org/specifications/dublin-core/dcmi-terms/" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                📄 Spesifikasyon
              </a>
            </div>
            
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1.5rem',
              backgroundColor: '#fff'
            }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>DataCite Metadata Schema</h4>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                DOI'ler için gerekli metadata şeması
              </p>
              <a 
                href="https://schema.datacite.org/" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                📄 Schema v4.4
              </a>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Ontolojiler ve Controlled Vocabularies</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>DCAT:</strong> Data Catalog Vocabulary</span>
              <a href="https://www.w3.org/TR/vocab-dcat-2/" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[W3C]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>FOAF:</strong> Friend of a Friend ontology</span>
              <a href="http://xmlns.com/foaf/spec/" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[Spec]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>ORCID:</strong> Araştırmacı tanımlayıcı sistemi</span>
              <a href="https://orcid.org/" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[ORCID]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>Creative Commons:</strong> Lisans şemaları</span>
              <a href="https://creativecommons.org/licenses/" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[CC]</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Topluluk */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333' }}>
          👥 Topluluk ve Organizasyonlar
        </h2>
        
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Uluslararası Organizasyonlar</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1.5rem',
              backgroundColor: '#fff'
            }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>GO FAIR Initiative</h4>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                FAIR prensiplerini yaygınlaştıran küresel girişim
              </p>
              <a 
                href="https://www.go-fair.org/" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                🌍 Web Sitesi
              </a>
            </div>
            
            <div style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1.5rem',
              backgroundColor: '#fff'
            }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Research Data Alliance (RDA)</h4>
              <p style={{ color: '#666', marginBottom: '1rem' }}>
                Veri paylaşımı ve yeniden kullanımını destekleyen küresel ağ
              </p>
              <a 
                href="https://www.rd-alliance.org/" 
                target="_blank" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: '#1976d2', 
                  color: 'white', 
                  textDecoration: 'none', 
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                🌍 RDA
              </a>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Türkiye'deki Girişimler</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>TÜBİTAK ULAKBİM:</strong> Açık Bilim ve Veri Yönetimi</span>
              <a href="https://acikbilim.ulakbim.gov.tr/" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[Portal]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>Açık Bilim Derneği:</strong> Açık bilim toplum ağı</span>
              <a href="#" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[Web]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span><strong>TR-Grid:</strong> Türkiye Grid altyapısı projesi</span>
              <a href="https://www.grid.org.tr/" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[TR-Grid]</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Mailing Lists ve Forumlar</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>FAIR Data Community Google Group</span>
              <a href="#" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[Google Groups]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>OpenAIRE Community Forum</span>
              <a href="https://community.openaire.eu/" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[Forum]</a>
            </li>
            <li style={{ marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span>FAIR Cookbook GitHub Discussions</span>
              <a href="https://github.com/FAIRplus/the-fair-cookbook/discussions" style={{ color: '#1976d2', fontSize: '0.9rem' }}>[GitHub]</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div style={{ 
        padding: '3rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        borderRadius: '12px',
        textAlign: 'center'
      }}>
        <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>Katkıda Bulunun</h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
          Bu kaynak kütüphanesini birlikte geliştirelim. Yeni kaynaklar önerebilir, 
          eksiklikleri bildirebilir veya Türkçe çeviriler yapabilirsiniz.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="https://github.com/fairveri/website" 
            target="_blank" 
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: 'white', 
              color: '#333', 
              textDecoration: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            📦 GitHub'da Katkı Sağla
          </a>
          <a 
            href="mailto:info@fairveri.org" 
            style={{ 
              padding: '1rem 2rem', 
              border: '2px solid white', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            📧 Kaynak Öner
          </a>
        </div>
      </div>
    </div>
  )
}