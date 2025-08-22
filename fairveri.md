# FAIR Veri Prensipleri
## Araştırma Verilerinin Bulunabilir, Erişilebilir, Birlikte Çalışabilir ve Yeniden Kullanılabilir Olması İçin Rehber

---

## İçindekiler

1. [FAIR Nedir?](#fair-nedir)
2. [FAIR'in Tarihi ve Önemi](#fairin-tarihi-ve-önemi)
3. [FAIR Prensipleri](#fair-prensipleri)
   - [F - Bulunabilirlik (Findable)](#f---bulunabilirlik-findable)
   - [A - Erişilebilirlik (Accessible)](#a---erişilebilirlik-accessible)
   - [I - Birlikte Çalışabilirlik (Interoperable)](#i---birlikte-çalışabilirlik-interoperable)
   - [R - Yeniden Kullanılabilirlik (Reusable)](#r---yeniden-kullanılabilirlik-reusable)
4. [Neden FAIR?](#neden-fair)
5. [FAIR Uygulama Rehberi](#fair-uygulama-rehberi)
6. [Metadata Standartları](#metadata-standartları)
7. [FAIR Değerlendirme Araçları](#fair-değerlendirme-araçları)
8. [Veri Depoları ve Havuzları](#veri-depoları-ve-havuzları)
9. [Türkiye'de FAIR](#türkiyede-fair)
10. [Pratik Örnekler](#pratik-örnekler)
11. [Sık Sorulan Sorular](#sık-sorulan-sorular)
12. [Kaynaklar ve İleri Okuma](#kaynaklar-ve-ileri-okuma)

---

## FAIR Nedir?

FAIR, araştırma verilerinin ve dijital nesnelerin **Bulunabilir** (Findable), **Erişilebilir** (Accessible), **Birlikte Çalışabilir** (Interoperable) ve **Yeniden Kullanılabilir** (Reusable) olması gerektiğini belirten bir dizi rehber ilkedir.

### Temel Özellikler:
- 🤖 **Makine-eylemlenebilirlik**: FAIR prensipleri, verilerin hem insanlar hem de makineler tarafından otomatik olarak bulunması, erişilmesi ve kullanılması üzerine odaklanır
- 🌍 **Evrensel Uygulanabilirlik**: Tüm bilimsel disiplinlerde uygulanabilir
- 📊 **Veri Yönetim Çerçevesi**: Araştırmacılara veri varlıklarını yönetmede yardımcı olur

> **Önemli Not**: FAIR veri mutlaka "açık veri" anlamına gelmez. Veriler FAIR olabilir ancak erişim kısıtlamaları içerebilir.

---

## FAIR'in Tarihi ve Önemi

### Tarihsel Gelişim

**2014** - Lorentz Workshop "Jointly Designing a Data FAIRport" çalıştayında ilk konsept oluşturuldu

**2016** - FAIR Rehber İlkeleri *Scientific Data* dergisinde yayınlandı

**2016** - G20 Hangzhou zirvesinde liderler FAIR prensiplerinin uygulanmasını destekledi

**2017** - Almanya, Hollanda ve Fransa GO FAIR girişimini başlattı

**2020** - Sorbonne Deklarasyonu ile dünya üniversiteleri FAIR'e bağlılık gösterdi

**2025** - Türkiye'de FAIR veri prensipleri yaygınlaşıyor

### Neden Önemli?

- 💰 **Ekonomik Etki**: Avrupa'da FAIR olmayan veriler nedeniyle yılda 10.2 milyar Euro kayıp
- 🔬 **Bilimsel İlerleme**: Veri tekrarı ve yeniden kullanım ile araştırma verimliliği artışı
- 🌐 **Küresel İşbirliği**: Uluslararası araştırma projelerinde veri paylaşımı kolaylaşması

---

## FAIR Prensipleri

### F - Bulunabilirlik (Findable)

Verilerin bulunabilir olması, araştırma verilerini yeniden kullanmanın ilk adımıdır. Hem insanlar hem de bilgisayarlar için verilerin kolayca bulunabilir olması gerekir.

#### F1. (Meta)verilere benzersiz ve kalıcı tanımlayıcı atanmalı
**Örnek**: DOI (Digital Object Identifier) kullanımı
```
doi:10.5281/zenodo.123456
```

#### F2. Veriler zengin metadata ile tanımlanmalı
**Örnek Metadata Alanları**:
- Başlık
- Yazar(lar)
- Oluşturma tarihi
- Açıklama
- Anahtar kelimeler
- Metodoloji
- Veri formatı

#### F3. Metadata, tanımladığı verinin tanımlayıcısını açıkça içermeli
```json
{
  "dataset_id": "doi:10.5281/zenodo.123456",
  "title": "Türkiye İklim Değişikliği Veri Seti",
  "description": "2020-2025 yılları arası iklim verileri"
}
```

#### F4. (Meta)veriler aranabilir bir kaynağa kaydedilmeli
**Önerilen Platformlar**:
- Ulusal: APERTA, TÜBİTAK Açık Arşiv
- Uluslararası: Zenodo, Figshare, Dryad

### A - Erişilebilirlik (Accessible)

Kullanıcı gerekli verileri bulduğunda, muhtemelen kimlik doğrulama ve yetkilendirme dahil olmak üzere bunlara nasıl erişilebileceğini bilmelidir.

#### A1. (Meta)veriler standartlaştırılmış iletişim protokolü ile erişilebilir olmalı
**Örnek Protokoller**:
- HTTP/HTTPS
- FTP
- REST API

#### A1.1 Protokol açık, ücretsiz ve evrensel olarak uygulanabilir olmalı

#### A1.2 Protokol gerektiğinde kimlik doğrulama ve yetkilendirmeye izin vermeli

**Erişim Seviyeleri Örneği**:
```
├── Açık Erişim (Herkes)
├── Kayıtlı Kullanıcılar
├── Kurumsal Erişim
└── Özel İzinli Erişim
```

#### A2. Veriler artık mevcut olmadığında bile metadata'ya erişilebilir olmalı

### I - Birlikte Çalışabilirlik (Interoperable)

Veriler genellikle diğer verilerle entegre edilmesi gerekir. Ayrıca, veriler uygulamalar veya iş akışları ile analiz, depolama ve işleme için birlikte çalışabilir olmalıdır.

#### I1. (Meta)veriler bilgi temsili için resmi, erişilebilir, paylaşılan ve geniş çapta uygulanabilir bir dil kullanmalı

**Önerilen Formatlar**:
- JSON-LD
- RDF
- XML
- CSV (yapılandırılmış)

#### I2. (Meta)veriler FAIR prensiplerini takip eden kelime dağarcıkları kullanmalı

**Kontrollü Kelime Dağarcıkları Örnekleri**:
- ORCID (araştırmacı kimlikleri)
- ROR (kurum kimlikleri)
- MeSH (tıp terimleri)
- AGROVOC (tarım terimleri)

#### I3. (Meta)veriler diğer (meta)verilere nitelikli referanslar içermeli

```json
{
  "relatedDatasets": [
    {
      "identifier": "doi:10.5281/zenodo.789012",
      "relationType": "IsDerivedFrom"
    }
  ]
}
```

### R - Yeniden Kullanılabilirlik (Reusable)

FAIR'in nihai hedefi verilerin yeniden kullanımını optimize etmektir. Bunu başarmak için, metadata ve veriler farklı ortamlarda çoğaltılabilmeleri ve/veya birleştirilebilmeleri için iyi tanımlanmış olmalıdır.

#### R1. (Meta)veriler çok sayıda doğru ve ilgili özellikle zengin bir şekilde tanımlanmalı

**Minimum Metadata Öğeleri**:
- Veri toplama metodolojisi
- Kalite kontrol prosedürleri
- Değişken tanımları
- Birimler ve ölçüler
- Eksik veri açıklamaları

#### R1.1. (Meta)veriler açık ve erişilebilir bir veri kullanım lisansı ile yayınlanmalı

**Önerilen Lisanslar**:
- CC0 - Kamu Malı
- CC BY - Atıf
- CC BY-SA - Atıf-AynıLisanslaPaylaş

#### R1.2. (Meta)veriler detaylı köken bilgisi ile ilişkilendirilmeli

**Köken Bilgisi Örnekleri**:
- Veri toplama tarihi ve yeri
- Kullanılan cihazlar ve yazılımlar
- Veri işleme adımları
- Sürüm geçmişi

#### R1.3. (Meta)veriler alana özgü topluluk standartlarını karşılamalı

---

## Neden FAIR?

### Araştırmacılar İçin Faydaları

✅ **Görünürlük Artışı**: FAIR veriler daha kolay bulunur ve atıf alır

✅ **İşbirliği Fırsatları**: Diğer araştırmacılarla veri paylaşımı kolaylaşır

✅ **Zaman Tasarrufu**: İyi dokümante edilmiş veriler gelecekte tekrar kullanılabilir

✅ **Fon Gereksinimleri**: Birçok fon sağlayıcı FAIR veri yönetimi planı istemektedir

### Kurumlar İçin Faydaları

🏛️ **Kurumsal İtibar**: FAIR uyumlu kurumlar araştırma kalitesiyle öne çıkar

🏛️ **Veri Yönetimi**: Sistematik veri yönetimi altyapısı oluşur

🏛️ **Uyumluluk**: Ulusal ve uluslararası veri politikalarına uyum sağlanır

### Toplum İçin Faydaları

🌍 **Şeffaflık**: Kamu kaynaklarıyla üretilen verilere erişim

🌍 **İnovasyon**: Açık veriler yeni keşiflere ve uygulamalara yol açar

🌍 **Verimlilik**: Veri tekrarının önlenmesiyle kaynak tasarrufu

---

## FAIR Uygulama Rehberi

### 1. Planlama Aşaması

#### Veri Yönetim Planı (VYP) Oluşturma

**VYP İçeriği**:
1. **Veri Tanımı**
   - Ne tür veriler toplanacak?
   - Veri formatları neler olacak?
   - Tahmini veri boyutu nedir?

2. **Metadata ve Dokümantasyon**
   - Hangi metadata standardı kullanılacak?
   - Nasıl dokümante edilecek?

3. **Depolama ve Yedekleme**
   - Veriler nerede saklanacak?
   - Yedekleme stratejisi nedir?

4. **Paylaşım ve Erişim**
   - Veriler ne zaman paylaşılacak?
   - Erişim kısıtlamaları var mı?

5. **Uzun Dönem Koruma**
   - Veriler ne kadar süre saklanacak?
   - Hangi veri deposu kullanılacak?

### 2. Veri Toplama Aşaması

#### İyi Uygulamalar

**Dosya Adlandırma Kuralları**:
```
YYYY-MM-DD_ProjeAdi_VeriTipi_Versiyon
Örnek: 2025-01-15_IklimCalisma_SicaklikVerisi_v1.0
```

**Klasör Yapısı Örneği**:
```
ProjeAdi/
├── 0_HamVeriler/
├── 1_TemizVeriler/
├── 2_Analizler/
├── 3_Dokümantasyon/
│   ├── Metodoloji.md
│   ├── DeğişkenTanımları.csv
│   └── VeriSözlüğü.pdf
└── README.md
```

### 3. Metadata Oluşturma

#### Dublin Core Örneği
```xml
<metadata>
  <dc:title>Türkiye İklim Değişikliği Veri Seti 2020-2025</dc:title>
  <dc:creator>Dr. Ayşe Yılmaz</dc:creator>
  <dc:subject>İklim değişikliği</dc:subject>
  <dc:subject>Sıcaklık verileri</dc:subject>
  <dc:description>
    Türkiye'nin 81 ilinde 2020-2025 yılları arasında
    toplanan günlük sıcaklık, nem ve yağış verileri
  </dc:description>
  <dc:publisher>Örnek Üniversitesi</dc:publisher>
  <dc:date>2025-01-15</dc:date>
  <dc:type>Dataset</dc:type>
  <dc:format>CSV</dc:format>
  <dc:identifier>doi:10.5281/zenodo.123456</dc:identifier>
  <dc:language>tr</dc:language>
  <dc:rights>CC BY 4.0</dc:rights>
</metadata>
```

### 4. Veri Temizleme ve Hazırlama

**Kontrol Listesi**:
- [ ] Eksik veriler belirtildi mi? (örn: -999, NA, NULL)
- [ ] Değişken isimleri anlaşılır mı?
- [ ] Birimler belirtildi mi?
- [ ] Tarih formatları tutarlı mı?
- [ ] Karakter kodlaması UTF-8 mi?
- [ ] Kişisel veriler anonimleştirildi mi?

### 5. Veri Paylaşımı

#### Veri Deposu Seçimi

| Özellik | Zenodo | Figshare | Dryad | APERTA |
|---------|--------|----------|--------|---------|
| **Maliyet** | Ücretsiz | Ücretsiz (20GB) | Ücretli | Ücretsiz |
| **DOI** | ✓ | ✓ | ✓ | ✓ |
| **Boyut Limiti** | 50GB | 20GB | Sınırsız | Değişken |
| **Versiyon Kontrolü** | ✓ | ✓ | ✗ | ✓ |
| **Türkçe Destek** | ✗ | ✗ | ✗ | ✓ |

---

## Metadata Standartları

### Dublin Core

En yaygın kullanılan genel amaçlı metadata standardı. 15 temel element içerir:

1. **Title** (Başlık)
2. **Creator** (Oluşturucu)
3. **Subject** (Konu)
4. **Description** (Açıklama)
5. **Publisher** (Yayıncı)
6. **Contributor** (Katkıda Bulunan)
7. **Date** (Tarih)
8. **Type** (Tür)
9. **Format** (Format)
10. **Identifier** (Tanımlayıcı)
11. **Source** (Kaynak)
12. **Language** (Dil)
13. **Relation** (İlişki)
14. **Coverage** (Kapsam)
15. **Rights** (Haklar)

### DataCite Metadata Şeması

Araştırma verileri için özel olarak tasarlanmış, DOI tahsisi için gerekli minimum metadata:

**Zorunlu Alanlar**:
- Identifier (DOI)
- Creator(s)
- Title(s)
- Publisher
- PublicationYear
- ResourceType

**Önerilen Alanlar**:
- Subject(s)
- Contributor(s)
- Date(s)
- RelatedIdentifier(s)
- Description(s)
- GeoLocation(s)

### Alan-Özel Standartlar

**Sosyal Bilimler**: DDI (Data Documentation Initiative)
```xml
<var name="cinsiyet" ID="V1">
  <labl>Katılımcının Cinsiyeti</labl>
  <catgry>
    <catValu>1</catValu>
    <labl>Kadın</labl>
  </catgry>
  <catgry>
    <catValu>2</catValu>
    <labl>Erkek</labl>
  </catgry>
</var>
```

**Biyoloji**: Darwin Core
- Tür adları için standartlaştırılmış terimler
- Coğrafi konum bilgileri
- Toplama metodu ve zamanı

**Kimya**: CIF (Crystallographic Information File)
- Kristal yapı verileri
- Kimyasal formüller
- Deneysel koşullar

---

## FAIR Değerlendirme Araçları

### 1. F-UJI (Automated FAIR Data Assessment Tool)

**Özellikler**:
- 🤖 Otomatik değerlendirme
- 📊 16 FAIR metriği
- 🌐 Web tabanlı
- 🆓 Ücretsiz

**Kullanım**:
1. https://www.f-uji.net adresine gidin
2. Veri setinizin DOI veya URL'sini girin
3. "Assess" butonuna tıklayın
4. Sonuçları inceleyin

**Örnek Değerlendirme Sonucu**:
```
Findability:     ████████░░ 80%
Accessibility:   ██████░░░░ 60%
Interoperability:████░░░░░░ 40%
Reusability:     ███████░░░ 70%
Overall FAIR:    ██████░░░░ 62.5%
```

### 2. FAIR-Aware

**Özellikler**:
- 📝 Anket tabanlı
- 👥 Eğitim odaklı
- 📚 Zengin rehberlik
- 🏢 Grup değerlendirmesi

**Kimler İçin Uygun**:
- FAIR'e yeni başlayanlar
- Eğitim verenler
- Araştırma grupları

### 3. FAIRshake

**Özellikler**:
- 🔬 Biyomedikal odaklı
- 🏅 FAIR rozetleri
- 🤝 Topluluk tabanlı
- 📊 Karşılaştırmalı analiz

### Değerlendirme Araçları Karşılaştırması

| Araç | Otomatik | Manuel | Ücretsiz | Türkçe | Disiplin |
|------|----------|--------|-----------|---------|----------|
| F-UJI | ✓ | ✗ | ✓ | ✗ | Genel |
| FAIR-Aware | ✗ | ✓ | ✓ | ✗ | Genel |
| FAIRshake | Kısmen | ✓ | ✓ | ✗ | Biyomedikal |
| ARDC Tool | ✗ | ✓ | ✓ | ✗ | Genel |

---

## Veri Depoları ve Havuzları

### Genel Amaçlı Depolar

#### Zenodo

**Avantajları**:
- ✅ Tamamen ücretsiz
- ✅ 50GB limit (daha fazlası talep edilebilir)
- ✅ Avrupa Birliği destekli
- ✅ GitHub entegrasyonu
- ✅ Tüm dosya formatları

**Dezavantajları**:
- ❌ Klasör yapısı yok
- ❌ Düzenleme imkanı sınırlı

**Kullanım Örneği**:
```python
# Zenodopy ile otomatik yükleme
from zenodopy import Zenodo

zen = Zenodo(access_token="your-token")
deposition = zen.create_deposition()
zen.upload_file(deposition, "veri.csv")
zen.publish_deposition(deposition)
```

#### Figshare

**Avantajları**:
- ✅ 20GB ücretsiz alan
- ✅ Görsel içerik için ideal
- ✅ Gömülü görüntüleyici
- ✅ Özel paylaşım linkleri

**Dezavantajları**:
- ❌ Toplu indirme zorluğu
- ❌ Sınırlı ücretsiz alan

#### Dryad

**Avantajları**:
- ✅ Profesyonel kürasyon
- ✅ Dergi entegrasyonları
- ✅ Yüksek kalite standartları

**Dezavantajları**:
- ❌ Ücretli ($120 temel)
- ❌ Düzenleme yapılamaz

### Türkiye'deki Veri Depoları

#### APERTA (TÜBİTAK)

**Özellikler**:
- 🇹🇷 Türkçe arayüz
- 🏛️ Ulusal altyapı
- 🔐 Güvenli depolama
- 📊 FAIR uyumlu

**Veri Yükleme Süreci**:
1. Sisteme kayıt olun
2. "Yeni Veri Seti" oluşturun
3. Metadata bilgilerini girin
4. Dosyaları yükleyin
5. Lisans seçin
6. Yayınlayın

#### Kurumsal Açık Arşivler

Türkiye'deki üniversitelerin çoğu DSpace tabanlı kurumsal arşivlere sahiptir:

- İTÜ Açık Arşiv
- ODTÜ Açık Arşiv
- Hacettepe Açık Arşiv
- Boğaziçi Üniversitesi Dijital Arşivi

### Alan-Özel Depolar

**Sosyal Bilimler**:
- ICPSR (International Consortium for Political and Social Research)
- UK Data Service
- CESSDA (Avrupa Sosyal Bilimler Veri Arşivi)

**Yaşam Bilimleri**:
- GenBank (genetik diziler)
- Protein Data Bank (protein yapıları)
- ArrayExpress (gen ifade verileri)

**Yer Bilimleri**:
- PANGAEA
- EarthChem
- IRIS (sismik veriler)

---

## Türkiye'de FAIR

### Mevcut Durum

Türkiye'de FAIR veri prensiplerinin benimsenmesi son yıllarda hız kazanmıştır:

**Kurumsal Gelişmeler**:
- TÜBİTAK Açık Bilim Politikası
- YÖK Açık Bilim ve Açık Erişim Yönergesi
- Türkiye Araştırma Verisi ve Açık Veri Görev Gücü

**Eğitim Girişimleri**:
- TÜBİTAK Araştırma Verileri Yönetimi Eğitim Portalı
- OpenAIRE Türkiye Yardım Masası
- Creative Commons Türkiye webinarları

### Türkçe Kaynaklar

1. **Açık Veri Açık Bilim (acikveri.ulakbim.gov.tr)**
   - Kapsamlı Türkçe rehberler
   - Veri yönetimi araçları
   - Örnek uygulamalar

2. **TÜBİTAK Veri Yönetimi Eğitimleri**
   - Online kurslar
   - Sertifika programları
   - Canlı webinarlar

3. **Üniversite Kütüphaneleri**
   - Veri yönetimi danışmanlığı
   - Metadata oluşturma desteği
   - Depo seçimi rehberliği

### Örnek Projeler

**FAIR4Health Projesi**:
- Sağlık verilerinin FAIRleştirilmesi
- SRDC liderliğinde
- AB Horizon 2020 destekli

**Türkiye Biyoçeşitlilik Veritabanı**:
- GBIF standartlarında
- Darwin Core metadata
- Açık erişimli

---

## Pratik Örnekler

### Örnek 1: Anket Verisi FAIRleştirme

**Senaryo**: Bir sosyal bilimler araştırması için toplanan anket verileri

#### Adım 1: Veri Hazırlama
```csv
# degisken_tanimlari.csv
degisken_adi,aciklama,tip,degerler
katilimci_id,Benzersiz katılımcı kimliği,sayısal,1-500
yas,Katılımcı yaşı,sayısal,18-65
cinsiyet,Katılımcı cinsiyeti,kategorik,"1=Kadın,2=Erkek,3=Belirtmek istemiyor"
egitim,Eğitim düzeyi,kategorik,"1=İlköğretim,2=Lise,3=Lisans,4=Lisansüstü"
```

#### Adım 2: Metadata Oluşturma (JSON)
```json
{
  "@context": "https://schema.org/",
  "@type": "Dataset",
  "name": "Türkiye Dijital Okuryazarlık Anketi 2025",
  "description": "Türkiye'de dijital okuryazarlık düzeyini ölçen ulusal anket çalışması",
  "url": "https://doi.org/10.5281/zenodo.7654321",
  "sameAs": "https://github.com/ornekuni/dijital-okuryazarlik",
  "license": "https://creativecommons.org/licenses/by/4.0/",
  "creator": {
    "@type": "Person",
    "name": "Dr. Mehmet Öz",
    "affiliation": "Örnek Üniversitesi",
    "identifier": "https://orcid.org/0000-0000-0000-0000"
  },
  "datePublished": "2025-01-15",
  "keywords": ["dijital okuryazarlık", "anket", "Türkiye", "sosyal bilimler"],
  "spatialCoverage": {
    "@type": "Place",
    "name": "Türkiye"
  },
  "temporalCoverage": "2024-06/2024-12",
  "distribution": {
    "@type": "DataDownload",
    "encodingFormat": "CSV",
    "contentUrl": "https://zenodo.org/record/7654321/files/anket_verileri.csv"
  }
}
```

#### Adım 3: README Dosyası
```markdown
# Türkiye Dijital Okuryazarlık Anketi 2025

## Genel Bakış
Bu veri seti, Türkiye'de dijital okuryazarlık düzeyini ölçmek amacıyla
2024 yılında gerçekleştirilen ulusal anket çalışmasının sonuçlarını içerir.

## Dosya Yapısı
- `anket_verileri.csv`: Ham anket verileri (n=5000)
- `degisken_tanimlari.csv`: Değişken açıklamaları
- `anket_formu.pdf`: Kullanılan anket formu
- `etik_kurul_onay.pdf`: Etik kurul onay belgesi

## Metodoloji
- Örnekleme: Tabakalı rastgele örnekleme
- Veri toplama: Online anket (Haziran-Aralık 2024)
- Hedef kitle: 18-65 yaş arası Türkiye'de yaşayan bireyler

## Kullanım
```r
# R ile okuma örneği
library(tidyverse)
veri <- read_csv("anket_verileri.csv", 
                 locale = locale(encoding = "UTF-8"))
```

## Lisans
CC BY 4.0 - Atıf yaparak kullanabilirsiniz

## İletişim
Dr. Mehmet Öz - mehmet.oz@ornekuni.edu.tr
```

### Örnek 2: Laboratuvar Verisi FAIRleştirme

**Senaryo**: Kimya laboratuvarında üretilen deneysel veriler

#### Veri Organizasyonu
```
KimyaDeneyi_2025/
├── 0_HamVeriler/
│   ├── 20250110_deney01_spektrum.csv
│   ├── 20250111_deney02_spektrum.csv
│   └── kalibrasyon_verileri.xlsx
├── 1_IslenmisDVeriler/
│   ├── normalize_spektrumlar.csv
│   └── analiz_sonuclari.csv
├── 2_Grafikler/
│   ├── spektrum_karsilastirma.png
│   └── kalibrasyon_egrisi.pdf
├── 3_Metadata/
│   ├── datacite_metadata.xml
│   ├── deneysel_kosullar.json
│   └── cihaz_bilgileri.txt
├── 4_Kodlar/
│   ├── veri_isleme.py
│   └── grafik_olusturma.R
└── README.md
```

#### Deneysel Koşullar Metadata'sı
```json
{
  "deneyBilgileri": {
    "baslik": "Yeni Sentezlenen Bileşiğin Spektroskopik Analizi",
    "baslangicTarihi": "2025-01-10",
    "bitisTarihi": "2025-01-15",
    "laboratuvar": "Örnek Üniversitesi Kimya Lab A-201"
  },
  "deneyselKosullar": {
    "sicaklik": {
      "deger": 25,
      "birim": "°C",
      "tolerans": "±0.5"
    },
    "basinc": {
      "deger": 101.325,
      "birim": "kPa"
    },
    "nem": {
      "deger": 45,
      "birim": "%",
      "tolerans": "±5"
    }
  },
  "kullanılanCihazlar": [
    {
      "ad": "UV-Vis Spektrofotometre",
      "model": "Shimadzu UV-1800",
      "kalibrasyonTarihi": "2024-12-01",
      "ayarlar": {
        "dalaBoyuAraligi": "200-800 nm",
        "cozunurluk": "1 nm",
        "taramaHizi": "orta"
      }
    }
  ],
  "kullanılanKimyasallar": [
    {
      "ad": "Örnek Bileşik A",
      "saflık": "99.9%",
      "tedarikci": "Sigma-Aldrich",
      "lotNo": "MKBH4567"
    }
  ]
}
```

### Örnek 3: Açık Kaynak Yazılım Projesi

**Senaryo**: Araştırma için geliştirilen analiz yazılımı

#### CITATION.cff Dosyası
```yaml
cff-version: 1.2.0
title: VeriAnaliz - Türkçe Veri Analizi Kütüphanesi
message: Bu yazılımı kullanıyorsanız, lütfen aşağıdaki şekilde atıf yapın
type: software
authors:
  - given-names: Ayşe
    family-names: Yılmaz
    email: ayse.yilmaz@ornekuni.edu.tr
    affiliation: Örnek Üniversitesi
    orcid: 'https://orcid.org/0000-0000-0000-0001'
identifiers:
  - type: doi
    value: 10.5281/zenodo.8765432
repository-code: 'https://github.com/ornekuni/verianaliz'
url: 'https://verianaliz.readthedocs.io'
keywords:
  - veri analizi
  - Türkçe
  - açık kaynak
license: MIT
version: 1.2.0
date-released: '2025-01-15'
```

---

## Sık Sorulan Sorular

### Genel Sorular

**S: FAIR veri ile Açık Veri arasındaki fark nedir?**

C: FAIR veri mutlaka açık olmak zorunda değildir. FAIR prensipleri verinin makine tarafından okunabilir, iyi tanımlanmış ve yönetilebilir olmasına odaklanır. Hassas veriler (örn: hasta verileri, ticari sır) FAIR olabilir ancak erişim kısıtlamaları içerebilir.

**S: Verilerimi FAIRleştirmek ne kadar zaman alır?**

C: Bu, veri setinizin büyüklüğüne ve karmaşıklığına bağlıdır. İyi planlanmış bir projede, veri toplama sırasında FAIR prensiplerini uygulamak ek %5-10 zaman gerektirir. Var olan verileri FAIRleştirmek daha uzun sürebilir.

**S: FAIR uyumluluğu için minimum gereksinimler nelerdir?**

C: Minimum olarak:
- Kalıcı tanımlayıcı (DOI gibi)
- Temel metadata (başlık, yazar, tarih, açıklama)
- Açık lisans bilgisi
- Makine okunabilir format

### Teknik Sorular

**S: Hangi dosya formatları FAIR için uygundur?**

C: Tercih sırası:
1. Açık, metin tabanlı formatlar (CSV, JSON, XML)
2. Yaygın kullanılan açık formatlar (HDF5, NetCDF)
3. Topluluk standartları (FITS, DICOM)
4. Kaçınılması gerekenler: Özel formatlar (.xlsx yerine .csv)

**S: Büyük veri setleri (>100GB) için öneriler?**

C: 
- Veriyi mantıklı parçalara bölün
- Her parça için ayrı DOI alın
- Ana DOI ile ilişkilendirin
- Bulut tabanlı çözümleri değerlendirin (AWS Open Data, Google Cloud Public Datasets)

**S: Sürekli güncellenen veriler nasıl yönetilir?**

C:
- Versiyon kontrolü kullanın
- Her önemli güncelleme için yeni versiyon yayınlayın
- Değişiklik günlüğü (CHANGELOG) tutun
- API üzerinden canlı veri sunmayı düşünün

### Lisans ve Hukuki Sorular

**S: Hangi lisansı seçmeliyim?**

C: Veri için önerilen lisanslar:
- **CC0**: Kamu malı, atıf zorunlu değil (en açık)
- **CC BY**: Atıf zorunlu
- **CC BY-SA**: Atıf + aynı lisansla paylaş
- **CC BY-NC**: Ticari olmayan kullanım

**S: Kişisel veri içeren araştırmalar için?**

C:
- KVKK/GDPR uyumlu anonimleştirme
- Erişim kontrollü depolar kullanın
- Metadata'yı açık, veriyi kapalı tutun
- Veri kullanım sözleşmesi hazırlayın

### Kurumsal Sorular

**S: Kurumumda FAIR'i nasıl teşvik edebilirim?**

C:
1. Pilot proje başlatın
2. Başarı hikayelerini paylaşın
3. Eğitimler düzenleyin
4. Kurumsal politika önerisi hazırlayın
5. Teşvik mekanizmaları önerin

**S: FAIR'in maliyeti nedir?**

C: Başlangıç yatırımı:
- Eğitim: 2-5 gün/kişi
- Altyapı: Mevcut sistemler genelde yeterli
- Depolama: Çoğu depo ücretsiz
- Uzun vadede tasarruf: Veri tekrarı önleme, işbirliği artışı

---

## Kaynaklar ve İleri Okuma

### Temel Kaynaklar

1. **Orijinal FAIR Makalesi**
   - Wilkinson, M. D. et al. (2016). The FAIR Guiding Principles for scientific data management and stewardship. Scientific Data, 3, 160018.

2. **GO FAIR Girişimi**
   - https://www.go-fair.org/

3. **FORCE11**
   - https://www.force11.org/

### Türkçe Kaynaklar

1. **TÜBİTAK Açık Bilim**
   - https://acikveri.ulakbim.gov.tr/

2. **Açık Bilim Türkiye**
   - https://acikbilimtr.org/

3. **OpenAIRE Türkiye**
   - https://www.openaire.eu/turkey

### Eğitim Materyalleri

1. **FOSTER Open Science**
   - https://www.fosteropenscience.eu/

2. **The Turing Way**
   - https://the-turing-way.netlify.app/

3. **FAIR Cookbook**
   - https://faircookbook.elixir-europe.org/

### Araçlar ve Yazılımlar

#### Metadata Oluşturma
- **DMPTool**: Veri yönetim planı oluşturma
- **CEDAR Workbench**: Metadata şablonları
- **Colectica**: DDI metadata editörü

#### Veri Temizleme
- **OpenRefine**: Veri temizleme ve dönüştürme
- **Trifacta Wrangler**: Veri hazırlama
- **DataWrangler**: Stanford'dan veri temizleme aracı

#### Veri Yayınlama
- **Dataverse**: Kurumsal veri deposu yazılımı
- **CKAN**: Açık veri portalı
- **DSpace**: Dijital depo yazılımı

### Topluluklar ve Ağlar

1. **Research Data Alliance (RDA)**
   - Uluslararası veri paylaşımı topluluğu
   - Çalışma grupları ve öneriler

2. **CODATA**
   - Bilimsel veri komitesi
   - Veri bilimi eğitimleri

3. **DataCite**
   - DOI sağlayıcı konsorsiyum
   - Metadata standartları

### Fon Kaynakları

1. **Horizon Europe**
   - Açık bilim gereksinimleri
   - Veri yönetimi planı zorunluluğu

2. **TÜBİTAK**
   - ARDEB projeleri
   - Açık erişim politikası

3. **Avrupa Araştırma Konseyi (ERC)**
   - FAIR veri gereksinimleri
   - Veri yönetimi desteği

---

## İletişim ve Katkıda Bulunma

Bu rehber sürekli güncellenen bir kaynaktır. Katkılarınızı bekliyoruz!

**Nasıl Katkıda Bulunabilirsiniz:**
- 🐛 Hata bildirimi
- 💡 Yeni içerik önerisi
- 🌍 Çeviri desteği
- 📚 Örnek ekleme

**E-posta**: fair-turkiye@example.org

**Lisans**: Bu rehber CC BY 4.0 lisansı ile yayınlanmıştır.

---

*Son güncelleme: Ocak 2025*