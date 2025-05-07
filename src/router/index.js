import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import ScannerView from '@/views/ScannerView.vue'
import LandingView from '@/views/LandingView.vue'
import CartView from '@/views/CartView.vue'
import ReceiptListView from '@/views/ReceiptListView.vue'
import ReceiptView from '@/views/ReceiptView.vue'
import ThankYouView from '@/views/ThankYouView.vue'

import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'LandingPage',
      component: LandingView,
      beforeEnter: (to, from, next) => {
        const isStandalone =
          window.matchMedia('(display-mode: standalone)').matches ||
          window.navigator.standalone === true
    
        if (isStandalone) {
          next('/dashboard')
        } else {
          next()
        }
      }
    },
    {
      path: '/dashboard',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'DashboardPage',
          component: DashboardView
        },
        {
          path: 'cart',
          name: 'CartPage',
          component: CartView,
          meta: {hideNavigation: true, showBackButton: true}
        },
        {
          path: 'all-receipts',
          name: 'AllReceiptsPage',
          component: ReceiptListView
        },
        {
          path: 'receipt/:orderId',
          name: 'ReceiptPage',
          component: ReceiptView
        },
        {
          path: 'scanner',
          name: 'ScannerPage',
          component: ScannerView
        },
        {
          path: 'thank-you',
          name: 'ThankYouPage',
          component: ThankYouView
        }
      ]
    },
  ],
});


export default router
