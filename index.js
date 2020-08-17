const { IgApiClient } = require("instagram-private-api");
const client = new IgApiClient();

const { auth, target, message, count } = require("./settings.json");

(async () => {
  client.state.generateDevice(auth.username);
  await client.account.login(auth.username, auth.password);

  const user = (await client.direct.rankedRecipients()).ranked_recipients.find(
    (v) => v.thread.thread_title === target
  );

  if (!user) throw new Error(`Invalid user.`);

  const id = user.thread.users[0].pk;

  for (let i = 0; i < count; i++) {
    const data = await client.directThread.broadcast({
      item: "text",
      userIds: [id],
      form: {
        text: message,
      },
      signed: true,
    });

    console.log(
      `[LOGS] | Sending payload #${i + 1}/${count} (${data.status_code} - ${
        data.status
      })`
    );
  }
})();
