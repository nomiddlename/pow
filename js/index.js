(function($, navigator, Handlebars) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then(() => { console.log("Holy service worker registration, Batman."); });
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
  });

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
