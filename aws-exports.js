const awsconfig = {
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_SBC9pg6ag",
    userPoolWebClientId: "107720oslv197r2qvlb4h1ptcs",
    oauth: {}, // This prevents the loginWith error
  },
};

export default awsconfig;
