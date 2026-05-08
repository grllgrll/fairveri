'use client';

import { useForm } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useAssessmentStore, type AssessmentMetadata } from '@/lib/assessment-store';
import { FvButton } from '@/components/ui/fv-button';

const TR = {
  title: 'Sertifika bilgileri',
  description:
    'Değerlendirme tamamlandığında %85 ve üzeri puanla başarılı olursanız adınıza özel bir sertifika hazırlanır. Aşağıdaki bilgiler sertifikada yer alacaktır.',
  fullName: 'Ad Soyad',
  fullNamePh: 'Adınız ve soyadınız',
  institution: 'Kurum',
  institutionPh: 'Üniversite, kütüphane veya kurum adı',
  datasetTitle: 'Veri seti adı',
  datasetTitlePh: 'Değerlendireceğiniz veri setinin başlığı',
  doi: 'DOI / URL',
  doiPh: 'doi:10.5281/... veya https://...',
  doiHint: 'İsteğe bağlı — sertifikada dipnot olarak görünür.',
  email: 'E-posta',
  emailPh: 'siz@kurum.edu.tr',
  emailHint: 'İsteğe bağlı — sertifikada görünmez, sadece bizim kayıt için.',
  required: 'Zorunlu alan',
  invalidEmail: 'Geçerli bir e-posta girin',
  cta: 'Değerlendirmeye başla',
};

const EN = {
  title: 'Certificate information',
  description:
    'If you score 85% or higher you will receive a personalised certificate. The following details will appear on it.',
  fullName: 'Full name',
  fullNamePh: 'Your full name',
  institution: 'Institution',
  institutionPh: 'University, library or organisation',
  datasetTitle: 'Dataset title',
  datasetTitlePh: 'Title of the dataset you are assessing',
  doi: 'DOI / URL',
  doiPh: 'doi:10.5281/... or https://...',
  doiHint: 'Optional — appears as a footnote on the certificate.',
  email: 'Email',
  emailPh: 'you@institution.edu',
  emailHint: 'Optional — for our records only, not shown on the certificate.',
  required: 'Required',
  invalidEmail: 'Enter a valid email',
  cta: 'Start the assessment',
};

interface Props {
  onSubmit: () => void;
}

export function AssessmentMetadataForm({ onSubmit }: Props) {
  const { language } = useLanguage();
  const s = language === 'en' ? EN : TR;
  const setMetadata = useAssessmentStore((st) => st.setMetadata);
  const existing = useAssessmentStore((st) => st.metadata);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AssessmentMetadata>({
    defaultValues: existing ?? {
      fullName: '',
      institution: '',
      datasetTitle: '',
      doi: '',
      email: '',
    },
  });

  const labelCls = 'mb-1.5 block text-[13px] font-medium text-ink-2';
  const hintCls = 'mt-1 text-[12px] text-muted';
  const errCls = 'mt-1 text-[12px] text-a-fg';
  const inputCls =
    'w-full rounded-xl border border-line bg-bg px-4 py-3 text-[15px] text-ink placeholder:text-muted focus:border-brand focus:outline-none';
  const inputErr = 'border-a-dot/60 focus:border-a-dot';

  const submit = handleSubmit((data) => {
    const cleaned: AssessmentMetadata = {
      fullName: data.fullName.trim(),
      institution: data.institution.trim(),
      datasetTitle: data.datasetTitle.trim(),
      doi: data.doi?.trim() || undefined,
      email: data.email?.trim() || undefined,
    };
    setMetadata(cleaned);
    onSubmit();
  });

  return (
    <form onSubmit={submit} className="mx-auto flex max-w-[640px] flex-col gap-5 rounded-3xl border border-line bg-surface p-7 shadow-xs lg:p-10">
      <header>
        <h2 className="text-[22px] font-bold text-ink">{s.title}</h2>
        <p className="mt-1 text-[14px] leading-relaxed text-ink-2">{s.description}</p>
      </header>

      <div>
        <label htmlFor="fullName" className={labelCls}>
          {s.fullName} *
        </label>
        <input
          id="fullName"
          type="text"
          placeholder={s.fullNamePh}
          {...register('fullName', { required: s.required })}
          className={`${inputCls} ${errors.fullName ? inputErr : ''}`}
        />
        {errors.fullName && <p className={errCls}>{errors.fullName.message}</p>}
      </div>

      <div>
        <label htmlFor="institution" className={labelCls}>
          {s.institution} *
        </label>
        <input
          id="institution"
          type="text"
          placeholder={s.institutionPh}
          {...register('institution', { required: s.required })}
          className={`${inputCls} ${errors.institution ? inputErr : ''}`}
        />
        {errors.institution && <p className={errCls}>{errors.institution.message}</p>}
      </div>

      <div>
        <label htmlFor="datasetTitle" className={labelCls}>
          {s.datasetTitle} *
        </label>
        <input
          id="datasetTitle"
          type="text"
          placeholder={s.datasetTitlePh}
          {...register('datasetTitle', { required: s.required })}
          className={`${inputCls} ${errors.datasetTitle ? inputErr : ''}`}
        />
        {errors.datasetTitle && <p className={errCls}>{errors.datasetTitle.message}</p>}
      </div>

      <div>
        <label htmlFor="doi" className={labelCls}>
          {s.doi}
        </label>
        <input
          id="doi"
          type="text"
          placeholder={s.doiPh}
          {...register('doi')}
          className={inputCls}
        />
        <p className={hintCls}>{s.doiHint}</p>
      </div>

      <div>
        <label htmlFor="email" className={labelCls}>
          {s.email}
        </label>
        <input
          id="email"
          type="email"
          placeholder={s.emailPh}
          {...register('email', {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: s.invalidEmail,
            },
          })}
          className={`${inputCls} ${errors.email ? inputErr : ''}`}
        />
        {errors.email ? (
          <p className={errCls}>{errors.email.message}</p>
        ) : (
          <p className={hintCls}>{s.emailHint}</p>
        )}
      </div>

      <div className="pt-2">
        <FvButton type="submit" size="lg" className="w-full sm:w-auto">
          {s.cta}
          <ArrowRight className="h-4 w-4" />
        </FvButton>
      </div>
    </form>
  );
}
