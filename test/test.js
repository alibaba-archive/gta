(function() {
  console.log('test start!');

  window.Gta.debug = true;

  window.Gta.test = function () {
    window.Gta.pageview({
      'page': '/my-overridden-page?id=1',
      'title': 'my overridden page'
    });
    window.Gta.setCurrentPage('Tasks List Page');
    window.Gta.event({action: 'drag post card', type: 'post', control: 'Post Menu', method: 'drag'});
  }
  window.Gta.setUser('Zuckerberg', {name: 'User', email:'zuckerberg@teambition.com'})
}())
