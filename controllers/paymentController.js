import Razorpay from 'razorpay'
import crypto from 'crypto'

const createRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

export const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay keys are missing in .env file',
      })
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required',
      })
    }

    const razorpay = createRazorpayInstance()

    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    })

    res.status(200).json({
      success: true,
      message: 'Order created successfully',
      key: process.env.RAZORPAY_KEY_ID,
      order,
    })
  } catch (error) {
    console.log('Create Payment Order Error:', error)

    res.status(500).json({
      success: false,
      message:
        error?.error?.description ||
        error?.message ||
        'Payment order creation failed',
    })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay secret key is missing in .env file',
      })
    }

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification details are missing',
      })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    })
  } catch (error) {
    console.log('Verify Payment Error:', error)

    res.status(500).json({
      success: false,
      message:
        error?.message ||
        'Payment verification error',
    })
  }
}