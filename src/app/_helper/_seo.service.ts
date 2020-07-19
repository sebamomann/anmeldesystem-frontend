import {Injectable} from '@angular/core';
import {Meta, Title} from '@angular/platform-browser';

@Injectable()
export class SEOService {
  constructor(private title: Title, private meta: Meta) {
  }

  updateTitle(title: string) {
    this.title.setTitle(title);
    this.meta.updateTag({property: 'og:title', content: title});
  }

  updateOgUrl(url: string) {
    this.meta.updateTag({name: 'og:url', content: url});
  }

  updateDescription(desc: string) {
    this.meta.updateTag({name: 'description', content: desc});
    this.meta.updateTag({property: 'og:description', content: desc});
  }
}
