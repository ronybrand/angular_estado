import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService, TranslationKey } from '../../services/translation.service';

@Pipe({
  name: 'translate',
  pure: false, // Reavalia quando o signal de idioma mudar
})
export class TranslatePipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  transform(key: TranslationKey | (string & {}), params?: Record<string, string | number>): string {
    return this.translationService.t(key, params);
  }
}
