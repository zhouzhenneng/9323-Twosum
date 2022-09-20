import axios from 'axios'
import {getToken, baseURL} from './auth'

const configData = require('../config.json');
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const request = axios.create({
    baseURL: baseURL,
    timeout: 30000

})
//添加请求拦截器
request.interceptors.request.use(config => { //发送请求的时候做些什么
  let token = getToken()
  if (token) {
    //Authorization请求头含有服务器用于验证用户代理身份的凭证token
    config.headers['Authorization'] = 'Bearer ' + token 
    config.headers['token'] =token 
  }
  //封装get方法，第一个参数 config.url 表示我们要请求的url地址，第二个参数是个{}, 是我们要携带的请求参数，用&拼接
  if (config.method === 'get' && config.params) {
    let url = config.url + '?'
    for (const propName of Object.keys(config.params)) {
      const value = config.params[propName]
      var part = encodeURIComponent(propName) + '='
      if (value !== null && typeof (value) !== 'undefined') {
        if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            let params = propName + '[' + key + ']'
            var subPart = encodeURIComponent(params) + '='
            url += subPart + encodeURIComponent(value[key]) + '&'
          }
        } else {
          url += part + encodeURIComponent(value) + '&'
        }
      }
    }
    url = url.slice(0, -1)
    config.params = {}
    config.url = url
  }
  return config
}, error => { //对请求的错误做些什么
  return Promise.reject(error)
})


export function login(username, password) {
  const data = {
      'email':username,
      'password':password,
  }
  return request({
      url: '/login',
      method: 'post',
      data: data
  })
}
export function patchName(firstName, lastName) {
  const data = {
    'first_name':firstName,
    'last_name':lastName,
  }
  return request({
    url: '/profile/self',
    method: 'post',
    data: data
  })
}

export function uploadPhoto(base64) {
  const data = {
    'avatar': base64,
  }
  return request({
    url: '/profile/self',
    method: 'post',
    data: data
  })
}

export function patchGender(gender, domain, bio) {
  const data = {
    'gender':gender,
    'domain':domain,
    'bio': bio,
  }
  return request({
    url: '/profile/self',
    method: 'post',
    data: data
  })
}

export function patchBackground(education, company) {
  const data = {
    'education':education,
    'company':company,
  }
  return request({
    url: '/profile/self',
    method: 'post',
    data: data
  })
}
export function patchPassword(password) {
  const data = {
    'password':password,
  }
  return request({
    url: '/profile/self',
    method: 'post',
    data: data
  })
}


export function selfprofile() {
  return request({
      url: '/profile/self',
      method: 'get',
  })
}

export function applyProject(intro, project_id) {
  const data = {
    'self_intro':intro,
  }
  return request({
    url: `/myapplication/new/${project_id}`,
    method: 'post',
    data: data
  })
}

export function projectDetails(projectID) {
  return request({
      url: `/myproject/${projectID}`,
      method: 'get',
  })
}

export function myApplication() {
  return request({
      url: '/myapplication',
      method: 'get',
  })
}
export function myProject() {
  return request({
      url: '/myproject',
      method: 'get',
  })
}

export function ratingProject(rating=5, comments, enrollment_id) {
  const data = {
    'rating': rating,
    'comments': comments,
  }
  return request({
    url: `/myapplication/feedback/${enrollment_id}`,
    method: 'put',
    data: data
  })
}


export function startProject(project_id) {
  return request({
    url: `/myproject/start/${project_id}`,
    method: 'put'
  })
}

export function completeProject(project_id) {
  return request({
    url: `/myproject/finish/${project_id}`,
    method: 'put'
  })
}


export function acceptApplicaton(applicationId) {
  return request({
      url: `/myproject/accept/${applicationId}`,
      method: 'put',
  })
}

export function rejectApplicaton(applicationId) {
  return request({
      url: `/myproject/reject/${applicationId}`,
      method: 'put',
  })
}

export function getAllProject() {
  return request({
      url: "/myproject",
      method: 'get',
  })
}

export function checkApplication(projectId) {
  return request({
      url: `/myproject/${projectId}/applications_received`,
      method: 'get',
  })
}
export function getFeedback(userId) {
  return request({
      url: `/profile/${userId}/reviews`,
      method: 'get',
  })
}

export function checkApplicant(userId) {
  return request({
      url: `/profile/${userId}`,
      method: 'get',
  })
}
