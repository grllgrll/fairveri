'use client';

import Link from "next/link";
import { useTranslation } from "@/contexts/language-context";

export function BilingualFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t bg-background border-border">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-semibold">
              <span className="text-primary">Fair</span>Veri
            </h3>
            <p className="text-muted-foreground">
              {t('footer.description')}
            </p>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/assessment"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-accent/10 text-accent hover:bg-accent/20 focus:bg-accent/20 transition-all duration-200 hover:scale-105 focus:scale-105"
              >
                {t('footer.links.quickAssessment')}
              </Link>
              <Link
                href="/search"
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80 focus:bg-muted/80 transition-all duration-200 hover:scale-105 focus:scale-105"
              >
                {t('footer.links.search')}
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">{t('footer.fairPrinciples')}</h4>
            <div className="space-y-3">
              <Link
                href="/principles#findable"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('fair.findable.title')}
              </Link>
              <Link
                href="/principles#accessible"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('fair.accessible.title')}
              </Link>
              <Link
                href="/principles#interoperable"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('fair.interoperable.shortTitle')}
              </Link>
              <Link
                href="/principles#reusable"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('fair.reusable.shortTitle')}
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">{t('footer.toolsAndResources')}</h4>
            <div className="space-y-3">
              <Link
                href="/tools"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('footer.links.assessmentTools')}
              </Link>
              <Link
                href="/examples"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('footer.links.practicalExamples')}
              </Link>
              <Link
                href="/resources"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('footer.links.resourceLibrary')}
              </Link>
              <Link
                href="/learn"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('footer.links.learningGuide')}
              </Link>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">{t('footer.supportAndInfo')}</h4>
            <div className="space-y-3">
              <Link
                href="/faq"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('footer.links.frequentlyAsked')}
              </Link>
              <Link
                href="/search"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('common.search')}
              </Link>
              <Link
                href="/assessment"
                className="block text-muted-foreground hover:text-primary focus:text-primary transition-colors duration-200 min-h-touch touch-manipulation px-1 py-1 rounded hover:bg-muted/50 focus:bg-muted/50"
              >
                {t('footer.links.dataAssessment')}
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 lg:mt-16 pt-8 lg:pt-12 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 lg:gap-8">
            <div className="text-sm text-muted-foreground">
              <p>{t('footer.copyright')}</p>
              <p className="mt-1">{t('footer.tagline')}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link 
                href="/privacy" 
                className="hover:text-primary focus:text-primary transition-colors duration-200"
                aria-label={t('footer.links.privacy')}
              >
                {t('footer.links.privacy')}
              </Link>
              <Link 
                href="/terms" 
                className="hover:text-primary focus:text-primary transition-colors duration-200"
                aria-label={t('footer.links.terms')}
              >
                {t('footer.links.terms')}
              </Link>
              <Link 
                href="/contact" 
                className="hover:text-primary focus:text-primary transition-colors duration-200"
                aria-label={t('footer.links.contact')}
              >
                {t('footer.links.contact')}
              </Link>
              <Link 
                href="/accessibility" 
                className="hover:text-primary focus:text-primary transition-colors duration-200"
                aria-label={t('footer.links.accessibility')}
              >
                {t('footer.links.accessibility')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}