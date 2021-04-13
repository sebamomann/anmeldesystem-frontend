export class LinkUtil {
  /**
   * Take passed link an open it in a new browser tab
   *
   * @param link String   Link to open
   */
  public static openLinkInNewTab(link: string): void {
    window.open(link, '_blank');
  }
}
