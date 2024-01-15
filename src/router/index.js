import Vue from 'vue'
import VueRouter from 'vue-router'

import Layout from '@/views/layout'
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

import store from '@/store'

const Login = () => import('@/views/login')
const MyOrder = () => import('@/views/myorder')
const Pay = () => import('@/views/pay')
const Search = () => import('@/views/search')
const SearchList = () => import('@/views/search/list.vue')
const ProDetail = () => import('@/views/prodetail')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '/home', component: Home },
      { path: '/category', component: Category },
      { path: '/cart', component: Cart },
      { path: '/user', component: User }
    ],
    redirect: '/home'
  },
  { path: '/login', component: Login },
  { path: '/search', component: Search },
  { path: '/myorder', component: MyOrder },
  { path: '/searchList', component: SearchList },
  { path: '/prodetail/:id', component: ProDetail },
  { path: '/pay', component: Pay }
]

const router = new VueRouter({
  routes
  // mode: 'history',
  // base: './'
})

const authPath = ['/pay', '/myorder', '/cart']
router.beforeEach((to, from, next) => {
  if (!authPath.includes(to.path)) {
    next()
    return
  }
  const token = store.getters.getToken
  if (token) {
    next()
  } else {
    next('/login')
  }
})

export default router
