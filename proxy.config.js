const proxy = [
    {
      context: '/api',
      target: 'http://localhost:8090',
      pathRewrite: {'^/api' : ''}
    }
  ];module.exports = proxy;