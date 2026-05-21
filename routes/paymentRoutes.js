import express from 'express'

import {
  createPaymentOrder,
  verifyPayment,
} from '../controllers/paymentController.js'

const router = express.Router()

/* TEST ROUTE */

router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Payment route working',
  })
})

/* CREATE ORDER */

router.post(
  '/create-order',
  createPaymentOrder
)

/* VERIFY PAYMENT */

router.post(
  '/verify',
  verifyPayment
)

export default router