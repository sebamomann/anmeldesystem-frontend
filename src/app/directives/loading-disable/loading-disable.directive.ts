import {ChangeDetectorRef, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Subscription} from 'rxjs';

@Directive({
  selector: '[appLoadingDisable]',
})
export class LoadingDisableDirective implements OnInit, OnDestroy {

  @Input() active: EventEmitter<boolean>;
  subscription: Subscription;

  @Input() innerHtml: string;

  private value: any;

  constructor(
    private ref: ChangeDetectorRef,
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
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.innerHtml);

    this.subscription = this.active.subscribe(value => {
      this.value = value;
      if (!value) {
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', this.innerHtml);
        this.renderer.removeAttribute(this.el.nativeElement, 'disabled');
      } else {
        this.setLoading();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setLoading() {
    this.renderer.setProperty(this.el.nativeElement, 'innerHTML', `<span class="loading-circle"></span>${this.innerHtml}`);
    this.renderer.setAttribute(this.el.nativeElement, 'disabled', 'true');
  }
}
