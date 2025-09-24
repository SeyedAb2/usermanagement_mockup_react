// // server.js
// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const router = jsonServer.router('db.json');
// const middlewares = jsonServer.defaults();

// server.use(middlewares);
// server.use(jsonServer.bodyParser);

// server.post('/login', (req, res) => {
//   const { phone, password } = req.body;
//   const db = router.db; // lowdb
//   const user = db.get('users').find({ phone, password }).value();
//   if (!user) return res.status(401).json({ message: 'نام کاربری یا رمز عبور اشتباه است' });
//   const { password: _omit, ...safeUser } = user;
//   return res.json(safeUser);
// });

// server.use(router);
// server.listen(9000, () => console.log('JSON Server running on 3000'));
