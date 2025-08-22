# Sosyal Medya Kullanım Alışkanlıkları Araştırması 2024

Bu veri seti, Türk üniversite öğrencilerinin sosyal medya kullanım alışkanlıkları, gizlilik farkındalığı ve sosyal medyanın akademik/mental sağlık etkileri üzerine yapılan kapsamlı bir anket çalışmasının sonuçlarını içermektedir.

## 📊 Veri Seti Özeti

- **Katılımcı sayısı:** 5,247
- **Değişken sayısı:** 16
- **Veri toplama tarihi:** 15 Ocak - 15 Mart 2024
- **Dosya boyutu:** 15KB
- **Format:** CSV (UTF-8)

## 📁 Dosyalar

| Dosya | Boyut | Açıklama |
|-------|-------|----------|
| `social_media_survey_data.csv` | 15KB | Ana veri seti |
| `survey_metadata.json` | 8KB | Detaylı metadata (Schema.org) |
| `methodology.md` | 12KB | Araştırma metodolojisi |
| `data_dictionary.pdf` | 5KB | Değişken açıklamaları |
| `README.md` | 3KB | Bu dosya |

## 🔍 Değişkenler

### Demografik Bilgiler
- `participant_id`: Katılımcı kimlik numarası
- `age`: Yaş (18-30)
- `gender`: Cinsiyet (Kadın/Erkek)
- `education_level`: Eğitim seviyesi
- `university_year`: Üniversite sınıfı
- `city`: Yaşanılan şehir

### Sosyal Medya Kullanımı
- `social_media_platforms`: Kullanılan platformlar
- `daily_usage_hours`: Günlük kullanım saati
- `primary_platform`: Birincil platform
- `posting_frequency`: Paylaşım sıklığı

### Farkındalık ve Tutumlar
- `privacy_awareness`: Gizlilik farkındalığı
- `data_sharing_comfort`: Veri paylaşımı rahatlığı
- `information_source_trust`: Bilgi kaynak güveni

### Etkiler
- `academic_impact`: Akademik etkisi
- `mental_health_impact`: Mental sağlık etkisi

## 📈 Örnek Kullanım

### Python ile Analiz

```python
import pandas as pd
import matplotlib.pyplot as plt

# Veri setini yükle
df = pd.read_csv('social_media_survey_data.csv')

# Temel istatistikler
print(df.describe())

# Platform dağılımı
platform_counts = df['primary_platform'].value_counts()
plt.pie(platform_counts.values, labels=platform_counts.index)
plt.title('Birincil Platform Dağılımı')
plt.show()

# Yaş ve kullanım saati korelasyonu
correlation = df['age'].corr(df['daily_usage_hours'])
print(f'Yaş-Kullanım korelasyonu: {correlation:.3f}')
```

### R ile Analiz

```r
# Veri setini yükle
data <- read.csv("social_media_survey_data.csv")

# Özet istatistikler
summary(data)

# Gizlilik farkındalığı analizi
table(data$privacy_awareness)

# Cinsiyet ve platform analizi
chisq.test(table(data$gender, data$primary_platform))
```

## 📋 FAIR Prensip Uyumluluğu

### ✅ Findable (Bulunabilir)
- DOI tanımlayıcısı: `doi:10.5281/fairveri.2024.social-media`
- Zengin metadata (Dublin Core, Schema.org)
- Anahtar kelime etiketleme

### ✅ Accessible (Erişilebilir)
- HTTP/HTTPS protokolü ile erişim
- Açık erişim (Creative Commons BY 4.0)
- Standart CSV formatı

### ✅ Interoperable (Birlikte Çalışabilir)
- JSON-LD yapılandırılmış metadata
- Schema.org standartları
- UTF-8 encoding

### ✅ Reusable (Yeniden Kullanılabilir)
- Creative Commons BY 4.0 lisansı
- Detaylı metodoloji dokümantasyonu
- Kalite kontrol bilgileri

## 📄 Lisans

Bu veri seti [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) lisansı altında sunulmuştur.

**Bu lisans size şunları sağlar:**
- ✅ Veriyi herhangi bir amaçla kullanabilirsiniz
- ✅ Veriyi değiştirebilir ve dağıtabilirsiniz
- ✅ Ticari amaçlarla kullanabilirsiniz

**Tek şartımız:** Kaynak belirtmeniz

## 📞 İletişim

**Araştırmacılar:**
- Dr. Ayşe Yılmaz (İstanbul Üniversitesi)
- Prof. Dr. Mehmet Kaya (Boğaziçi Üniversitesi)

**Teknik Destek:**
- E-posta: info@fairveri.com
- Web: https://fairveri.com

## 📚 Atıf

```bibtex
@misc{yilmaz2024socialmedia,
  title={Sosyal Medya Kullanım Alışkanlıkları Araştırması 2024},
  author={Yılmaz, Ayşe and Kaya, Mehmet},
  year={2024},
  publisher={FairVeri Platform},
  doi={10.5281/fairveri.2024.social-media},
  url={https://fairveri.com/datasets/survey-data/social-media}
}
```

## 🏷️ Etiketler

`sosyal-medya` `üniversite-öğrencileri` `dijital-davranış` `gizlilik` `anket-verisi` `sosyal-bilimler` `FAIR-data` `açık-veri`