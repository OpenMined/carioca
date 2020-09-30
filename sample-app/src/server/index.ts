import createServer from './server';

const PORT = process.env.PORT;
const server = createServer();

server.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
