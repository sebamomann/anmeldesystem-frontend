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
      files: [file],
      additions: [
        {
          id: 'id1',
          name: 'Megges'
        },
        {
          id: 'id2',
          name: 'BK'
        },
        {
          id: 'id3',
          name: 'Subway'
        },
        {
          id: 'id4',
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
      files: [file],
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
      files: [file],
      additions: [
        {
          id: 'id1',
          name: 'Megges'
        },
        {
          id: 'id2',
          name: 'BK'
        },
        {
          id: 'id3',
          name: 'Subway'
        },
        {
          id: 'id4',
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

// tslint:disable-next-line:max-line-length
const file = 'data:application/pdf;base64,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';
