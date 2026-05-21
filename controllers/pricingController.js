import Pricing from '../models/Pricing.js'

/* =========================================
   ➤ CREATE PRICING PLAN (ADMIN ONLY)
========================================= */

export const createPricing = async (req, res) => {
  try {
    const {
      title,
      price,
      duration,
      features,
      isActive,
    } = req.body

    const pricing = await Pricing.create({
      title,
      price,
      duration,
      features,
      isActive: isActive ?? true,
    })

    res.status(201).json(pricing)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ GET ALL PRICING PLANS (PUBLIC)
========================================= */

export const getAllPricing = async (req, res) => {
  try {
    const pricing = await Pricing.find()

    res.json(pricing)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ GET SINGLE PRICING PLAN
========================================= */

export const getPricingById = async (req, res) => {
  try {
    const pricing = await Pricing.findById(
      req.params.id
    )

    if (!pricing) {
      return res.status(404).json({
        message: 'Pricing plan not found',
      })
    }

    res.json(pricing)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ UPDATE PRICING PLAN (ADMIN ONLY)
========================================= */

export const updatePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findById(
      req.params.id
    )

    if (!pricing) {
      return res.status(404).json({
        message: 'Pricing plan not found',
      })
    }

    pricing.title =
      req.body.title || pricing.title
    pricing.price =
      req.body.price || pricing.price
    pricing.duration =
      req.body.duration ||
      pricing.duration
    pricing.features =
      req.body.features ||
      pricing.features
    pricing.isActive =
      req.body.isActive !== undefined
        ? req.body.isActive
        : pricing.isActive

    const updatedPricing =
      await pricing.save()

    res.json(updatedPricing)

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

/* =========================================
   ➤ DELETE PRICING PLAN (ADMIN ONLY)
========================================= */

export const deletePricing = async (req, res) => {
  try {
    const pricing = await Pricing.findById(
      req.params.id
    )

    if (!pricing) {
      return res.status(404).json({
        message: 'Pricing plan not found',
      })
    }

    await pricing.deleteOne()

    res.json({
      message:
        'Pricing plan deleted successfully',
    })

  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}