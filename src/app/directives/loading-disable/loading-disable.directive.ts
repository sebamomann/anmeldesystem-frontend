import {Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[appLoadingDisable]',
})
export class LoadingDisableDirective implements OnInit, OnDestroy {

  @Input() active: EventEmitter<boolean>;
  subscription: Subscription;

  @Input() innerValue: string;
  @Input() hideValue: boolean;

  private value: any;

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    this.el = el;
  }

  @HostListener('click')
  onClick() {
    setTimeout(() => {
      if (this.value) {
        this.setLoading();
      }
    });
  }

  ngOnInit() {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.innerValue);

    this.subscription = this.active.subscribe(value => {
      this.value = value;
      if (!value) {
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.innerValue);
        this.renderer.setProperty(this.el.nativeElement, 'disabled', false);
      } else {
        this.setLoading();
      }
    });

    // this.active.emit(true);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setLoading() {
    if (!this.hideValue) {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML',
        `<div class="loading-circle-wrapper"><span class="loading-circle"></span></div>${this.innerValue}`);
    } else {
      this.renderer.setProperty(this.el.nativeElement, 'innerHTML',
        `<div class="loading-circle-wrapper"><span class="loading-circle"></span></div>`);
    }
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
  }
}
