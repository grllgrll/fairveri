'use client'

import { Metadata } from 'next'

export default function ContactPage() {
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
          İletişim
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
          FAIR veri prensipleri hakkında sorularınız için bizimle iletişime geçin. 
          Projelerinizde destek almak, işbirliği fırsatları keşfetmek veya 
          eğitim talepleriniz için buradayız.
        </p>
      </div>

      {/* Contact Form - Main Section */}
      <div style={{ marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '12px', 
          padding: '2rem',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
            Mesaj Gönder
          </h3>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Ad Soyad *
              </label>
              <input 
                type="text"
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                placeholder="Adınız ve soyadınız"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                E-posta *
              </label>
              <input 
                type="email"
                required
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                placeholder="ornek@email.com"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Kurum/Organizasyon
              </label>
              <input 
                type="text"
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
                placeholder="Bağlı olduğunuz kurum"
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Konu
              </label>
              <select 
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Konu seçiniz</option>
                <option value="egitim">Eğitim Talebi</option>
                <option value="danismanlik">Danışmanlık</option>
                <option value="isbirligi">İşbirliği</option>
                <option value="teknik">Teknik Destek</option>
                <option value="diger">Diğer</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: '#333' }}>
                Mesaj *
              </label>
              <textarea 
                required
                rows={5}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  border: '1px solid #ddd', 
                  borderRadius: '6px',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>
            
            <button 
              type="submit"
              style={{ 
                padding: '1rem 2rem', 
                backgroundColor: '#1976d2', 
                color: 'white', 
                border: 'none',
                borderRadius: '6px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#1565c0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1976d2'}
            >
              📧 Mesaj Gönder
            </button>
          </form>
          
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#666', 
            textAlign: 'center', 
            marginTop: '1rem' 
          }}>
            * Mesajınıza 1-2 iş günü içinde yanıt vereceğiz.
          </p>
        </div>
      </div>

      {/* Collaboration Areas */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#333', textAlign: 'center' }}>
          🤝 İşbirliği Alanları
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎓</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
              Eğitim ve Danışmanlık
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              FAIR veri yönetimi eğitimleri, workshop'lar ve kurumsal danışmanlık hizmetleri
            </p>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔬</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
              Araştırma Projeleri
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              FAIR prensipleri üzerine akademik araştırma ve uygulama projeleri
            </p>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛠️</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: '#333' }}>
              Teknik Destek
            </h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>
              FAIR veri altyapısı kurulumu, metadata yönetimi ve araç geliştirme
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info Footer Section */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        borderRadius: '12px', 
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {/* Quick Contact */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>
              Hızlı İletişim
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                📧 <a href="mailto:info@fairveri.com" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  info@fairveri.com
                </a>
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                📞 <a href="tel:+902165003661" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  0216 500 3661
                </a>
              </p>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>
              Ofis Saatleri
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Pazartesi - Cuma:</strong> 09:00 - 17:00
              </p>
              <p>
                <strong>Hafta Sonu:</strong> Randevulu görüşmeler
              </p>
            </div>
          </div>

          {/* FAIR Representative */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>
              FAIR Temsilcisi
            </h4>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Dr. Özkan Özdemir</strong>
              </p>
              <p style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                Acıbadem Üniversitesi
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                <a 
                  href="https://avesis.acibadem.edu.tr/ozkan.ozdemir/iletisim" 
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                  Akademik Profil →
                </a>
              </p>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: '#333' }}>
              Adres
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: '1.5' }}>
              Acıbadem Üniversitesi<br />
              Kerem Aydınlar Kampüsü<br />
              Kayışdağı Cad. No:32<br />
              34752 Ataşehir/İstanbul
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Note */}
      <div style={{ 
        textAlign: 'center', 
        padding: '1rem',
        backgroundColor: '#e3f2fd',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#1976d2'
      }}>
        💡 Acil durumlar için e-posta yoluyla 7/24 iletişim kurabilirsiniz.
      </div>
    </div>
  )
}