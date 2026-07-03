const { Quote } = require('../models/quoteSchema')
const { createZohoQuote, isZohoEnabled } = require('./zohoService')

const createQuote = async (req, res) => {
  try {
    const { subject, dealer, validTill, items } = req.body

    if (!subject || !dealer) {
      throw new Error('Subject and dealer are required')
    }

    if (!items || items.length === 0) {
      throw new Error('Cart is empty')
    }

    const quoteItems = items.map((item) => {
      const quantity = Number(item.quantity) || 1
      const unitPrice = Number(item.price || item.unitPrice) || 0

      return {
        product: item._id && !String(item._id).startsWith('sample-') ? item._id : undefined,
        zohoProductId: item.zohoProductId || item._id || '',
        name: item.name,
        sku: item.sku || '',
        image: item.image || '',
        unitPrice,
        quantity,
        amount: quantity * unitPrice,
      }
    })

    const subtotal = quoteItems.reduce((sum, item) => sum + item.amount, 0)

    let zohoRecordId = ''

    if (isZohoEnabled()) {
      const zohoResponse = await createZohoQuote({
        subject,
        dealer,
        validTill,
        items: quoteItems,
      })

      zohoRecordId = zohoResponse?.data?.[0]?.details?.id || ''
    }

    const quoteData = {
      user: req.user._id,
      subject,
      dealer,
      validTill,
      items: quoteItems,
      subtotal,
      total: subtotal,
      zohoRecordId,
    }

    const quote = await Quote.create(quoteData)

    res.status(201).json({
      success: true,
      message: 'Quote created successfully',
      quote,
    })
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    })
  }
}

const getAllQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find({ user: req.user._id }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      quotes,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

const getSingleQuote = async (req, res) => {
  try {
    const { id } = req.params

    const quote = await Quote.findOne({ _id: id, user: req.user._id })

    if (!quote) {
      throw new Error('Quote not found')
    }

    res.status(200).json({
      success: true,
      quote,
    })
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message,
    })
  }
}

module.exports = {
  createQuote,
  getAllQuotes,
  getSingleQuote,
}
