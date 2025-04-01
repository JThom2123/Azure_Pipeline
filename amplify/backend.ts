
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { funct } from './functions/resource';
import { CustomNotifications } from './custom/CustomNotifications/resource';


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  funct,
});

const customNotifications = new CustomNotifications(
  backend.createStack('CustomNotifications'),
  'CustomNotifications',
  { sourceAddress: 'sender@example.com' }
);

backend.addOutput({
  custom: {
    topicArn: customNotifications.topic.topicArn,
    topicName: customNotifications.topic.topicName,
  },
});