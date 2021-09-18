import jwt from 'jsonwebtoken';

function login(req, res, next) {
  const token = req.cookies.jwt;

  if(token) {
    const auth = jwt.verify(token, process.env.SECRET_KEY, async function (err, decodedPayload) {
      if(err) {    
        res.redirect('/login')
      } else {
        res.locals.user = decodedPayload.user
        next()
      }
    })

  } else {
    res.redirect('/login')
  }
}

export default login;