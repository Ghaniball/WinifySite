var revapi = jQuery('.tp-banner').revolution(
  {
    delay: 10000,
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
