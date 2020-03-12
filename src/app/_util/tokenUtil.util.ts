export function TokenUtil() {
}

TokenUtil.getTokenForEnrollment = (id: string, link: string) => {
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  if (permissions != null) {
    const linkElem = permissions.find(fElement => fElement.link === link);
    if (linkElem !== undefined) {
      const elem = linkElem.enrollments.filter(sPermission => sPermission.id === id);
      if (elem[0] !== undefined) {
        return elem[0].token;
      }
    }
    return '';
  }
};
