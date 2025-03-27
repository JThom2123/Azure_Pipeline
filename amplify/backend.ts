import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { funct } from './functions/resource';
import {
  CfnApp,
  CfnCampaign,
  CfnSegment,
} from "aws-cdk-lib/aws-pinpoint";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stack } from "aws-cdk-lib/core";


/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  funct,
});

const inAppMessagingStack = backend.createStack("inAppMessaging-stack");

// create a Pinpoint app
const pinpoint = new CfnApp(inAppMessagingStack, "Pinpoint", {
  name: "team22-PinpointApp",
});

// create a segment 
const mySegment = new CfnSegment(inAppMessagingStack, "Segment", {
  applicationId: pinpoint.ref,
  name: "mySegment",
});

// create a campaign with event and in-app message template
new CfnCampaign(inAppMessagingStack, "Campaign", {
  applicationId: pinpoint.ref,
  name: "team22-Campaign",
  segmentId: mySegment.attrSegmentId,
  schedule: {
    // ensure the start and end time are in the future
    startTime: "2026-02-23T14:39:34Z", 
    endTime: "2026-02-29T14:32:40Z",
    frequency: "IN_APP_EVENT",
    eventFilter: {
      dimensions: {
        eventType: {
          dimensionType: "INCLUSIVE",
          values: ["my_first_event"],
        },
      },
      filterType: "ENDPOINT",
    },
  },

  messageConfiguration: {
    inAppMessage: {
      layout: "TOP_BANNER",
      content: [
        {
          // define the content of the in-app message
          bodyConfig: {
            alignment: "CENTER",
            body: "This is an example in-app message.",
            textColor: "#FFFFFF",
          },
          backgroundColor: "#000000",
          headerConfig: {
            alignment: "CENTER",
            header: "Welcome!",
            textColor: "#FFFFFF",
          },
          // optionally, define buttons, images, etc.
        },
      ],
    },
  },
});

//create an IAM policy to allow interacting with Pinpoint in-app messaging
const pinpointPolicy = new Policy(inAppMessagingStack, "PinpointPolicy", {
  policyName: "team22-PinpointPolicy",
  statements: [
    new PolicyStatement({
      actions: [
        "mobiletargeting:GetInAppMessages",
        "mobiletargeting:UpdateEndpoint",
        "mobiletargeting:PutEvents",
      ],
      resources: [pinpoint.attrArn + "/*", pinpoint.attrArn],
    }),
  ],
});

// apply the policy to the authenticated and unauthenticated roles
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(pinpointPolicy);
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(pinpointPolicy);

// patch the custom Pinpoint resource to the expected output configuration
backend.addOutput({
  notifications: {
    amazon_pinpoint_app_id: pinpoint.ref,
    aws_region: Stack.of(pinpoint).region,
    channels: ["IN_APP_MESSAGING"],
  },
});