exports.handler = async function (event) {
  console.log("request:", JSON.stringify(event, undefined, 2));
  const allowOrigin = process.env.ALLOW_ORIGIN;
  const origin = event.headers.origin;

  if (origin === allowOrigin) {
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": allowOrigin,
        Vary: "Origin",
      },
      body: `Hola, Monty! You've hit ${event.path}\n`,
    };
  }

  return {
    statusCode: 401,
  };
};
