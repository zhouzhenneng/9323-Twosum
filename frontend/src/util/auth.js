import Cookies from 'js-cookie'

const configData = require('../config.json');

const port=configData.BACKEND_PORT;

const TokenKey = 'Admin-Token'
const isStudentKey = "isStudent"
export const baseURL=configData.backend_url+port+"/";

const expiretime= 1


export function getToken() {
  if (Cookies.get(TokenKey) === undefined){
    return false
  }
  return Cookies.get(TokenKey)
}

export function getisStudent() {
  if (Cookies.get(isStudentKey) === undefined){
    return false
  }
  return Cookies.get(isStudentKey) === "true"
}

export function getTokenUrl(url) {
  return baseURL + url + "?Authorization=Bearer " + getToken()
}

export function setToken(token) {
  // eslint-disable-next-line no-console
  console.log('settingToken!',token)
  return Cookies.set(TokenKey, token,{expires:expiretime})
}

export function setisStudent(isStudent) {
  return Cookies.set(isStudentKey, isStudent,{expires:expiretime})
}

export function removeToken() {
  Cookies.remove(isStudentKey)
  return Cookies.remove(TokenKey)
}
