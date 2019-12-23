import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TerminService {

  constructor() {
  }

  getTermin(link: string) {

    return {
      title: 'Test Termin',
      description: 'This is a very very cool date because I created it lol',
      location: 'Hier lol',
      creator: 'TestCreator',
      date: '01-01-2020 00:00:00',
      deadline: '01-01-2019 00:00:00',
      link: 'ABCDE',
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
            'id1',
            'id2',
            'id4'
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
            'id1',
            'id2',
            'id4'
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
            'id1',
            'id2',
            'id4'
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver 2',
          comment: 'This is my cool comment',
          comments: [],
          driver: {
            requirement: 1,
          },
          passenger: null,
          additions: [
            'id1',
            'id2',
          ],
          iat: '01-01-2019 00:00:00',
        },
        {
          name: 'Driver 3',
          comment: 'This is my cool comment',
          comments: [],
          driver: {
            requirement: 1,
          },
          passenger: null,
          additions: [
            'id1',
            'id2',
            'id3',
            'id4',
          ],
          iat: '01-01-2019 00:00:00',
        }
      ]
    };
  }
}
