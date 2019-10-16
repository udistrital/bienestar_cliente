import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient} from '@angular/common/http';
import { TranslateHttpLoader} from '@ngx-translate/http-loader';

@NgModule({
  exports: [
    CommonModule,
    TranslateModule,
  ],
})

export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

