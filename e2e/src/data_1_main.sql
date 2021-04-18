-- #############
-- # DASHBOARD #
-- #############

-- ---------
-- DEFAULT -
-- ---------
-- JWT_User with ID f67e953d-cb85-4f41-b077-4a0bf8485bc5 // APPOINTMENT CREATOR
-- JWT_User with ID bcf27563-e7b0-4334-ab91-d35bbb5e63f2 // GENERAL ENROLLMENTCREATOR 1
-- JWT_User with ID 295f2461-5964-4981-bbcd-5e8f667a3b9a // GENERAL ENROLLMENTCREATOR 2
-- JWT_User with ID 0ab80f61-b3c3-49d6-b18f-efdb2723f217 // GENERAL ENROLLMENTCREATOR 3

INSERT INTO `appointment` (`id`, `title`, `description`, `link`, `location`, `date`, `deadline`, `maxEnrollments`,
                           `hidden`, `driverAddition`, `creatorId`, `iat`, `lud`)
VALUES ('167c7f28-8028-4c48-bc1e-8b1f2c885d7d', 'test-protractor-appointment-title',
        'test-protractor-appointment-description', 'test-protractor-appointment-link',
        'test-protractor-appointment-location', '2021-03-01 10:05:29', '2021-01-01 20:05:23', NULL, '0', '0',
        'f67e953d-cb85-4f41-b077-4a0bf8485bc5', '2021-03-14 20:05:28.000000', '2021-03-14 20:05:23.000000'),
       ('3b47df3e-9e2d-4516-a895-5c6aa6811fb7', 'test-protractor-appointment-driver-title',
        'test-protractor-appointment-driver-description', 'test-protractor-appointment-driver-link',
        'test-protractor-appointment-driver-location', '2021-03-01 10:05:29', '2021-01-01 20:05:23', NULL, '0', '1',
        'f67e953d-cb85-4f41-b077-4a0bf8485bc5', '2021-03-14 20:05:28.000000', '2021-03-14 20:05:23.000000');
COMMIT;

-- 3 by user, 5 by any
INSERT INTO `enrollment` (`id`, `name`, `comment`, `creatorId`, `iat`, `lud`, `appointmentId`)
VALUES ('0614b2e5-d283-41fe-bc54-ce2527bfd308', NULL, 'test-protractor-appointment-comment-creator-1',
        'bcf27563-e7b0-4334-ab91-d35bbb5e63f2', '2021-01-01 05:01:23', '2021-03-01 05:05:23',
        '167c7f28-8028-4c48-bc1e-8b1f2c885d7d'),
       ('916cd0ed-b915-412a-8eca-8b82bb9769a2', NULL, 'test-protractor-appointment-comment-creator-2',
        '295f2461-5964-4981-bbcd-5e8f667a3b9a', '2021-01-01 05:02:23', '2021-03-01 05:05:23',
        '167c7f28-8028-4c48-bc1e-8b1f2c885d7d'),
       ('6a0eb41d-2e0d-4919-a07e-ba0ce4030015', NULL, 'test-protractor-appointment-comment-creator-3',
        '0ab80f61-b3c3-49d6-b18f-efdb2723f217', '2021-01-01 05:03:23', '2021-03-01 05:05:23',
        '167c7f28-8028-4c48-bc1e-8b1f2c885d7d'),
       ('c36b8c96-db97-4869-8bd6-35f0acbd96f1', 'test-protractor-appointment-name-1',
        'test-protractor-appointment-comment-1', NULL, '2021-01-01 05:04:23', '2021-03-01 05:05:23',
        '167c7f28-8028-4c48-bc1e-8b1f2c885d7d'),
       ('2afe1fb2-1e0e-445c-a9ab-2e6b83a6d434', 'test-protractor-appointment-name-2',
        'test-protractor-appointment-comment-2', NULL, '2021-01-01 05:05:23', '2021-03-01 05:05:23',
        '167c7f28-8028-4c48-bc1e-8b1f2c885d7d'),
       ('485f3142-d880-4431-b284-d38267b41674', 'test-protractor-appointment-name-3',
        'test-protractor-appointment-comment-3', NULL, '2021-01-01 05:05:23', '2021-03-01 05:05:23',
        '167c7f28-8028-4c48-bc1e-8b1f2c885d7d'),
       ('57327dea-d3cb-4955-9d15-f62964f0b616', 'test-protractor-appointment-name-4',
        'test-protractor-appointment-comment-4', NULL, '2021-01-01 05:06:23', '2021-03-01 05:05:23',
        '167c7f28-8028-4c48-bc1e-8b1f2c885d7d'),
       ('ead32e43-f6f2-4a23-b6c1-f73b49ccf348', 'test-protractor-appointment-name-5', NULL, NULL, '2021-01-01 05:07:23',
        '2021-03-01 05:05:23', '167c7f28-8028-4c48-bc1e-8b1f2c885d7d');
COMMIT;
