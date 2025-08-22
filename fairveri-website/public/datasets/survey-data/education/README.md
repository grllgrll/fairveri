# Ulusal Eğitim Memnuniyet Araştırması 2024

## 📋 Genel Bakış

Bu veri seti, Türkiye'deki eğitim sisteminin kalitesini öğretmen, veli, öğrenci ve yönetici perspektifinden değerlendiren kapsamlı bir araştırmanın sonuçlarını içermektedir.

## 📊 Veri Seti Bilgileri

- **Toplam katılımcı**: 12,500
- **Veri toplama dönemi**: Şubat-Mayıs 2024
- **Coğrafi kapsam**: Türkiye (7 bölge)
- **Dosya formatı**: CSV
- **Dosya boyutu**: ~3.2KB (örnek veri)

## 👥 Katılımcı Profili

### Rollere Göre Dağılım
- **Öğretmenler**: 5,000 (%40)
- **Veliler**: 4,500 (%36)
- **Öğrenciler**: 2,000 (%16)
- **Yöneticiler**: 1,000 (%8)

### Bölgesel Dağılım
- Marmara: %28
- İç Anadolu: %18
- Ege: %15
- Akdeniz: %12
- Karadeniz: %10
- Doğu Anadolu: %9
- Güneydoğu Anadolu: %8

## 📋 Değişken Açıklamaları

### Demografik Bilgiler
- `participant_id`: Katılımcı kimlik numarası
- `age`: Yaş
- `gender`: Cinsiyet (Female, Male)
- `role`: Rol (Teacher, Parent, Student, Administrator)
- `region`: Bölge
- `education_level`: Eğitim düzeyi
- `years_experience`: Deneyim yılı (öğretmen/yöneticiler için)

### Memnuniyet Ölçümleri (1-10 ölçeği)
- `satisfaction_teaching`: Öğretim kalitesi memnuniyeti
- `satisfaction_curriculum`: Müfredat memnuniyeti
- `satisfaction_resources`: Kaynak yeterliliği memnuniyeti
- `satisfaction_admin`: Yönetim memnuniyeti

### Önem Düzeyleri (1-10 ölçeği)
- `importance_technology`: Teknoloji kullanımının önemi
- `importance_creativity`: Yaratıcılığın önemi
- `importance_assessment`: Değerlendirmenin önemi

### Ek Bilgiler
- `remote_teaching_comfort`: Uzaktan öğretim konfor düzeyi
- `professional_development_hours`: Mesleki gelişim saatleri
- `salary_satisfaction`: Maaş memnuniyeti
- `class_size_avg`: Ortalama sınıf mevcudu
- `career_plans`: Kariyer planları
- `suggestions`: Öneriler (açık uçlu)

## 🔍 Kullanım Örnekleri

### 1. Memnuniyet Analizi
```python
import pandas as pd

df = pd.read_csv('education_survey_data.csv')
mean_satisfaction = df['satisfaction_teaching'].mean()
print(f"Ortalama öğretim memnuniyeti: {mean_satisfaction:.2f}")
```

### 2. Bölgesel Karşılaştırma
```python
regional_analysis = df.groupby('region')['satisfaction_curriculum'].mean()
print(regional_analysis.sort_values(ascending=False))
```

### 3. Rol Bazlı Analiz
```python
role_comparison = df.groupby('role')[['satisfaction_teaching', 'satisfaction_curriculum']].mean()
print(role_comparison)
```

## 📈 Temel İstatistikler

### Genel Memnuniyet Düzeyleri
- Öğretim kalitesi: 6.8/10
- Müfredat: 5.4/10
- Kaynak yeterliliği: 4.2/10
- Yönetim: 5.8/10

### En Önemli Bulgular
1. Kaynak yetersizliği en büyük sorun alanı
2. Teknoloji entegrasyonu yüksek öncelik
3. Bölgesel farklılıklar belirgin
4. Öğretmenlerin %15'i kariyer değişikliği düşünüyor

## 🎯 FAIR Prensipler

### Findable (Bulunabilir)
- ✅ DOI: 10.5281/zenodo.education.survey.2024
- ✅ Zengin metadata (Schema.org)
- ✅ Anahtar kelimeler tanımlanmış

### Accessible (Erişilebilir)
- ✅ Creative Commons CC BY 4.0 lisansı
- ✅ CSV formatında açık erişim
- ✅ HTTP/HTTPS protokolü

### Interoperable (Birlikte Çalışabilir)
- ✅ JSON-LD metadata
- ✅ Dublin Core standartları
- ✅ Standard kodlama (UTF-8)

### Reusable (Yeniden Kullanılabilir)
- ✅ Detaylı metodoloji dokümantasyonu
- ✅ Kullanım örnekleri
- ✅ Provenance bilgisi

## 📄 Alıntı

```bibtex
@dataset{education_survey_2024,
  title={Ulusal Eğitim Memnuniyet Araştırması 2024},
  author={Demir, Ayşe and Kaya, Mehmet},
  year={2024},
  publisher={FairVeri},
  doi={10.5281/zenodo.education.survey.2024},
  url={https://fairveri.org/datasets/survey-data/education/}
}
```

## 📞 İletişim

- **E-posta**: education.research@fairveri.org
- **Kurumsal web**: https://fairveri.org
- **Araştırma koordinatörü**: Dr. Ayşe Demir

## 📄 Lisans

Bu veri seti Creative Commons Attribution 4.0 International (CC BY 4.0) lisansı altında yayınlanmıştır.