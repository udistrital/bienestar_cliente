import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-link-smart-table',
  template: `
    <p>
      link-smart-table works!
    </p>
  `,
  styles: []
})
export class LinkSmartTableComponent implements OnInit {

  @Input() domain:      string;
  @Input() vigencia:    any;
  @Input() link_router: string;

  constructor(
            private router:    Router
  ) { }

  ngOnInit() {
    this.router.navigate(['/pages/plan-cuentas/', this.domain, this.vigencia, this.link_router ]);
  }

}
