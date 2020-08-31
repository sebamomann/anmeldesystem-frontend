import {IAppointmentModel} from '../models/IAppointment.model';

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

AppointmentUtil.isPinned = (link: string) => {
  const pins: string[] = JSON.parse(localStorage.getItem('appointment-pins'));

  if (!pins) {
    return false;
  }

  return pins.includes(link);
};

AppointmentUtil.getYear = (appointment: IAppointmentModel) => {
  return (new Date(appointment.date)).getFullYear();
};

AppointmentUtil.getMonth = (appointment: IAppointmentModel) => {
  return (new Date(appointment.date)).getMonth();
};

interface IEnrollmentPermission {
  id: string;
  token: string;
}

AppointmentUtil.storeEnrollmentPermissions = (link: string, body: IEnrollmentPermission) => {
  let permissions = JSON.parse(localStorage.getItem('permissions'));

  if (permissions === null ||
    permissions === undefined) {
    permissions = [];
  }

  let linkElem = permissions.find(fElement => fElement.link === link);
  let push = false;
  if (linkElem === undefined) {
    linkElem = {link, enrollments: []};
    push = true;
  }

  if (!linkElem.enrollments.some(sPermission => sPermission.id === body.id)) {
    linkElem.enrollments.push({id: body.id, token: body.token});
  } else {
    linkElem.enrollments.map(sPermission => {
      if (sPermission.id === body.id) {
        sPermission.token = body.token;
        return;
      }
    });
  }

  if (push) {
    permissions.push(linkElem);
  }

  localStorage.setItem('permissions', JSON.stringify(permissions));
};





