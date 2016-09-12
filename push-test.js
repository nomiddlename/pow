const push = require('web-push');

// the values below are no longer a valid subscription, so you can't spam me - ha!

push.sendNotification(
  "https://updates.push.services.mozilla.com/wpush/v1/gAAAAABX1zCg8B-HGYKbZ489iuPqBrDibTjXHFbqecSjT5dQo0p-slRLQBhUmpnBerHmJOvJaKtCHJ_RcD_LNqerUVbkfCgnc1eRwUd6F12cMjVyptSPFm_4_DgUuaFGVlZ0-842mFmo",
  {
    userPublicKey: "BI2R//hSROTPLZOwoC1nYWQh+kp9Z/AC+oh2AXfuLeHeBn9tw9YR8SE9CbMKTbSIpTRQ9XybwrgvjTEwy59CAEI=",
    userAuth: "H23DCqj4aRXEs12PfXIN8w==",
    payload: JSON.stringify({
      message: "Batman talk rescheduled."
    })
  }
).then((resp) => {
  console.log("Push notification sent, response was ", resp);
}).catch((e) => {
  console.error("problem with push ", e);
});
