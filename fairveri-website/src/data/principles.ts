export type PrincipleLetter = 'F' | 'A' | 'I' | 'R';
export type PrincipleColor = 'f' | 'a' | 'i' | 'r';

export interface Criterion {
  id: string;
  tr: string;
  en: string;
}

export interface Principle {
  letter: PrincipleLetter;
  color: PrincipleColor;
  word: string;
  trWord: string;
  body: { tr: string; en: string };
  preview: { tr: string; en: string };
  crits: Criterion[];
}

export const PRINCIPLES: Principle[] = [
  {
    letter: 'F',
    color: 'f',
    word: 'Findable',
    trWord: 'Bulunabilirlik',
    body: {
      tr: 'Hem insanlar hem makineler verinizi bulabilmeli. Kalıcı bir tanımlayıcı (DOI), zengin meta veri ve aranabilir bir dizin şarttır. Veri bulunamazsa, hiç var olmamış demektir.',
      en: 'Both humans and machines should be able to find your data. A persistent identifier (DOI), rich metadata and a searchable index are essential. Data that cannot be found does not exist.',
    },
    preview: {
      tr: 'DOI ile bulunabilir, zengin meta veri ile betimlenebilir.',
      en: 'Discoverable via DOI, described with rich metadata.',
    },
    crits: [
      { id: 'F1', tr: 'Veriye küresel olarak benzersiz, kalıcı tanımlayıcı atanır (DOI, Handle).', en: 'Data is assigned a globally unique and persistent identifier (DOI, Handle).' },
      { id: 'F2', tr: 'Veri zengin meta veri ile betimlenir.', en: 'Data is described with rich metadata.' },
      { id: 'F3', tr: 'Meta veri, verinin tanımlayıcısını açıkça içerir.', en: 'Metadata clearly and explicitly includes the data identifier.' },
      { id: 'F4', tr: 'Meta veri aranabilir bir kaynakta dizinlenir.', en: 'Metadata is registered in a searchable resource.' },
    ],
  },
  {
    letter: 'A',
    color: 'a',
    word: 'Accessible',
    trWord: 'Erişilebilirlik',
    body: {
      tr: 'Veri standart, açık ve evrensel olarak uygulanabilen bir protokolle erişilebilir olmalıdır. Erişim ücretsiz olmasa veya kimlik doğrulaması gerektirse bile, kuralların açıkça belgelenmesi gerekir.',
      en: 'Data should be retrievable via a standard, open and universally implementable protocol. Even when access is restricted or requires authentication, the rules must be clearly documented.',
    },
    preview: {
      tr: 'Standart protokollerle erişilebilir, kurallar açık.',
      en: 'Reachable through standard protocols, with clear rules.',
    },
    crits: [
      { id: 'A1', tr: 'Tanımlayıcı kullanılarak standart bir protokolle alınabilir.', en: 'Retrievable by its identifier using a standardised protocol.' },
      { id: 'A1.1', tr: 'Protokol açık, ücretsiz ve evrensel olarak uygulanabilirdir (HTTPS).', en: 'The protocol is open, free and universally implementable (HTTPS).' },
      { id: 'A1.2', tr: 'Gerektiğinde kimlik doğrulama ve yetkilendirme prosedürü tanımlıdır.', en: 'Authentication and authorization procedures are defined where needed.' },
      { id: 'A2', tr: 'Veri kaldırılsa bile meta veri erişilebilir kalır.', en: 'Metadata remains accessible even when the data is no longer available.' },
    ],
  },
  {
    letter: 'I',
    color: 'i',
    word: 'Interoperable',
    trWord: 'Birlikte çalışabilirlik',
    body: {
      tr: 'Veri başka veri ve sistemlerle bütünleşebilmelidir. Açık formatlar, ortak diller (RDF, JSON-LD) ve kontrollü kelime dağarcıkları (ORCID, ROR) kullanılır.',
      en: 'Data should be able to integrate with other data and systems. Use open formats, shared languages (RDF, JSON-LD) and controlled vocabularies (ORCID, ROR).',
    },
    preview: {
      tr: 'Ortak diller, kontrollü kelime dağarcığı, açık formatlar.',
      en: 'Shared vocabularies, controlled terms, open formats.',
    },
    crits: [
      { id: 'I1', tr: 'Bilgi temsilinde resmi, paylaşılan, geniş kapsamlı bir dil kullanır.', en: 'Uses a formal, accessible, shared and broadly applicable language for representation.' },
      { id: 'I2', tr: 'FAIR prensiplerine uyan kelime dağarcıkları kullanılır.', en: 'Uses vocabularies that themselves follow FAIR principles.' },
      { id: 'I3', tr: 'Diğer veri kümelerine nitelendirilmiş referanslar içerir.', en: 'Includes qualified references to other (meta)data.' },
    ],
  },
  {
    letter: 'R',
    color: 'r',
    word: 'Reusable',
    trWord: 'Yeniden kullanılabilirlik',
    body: {
      tr: 'Veri ve meta veri, çok sayıda öznitelik ile zengin biçimde betimlenir. Açık ve net bir kullanım lisansı ile köken bilgisi vardır. Topluluk standartlarına uyar.',
      en: 'Data and metadata are richly described with multiple accurate attributes. They include a clear, open licence and detailed provenance, and meet community standards.',
    },
    preview: {
      tr: 'Açık lisans, köken bilgisi, topluluk standartları.',
      en: 'Open licences, full provenance, community standards.',
    },
    crits: [
      { id: 'R1', tr: 'Çok sayıda doğru ve ilgili öznitelik ile betimlenir.', en: 'Richly described with a plurality of accurate and relevant attributes.' },
      { id: 'R1.1', tr: 'Açık ve erişilebilir bir kullanım lisansı vardır (CC0, CC BY).', en: 'Released with a clear and accessible data usage licence (CC0, CC BY).' },
      { id: 'R1.2', tr: 'Kökeni ve oluşum süreci ayrıntılı şekilde belgelenir.', en: 'Associated with detailed provenance.' },
      { id: 'R1.3', tr: 'Alanına özel topluluk standartlarına uyar.', en: 'Meets domain-relevant community standards.' },
    ],
  },
];

export const PRINCIPLES_BY_LETTER: Record<PrincipleLetter, Principle> = PRINCIPLES.reduce(
  (acc, p) => {
    acc[p.letter] = p;
    return acc;
  },
  {} as Record<PrincipleLetter, Principle>
);
