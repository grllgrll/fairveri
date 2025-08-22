'use client'

import { Metadata } from 'next'

export default function PartnersPage() {
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
          Ortaklar ve İşbirlikleri
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
          FAIR veri prensiplerini yaygınlaştırmak ve uygulamak için birlikte çalıştığımız 
          kurumlar, organizasyonlar ve projeler. Akademik dünyadan endüstriye, 
          ulusal ve uluslararası işbirlikleri ile daha güçlü bir veri ekosistemi kuruyoruz.
        </p>
      </div>

      {/* Coming Soon Section */}
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem 2rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        marginBottom: '3rem'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🤝</div>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#333' }}>
          Ortaklarımız Yakında Burada
        </h2>
        <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
          Şu anda ortaklık anlaşmalarımızı sonuçlandırıyor ve işbirliği detaylarını hazırlıyoruz. 
          Bu sayfa yakında güncellenecektir.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/contact"
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: '#1976d2', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
          >
            🤝 Ortak Olmak İstiyorum
          </a>
          <a 
            href="mailto:info@fairveri.com"
            style={{ 
              padding: '1rem 2rem', 
              border: '2px solid #1976d2', 
              color: '#1976d2', 
              textDecoration: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
          >
            📧 Bilgi Al
          </a>
        </div>
      </div>

      {/* Partnership Categories - Preview */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
          🎯 Ortaklık Kategorileri
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #ddd',
            borderRadius: '12px',
            backgroundColor: '#fff',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>
              Akademik Kurumlar
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Üniversiteler, araştırma enstitüleri ve akademik topluluklar ile 
              eğitim ve araştırma ortaklıkları
            </p>
          </div>
          
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #ddd',
            borderRadius: '12px',
            backgroundColor: '#fff',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏭</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>
              Endüstri Ortakları
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Teknoloji şirketleri, veri yönetimi platformları ve 
              endüstriyel araştırma kuruluşları
            </p>
          </div>
          
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #ddd',
            borderRadius: '12px',
            backgroundColor: '#fff',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>
              Uluslararası Ağlar
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
              GO-FAIR, RDA, OpenAIRE gibi küresel FAIR girişimleri 
              ve standart organizasyonları
            </p>
          </div>
          
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #ddd',
            borderRadius: '12px',
            backgroundColor: '#fff',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏛️</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>
              Kamu Kurumları
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
              TÜBİTAK, ULAKBİM, YÖK ve diğer kamu araştırma 
              kurumları ile stratejik işbirlikleri
            </p>
          </div>
          
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #ddd',
            borderRadius: '12px',
            backgroundColor: '#fff',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>
              Kütüphane Ağları
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
              Üniversite kütüphaneleri, dijital arşivler ve 
              veri repositoryleri ile metadata standartları
            </p>
          </div>
          
          <div style={{ 
            padding: '2rem', 
            border: '1px solid #ddd',
            borderRadius: '12px',
            backgroundColor: '#fff',
            textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💡</div>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#333' }}>
              Açık Kaynak Projeleri
            </h3>
            <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: '1.5' }}>
              FAIR araçları geliştiren açık kaynak toplulukları 
              ve yazılım geliştirme projeleri
            </p>
          </div>
        </div>
      </div>

      {/* Partnership Benefits */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
          ✨ Ortaklık Avantajları
        </h2>
        
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '2rem', 
          borderRadius: '12px',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎓</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>
                Ortak Eğitim Programları
              </h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                FAIR eğitimleri ve sertifikasyon programları
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔬</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>
                Araştırma İşbirlikleri
              </h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Ortak projeler ve yayın fırsatları
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🛠️</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>
                Teknik Kaynak Paylaşımı
              </h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Araçlar, altyapı ve uzmanlık paylaşımı
              </p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌐</div>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>
                Ağ Genişletme
              </h4>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                Geniş FAIR topluluğuna erişim
              </p>
            </div>
          </div>
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
        <h3 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'white' }}>
          Bizimle Ortak Olun
        </h3>
        <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.9 }}>
          FAIR veri prensiplerini birlikte yaygınlaştıralım. Kurumunuz için 
          özel ortaklık fırsatları keşfedin.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a 
            href="/contact"
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: 'white', 
              color: '#333', 
              textDecoration: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            📞 İletişime Geç
          </a>
          <a 
            href="mailto:info@fairveri.com?subject=Ortaklık%20Talebi"
            style={{ 
              padding: '1rem 2rem', 
              border: '2px solid white', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            📧 Ortaklık Öner
          </a>
        </div>
      </div>
    </div>
  )
}