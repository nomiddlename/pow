(function($, navigator, Handlebars) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then((reg) => {
        console.log("Holy service worker registration, Batman.");
        registration = reg;

        return registration.pushManager.getSubscription();
      }).then((sub) => {
        if (sub) {
          console.log("Already subscribed to notifications, Batman: ", sub);
          console.log("bat-client-key is ",
            btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh'))))
          );
          console.log("bat-client-auth-secret is ",
            btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth'))))
          );
          enableSubscriptionButton();
        }
      });
  }

  $(() => {
    console.log("Checking for bat-templates");
    $('div[data-template]').each((i, item) => {
      item = $(item);
      let url = item.attr('data-url');
      let fn = renderers[item.attr('data-renderer')];
      let template = Handlebars.compile($(item.attr('data-template')).html());
      console.log("Found a bat-template, ", template, ", with ", url, " and ", fn );
      $.get(url).done(data => {
        console.log("get request returned ", data);
        item.append(fn(template, data));
      });
    });


    $('#subscribe').click(function() {
      if ($(this).hasClass('active')) {
        //unsubscribe from notifications
        console.log("I should unsubscribe now.");
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.getSubscription().then((sub) => {
            if (sub) {
              console.log("In a real app, we'd remove the subscription from the server");
              sub.unsubscribe().then(() => {
                $(this).button("sub");
              });
            }
          });
        });
      } else {
        //subscribe to notifications
        console.log("I should subscribe now.");
        navigator.serviceWorker.ready.then((reg) => {
          reg.pushManager.subscribe( { userVisibleOnly: true }).then((sub) => {
            console.log("Holy subscription, Batman: ", sub);
            console.log("bat-client-key is ",
              btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('p256dh'))))
            );
            console.log("bat-client-auth-secret is ",
              btoa(String.fromCharCode.apply(null, new Uint8Array(sub.getKey('auth'))))
            );
            console.log("In a real app, we'd record the subscription in our server");
            $(this).button("unsub");
          });
        });
      }
    });
  });

  function enableSubscriptionButton() {
    $('#subscribe').addClass('active').button('unsub');
  }

  let renderers = {
    speakers: function(template, data) {
      console.log("Speakers render called, caped crusader.");
      return template({ speakers: data });
    },
    programme: function(template, data) {
      return template(
        {
          tracks: data.map(speaker => {
            return speaker.talks.map(talk => {
              return {
                track: talk.track,
                time: talk.time,
                title: talk.title,
                speaker: speaker.name,
                description: talk.description
              };
            });
          }).reduce((prev, current) => {
            return prev.concat(current);
          }, [])
          .reduce((prev, current) => {
            prev[current.track - 1].talks.push(current);
            return prev;
          }, [ { number: 1, talks: []}, { number: 2, talks: [] } ])
          .map(track => {
            track.talks.sort((a, b) => a.time.localeCompare(b.time));
            return track;
          })
        }
      );
    }
  };

})(window.jQuery, window.navigator, window.Handlebars);
