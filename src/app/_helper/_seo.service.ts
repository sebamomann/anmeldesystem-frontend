import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Injectable()
export class SEOService {
  constructor(private title: Title, private meta: Meta) {
  }

  updateTitle(title: string) {
    this.title.setTitle(title);
    this.meta.updateTag({name: 'og:title', property: title});
  }

  updateOgUrl(url: string) {
    this.meta.updateTag({name: 'og:url', content: url});
  }

  updateDescription(desc: string) {
    this.meta.updateTag({name: 'description', property: desc});
    this.meta.updateTag({name: 'og:description', property: desc});
  }
}
