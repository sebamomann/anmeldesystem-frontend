function EnrollmentUtil() {
}

EnrollmentUtil.getKey = () => localStorage.getItem('enrollmentKey');
EnrollmentUtil.setKey = (key: string) => localStorage.setItem('enrollmentKey', key);
