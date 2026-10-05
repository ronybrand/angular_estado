// BACKEND_URL so existe pro docker-compose do ecossistema (ver estado/docker-compose.yml),
// onde o backend roda num hostname de rede Docker, nao localhost - default
// inalterado pro fluxo local de sempre (`npm start` sem Docker).
const proxy = [
    {
      context: ['/api'],
      target: process.env.BACKEND_URL || 'http://localhost:8090',
      pathRewrite: {'^/api' : ''}
    }
  ];module.exports = proxy;