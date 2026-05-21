import express from 'express'
import {
  createPricing,
  getAllPricing,
  getPricingById,
  updatePricing,
  deletePricing,
} from '../controllers/pricingController.js'

const router = express.Router()

router.post('/', createPricing)
router.get('/', getAllPricing)
router.get('/:id', getPricingById)
router.put('/:id', updatePricing)
router.delete('/:id', deletePricing)

export default router