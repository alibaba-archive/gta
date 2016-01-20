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
  window.Gta.setUser('ziqiang250', {
    name: 'ziqiang',
    email: 'ziqiang@tb.com',
    created_at: '20150805',
    language: 'en',
    env: 'web',
    version: '2.5.0',
    city: 'Xi\'an',
    country: 'China',
    region: 'Shanxi',
  })
}())
