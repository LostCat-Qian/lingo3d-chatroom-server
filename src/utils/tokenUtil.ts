import jwt from 'jsonwebtoken'
import jwtDecode from 'jwt-decode'
import secretKey from '../utils/secretKey'

// 生成token
// info也就是payload是需要存入token的信息
function createToken(info: any) {
  let token = jwt.sign(info, secretKey, {
    //Token有效时间 单位s
    expiresIn: 24 * 60 * 60
  })
  return token
}

// 验证 Token
function verifyToken(token: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error: any, result: any) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

// 解码 token
function decodeJWT(token: string) {
  return jwtDecode(token)
}

export { createToken, verifyToken, decodeJWT }
