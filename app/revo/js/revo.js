var revapi = jQuery('.tp-banner').revolution(
  {
    delay: 5000,
    startwidth: 1170,
    startheight: 500,
    hideThumbs: 10,
    onHoverStop: 'off',
    fullWidth: 'off',
    fullScreen: 'on',
    fullScreenOffsetContainer: ''
  });

//window.console.log(revapi);

revapi
  .on('mouseenter', function() {
    //window.console.log('enter');
    revapi.revresume();
  })
  .on('mouseleave', function() {
    //window.console.log('leave');
    revapi.revpause();
  });

revapi.bind("revolution.slide.onchange", function(e, data) {
  //window.console.log('change');
  //window.console.log(revapi.find('.tp-bannertimer').data('opt').act);
  //window.alert('endchange');
});

revapi.bind("revolution.slide.onbeforeswap", function(e,data) {
  window.console.log('2');
  window.console.log('nr ' + data.lastslide);
  window.console.log('"ls ' + revapi.find('.tp-bannertimer').data('opt').lastslide);
  window.console.log('"act ' + revapi.find('.tp-bannertimer').data('opt').act);
  //window.console.log(revapi.find('.tp-bannertimer').data('opt').act);
  //window.alert('endbeforeswap');
});

/*
revapi.bind("revolution.slide.onpause", function(e, data) {
  window.console.log('pause');
  window.console.log(data);
});

revapi.bind("revolution.slide.onresume", function(e, data) {
  window.console.log('resume');
  window.console.log(data);
});

revapi.bind("revolution.slide.onstop", function(e, data) {
  window.console.log('stop');
  window.console.log(data);
});
*/
revapi.bind("revolution.slide.onloaded", function(e,data) {
  window.console.log('loaded');
});
