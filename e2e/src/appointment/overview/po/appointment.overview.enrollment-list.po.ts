import { BasePage } from './../../../base.po';
import { browser, by, element, protractor } from 'protractor';

export class AppointmentOverviewEnrollmentListPage extends BasePage {
  constructor() {
    super();
  }

  public static getElementLoginHint() {
    return element(by.css('#login_hint'));
  }

  public getEnrollmentBlocks() {
    return element.all(by.css('.enrollment'));
  }

  public getEnrollmentBlocksCreatedByUser() {
    return element.all(by.css('.enrollment.creator'));
  }

  public getEnrollmentBlocksCreatedByUnknown() {
    return element.all(by.css('.enrollment.unknown'));
  }

  public getEnrollmentUsernameById(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .user-information .username'));
    return elem.getText();
  }

  public getEnrollmentNameById(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .user-information .name'));
    return elem.getText();
  }

  public getEnrollmentComment(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .comment'));
    return elem.getText();
  }

  public isEnrollmentPresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment'));
    return elem.isPresent();
  }

  public isEnrollmentUsernamePresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .user-information .username'));
    return elem.isPresent();
  }

  public isEnrollmentCommentPresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .comment'));
    return elem.isPresent();
  }

  public isEnrollmentCommentSeparatorPresent(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment .comment-separator'));
    return elem.isPresent();
  }

  public toggleEnrollmentPanel(id: string) {
    const elem = element(by.css('[enrollment-id=\"' + id + '\"].enrollment'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.elementToBeClickable(elem), 2000, 'Enrollment panel for enrollment ' + id + ' taking too long to be present');

    return elem.click();
  }

  public clickEnrollmentEditButton(id) {
    const elem = element(by.css('[enrollment-id=\"' + id + '\"].enrollment-additions .edit'));
    return elem.click();
  }

  public clickEnrollmentDeleteButton(id) {
    const elem = element(by.css('[enrollment-id=\"' + id + '\"].enrollment-additions .delete'));
    return elem.click();
  }

  public cancelEnrollmentDeletion() {
    const elem = element(by.css('#cancel'));

    const EC = protractor.ExpectedConditions; // because its a dialog
    browser.wait(EC.presenceOf(elem), 2000, 'Element taking too long to be present');

    return elem.click();
  }

  public isEmptyEnrollmentListHintPresent() {
    const elem = element(by.css('#empty-enrollment-list-hint'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 2000, 'Element taking too long to be present');

    return elem.isPresent();
  }

  public isHiddenEnrollmentHintPresent() {
    const elem = element(by.css('#hidden-enrollment-hint'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 2000, 'Element taking too long to be present');

    return elem.isPresent();
  }

  public isEnrollmentDeletionConfirmationDialogPresent() {
    const elem = element(by.css('#enrollment-deletion-confirmation-dialog'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 2000, 'Element taking too long to be present');

    return elem.isPresent();
  }

  public isEnrollmentDeletionConfirmationDialogGone() {
    const elem = element(by.css('#enrollment-deletion-confirmation-dialog'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.invisibilityOf(elem), 2000, 'Element taking too long to disappear');

    return elem.isPresent();
  }

  public isMissingPermissionDialogPresent() {
    const elem = element(by.css('#missing-permission-dialog'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.presenceOf(elem), 2000, 'Element taking too long to be present');

    return elem.isPresent();
  }

  public isEnrollmentPanelExpanded(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment-additions'));
    return elem.isPresent();
  }

  public isEnrollmentPanelCollapsed(id: string) {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment-additions'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.invisibilityOf(elem), 2000, 'Element taking too long to disappear');

    return elem.isPresent();
  }

  public async waitForEnrollmentPanelToBeExpanded(id: string): Promise<void> {
    const elem = element(by.css('[enrollment-id="' + id + '"].enrollment-additions'));

    const EC = protractor.ExpectedConditions;
    browser.wait(EC.visibilityOf(elem), 2000, 'Element taking too long to be present');

    return;
  }

  public isAdditionOfEnrollmentSelected(enrollmentId: string, additionIndex: number) {
    const elm = element(by.css('[enrollment-id="' + enrollmentId + '"] .addition-list .addition-index-' + additionIndex + ' .checkbox_selected'));
    return elm.isPresent();
  }
}

