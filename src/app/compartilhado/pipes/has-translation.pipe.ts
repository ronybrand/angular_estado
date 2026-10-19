import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Pipe({
  name: 'hasTranslation',
  standalone: true,
  pure: true,
})
export class HasTranslationPipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  /**
   * Returns true if a translation exists for the given key in the current language.
   * The TranslationService returns the key itself when a translation is missing.
   */
  transform(key: string): boolean {
    const translated = this.translationService.t(key);
    return translated !== key;
  }
}
