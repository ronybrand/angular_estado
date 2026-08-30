import { Component, computed, input } from '@angular/core';
import { ICON_PATHS, IconName } from './icon-paths';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly size = input(16);

  protected readonly path = computed(() => ICON_PATHS[this.name()]);
}
