export function AppointmentUtil() {
}

AppointmentUtil.pin = (link: string) => {
  const pins = AppointmentUtil.getPinned();

  if (!pins.includes(link)) {
    pins.push(link);
  }

  localStorage.setItem('appointment-pins', JSON.stringify(pins));
};

AppointmentUtil.unpin = (link: string) => {
  const pins = AppointmentUtil.getPinned();
  const index = pins.indexOf(link);

  pins.splice(index, 1);
  localStorage.setItem('appointment-pins', JSON.stringify(pins));
};

AppointmentUtil.getPinned = () => {
  let pins: string[] = JSON.parse(localStorage.getItem('appointment-pins'));
  if (pins === null) {
    pins = [];
  }

  return pins;
};

