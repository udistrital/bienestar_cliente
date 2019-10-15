import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  templateUrl: './footer.component.html',
})

export class FooterComponent {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private translate: TranslateService,
    private domSanitizer: DomSanitizer,
    ) {
    this.matIconRegistry.addSvgIcon(
      'clock-outline',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'presupuesto/../assets/images/clock-outline.svg'
        )
      );
    this.matIconRegistry.addSvgIcon(
      'globe-outline',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'presupuesto/../assets/images/globe-outline.svg'
        )
      );
    this.matIconRegistry.addSvgIcon(
      'at-outline',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'presupuesto/../assets/images/at-outline.svg'
        )
      );
    this.matIconRegistry.addSvgIcon(
      'phone-outline',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'presupuesto/../assets/images/phone-outline.svg'
        )
      );

    this.matIconRegistry.addSvgIcon(
      'pin-outline',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'presupuesto/../assets/images/pin-outline.svg'
      )
    );
    translate.use(translate.getBrowserLang());
  }
}

