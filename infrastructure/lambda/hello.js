exports.handler = async function (event) {
  console.log("request:", JSON.stringify(event, undefined, 2));
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin":
        // TODO: Change this to return only the domain of the corresponding environment.
        "https://codeconveyor-dev.nielmclaren.com,https://codeconveyor-staging.nielmclaren.com,https://codeconveyor.nielmclaren.com",
      Vary: "Origin",
    },
    body: `Hola, Monty! You've hit ${event.path}\n`,
  };
};
