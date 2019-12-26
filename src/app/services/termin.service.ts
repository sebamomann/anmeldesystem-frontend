import {Injectable} from '@angular/core';
import {IAppointmentModel} from '../models/IAppointment.model';

@Injectable({
  providedIn: 'root'
})
export class TerminService {

  constructor() {
  }

  getTermin(link: string): IAppointmentModel {
    return {
      title: 'Test Termin',
      description: 'This is a very very cool date because I created it lol',
      location: 'Hier lol',
      creator: 'TestCreator',
      date: '01-01-2020 00:00:00',
      deadline: '01-01-2019 00:00:00',
      link: 'ABCDE',
      maxEnrollments: 10,
      additions: [
        {
          id: 'id1',
          name: 'Megges'
        },
        {
          id: 'id1',
          name: 'BK'
        },
        {
          id: 'id1',
          name: 'Subway'
        },
        {
          id: 'id1',
          name: 'Diner'
        }
      ],
      driverAddition: true,
      enrollments: [
        {
          name: 'Test Enrollment',
          comment: 'This is my cool comment but it is acutally waaay to long to be put in just one line',
          comments: [{
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter2',
            comment: 'This is my comment response to your comment too lol',
            iat: '01-01-2019 00:00:00'
          }],
          driver: null,
          passenger: {
            requirement: 1,
          },
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver',
          comment: 'This is my cool comment but it is acutally waaay to long to be put in just one line',
          comments: [],
          driver: {
            service: 1,
            seats: 3,
          },
          passenger: null,
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Test Enrollment2',
          comment: 'This is my cool comment',
          comments: [{
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter2',
            comment: 'This is my comment response to your comment too lol',
            iat: '01-01-2019 00:00:00'
          }],
          driver: null,
          passenger: {
            requirement: 1,
          },
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver 2',
          comment: 'This is my cool comment',
          comments: [],
          driver: {
            service: 1,
            seats: 3,
          },
          passenger: null,
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver 3',
          comment: 'This is my cool comment',
          comments: [],
          driver: {
            service: 1,
            seats: 3,
          },
          passenger: null,
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id3', name: 'Subway'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        }
      ]
    };
  }

  getTermine(): IAppointmentModel[] {
    return [{
      title: 'Test Termin',
      description: 'This is a very very cool date because I created it lol',
      location: 'Hier lol',
      creator: 'TestCreator',
      date: '01-01-2020 00:00:00',
      deadline: '01-01-2019 00:00:00',
      link: 'ABCDE',
      maxEnrollments: 10,
      additions: [
        {
          id: 'id1',
          name: 'Megges'
        },
        {
          id: 'id1',
          name: 'BK'
        },
        {
          id: 'id1',
          name: 'Subway'
        },
        {
          id: 'id1',
          name: 'Diner'
        }
      ],
      driverAddition: true,
      enrollments: [
        {
          name: 'Test Enrollment',
          comment: 'This is my cool comment but it is acutally waaay to long to be put in just one line',
          comments: [{
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter2',
            comment: 'This is my comment response to your comment too lol',
            iat: '01-01-2019 00:00:00'
          }],
          driver: null,
          passenger: {
            requirement: 1,
          },
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver',
          comment: 'This is my cool comment but it is acutally waaay to long to be put in just one line',
          comments: [],
          driver: {
            service: 1,
            seats: 3,
          },
          passenger: null,
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Test Enrollment2',
          comment: 'This is my cool comment',
          comments: [{
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter2',
            comment: 'This is my comment response to your comment too lol',
            iat: '01-01-2019 00:00:00'
          }],
          driver: null,
          passenger: {
            requirement: 1,
          },
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver 2',
          comment: 'This is my cool comment',
          comments: [],
          driver: {
            service: 1,
            seats: 3,
          },
          passenger: null,
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver 3',
          comment: 'This is my cool comment',
          comments: [],
          driver: {
            service: 1,
            seats: 3,
          },
          passenger: null,
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id3', name: 'Subway'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        }
      ]
    }, {
      title: 'Test Termin 2',
      description: 'This is a very very cool date because I created it lol',
      location: 'Hier lol',
      creator: 'TestCreator',
      date: '01-01-2020 00:00:00',
      deadline: '01-01-2019 00:00:00',
      link: 'ABCDE',
      maxEnrollments: 10,
      additions: [
        {
          id: 'id1',
          name: 'Megges'
        },
        {
          id: 'id1',
          name: 'BK'
        },
        {
          id: 'id1',
          name: 'Subway'
        },
        {
          id: 'id1',
          name: 'Diner'
        }
      ],
      driverAddition: true,
      enrollments: [
        {
          name: 'Test Enrollment',
          comment: 'This is my cool comment but it is acutally waaay to long to be put in just one line',
          comments: [{
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter2',
            comment: 'This is my comment response to your comment too lol',
            iat: '01-01-2019 00:00:00'
          }],
          driver: null,
          passenger: {
            requirement: 1,
          },
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver',
          comment: 'This is my cool comment but it is acutally waaay to long to be put in just one line',
          comments: [],
          driver: {
            service: 1,
            seats: 3,
          },
          passenger: null,
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Test Enrollment2',
          comment: 'This is my cool comment',
          comments: [{
            name: 'CommentWriter1',
            comment: 'This is my comment response to your comment',
            iat: '01-01-2019 00:00:00'
          }, {
            name: 'CommentWriter2',
            comment: 'This is my comment response to your comment too lol',
            iat: '01-01-2019 00:00:00'
          }],
          driver: null,
          passenger: {
            requirement: 1,
          },
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver 2',
          comment: 'This is my cool comment',
          comments: [],
          driver: {
            service: 1,
            seats: 3,
          },
          passenger: null,
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver 3',
          comment: 'This is my cool comment',
          comments: [],
          driver: {
            service: 1,
            seats: 3,
          },
          passenger: null,
          additions: [
            {id: 'id1', name: 'Megges'},
            {id: 'id2', name: 'Bk'},
            {id: 'id3', name: 'Subway'},
            {id: 'id4', name: 'Diner'},
          ],
          iat: '01-01-2019 00:00:00',
        }
      ]
    }];
  }
}
