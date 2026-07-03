let tokenData = {
  accessToken: '',
  apiBaseUrl: '',
  expiresAt: 0,
}

const isZohoEnabled = () => process.env.USE_ZOHO === 'true'

const getZohoConfig = () => {
  const config = {
    refreshToken: process.env.ZOHO_REFRESH_TOKEN,
    clientId: process.env.ZOHO_CLIENT_ID,
    clientSecret: process.env.ZOHO_CLIENT_SECRET,
    accountsUrl: process.env.ZOHO_ACCOUNTS_URL,
    apiBaseUrl: process.env.ZOHO_API_BASE_URL,
    dealerId: process.env.ZOHO_DEALER_ID,
  }

  const missing = Object.entries(config)
    .filter(([key, value]) => key !== 'dealerId' && !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing Zoho config: ${missing.join(', ')}`)
  }

  return config
}

const getZohoToken = async () => {
  if (!isZohoEnabled()) return ''

  if (tokenData.accessToken && Date.now() < tokenData.expiresAt) {
    return tokenData.accessToken
  }

  const config = getZohoConfig()
  const body = new URLSearchParams({
    refresh_token: config.refreshToken,
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: 'refresh_token',
  })

  const response = await fetch(`${config.accountsUrl}/oauth/v2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })
  const data = await response.json()

  if (!response.ok || data.error || !data.access_token) {
    throw new Error(
      data.error
        ? `Zoho token failed: ${data.error}. Check that the refresh token, client ID, client secret, and accounts URL are from the same Zoho client.`
        : 'Zoho token failed'
    )
  }

  tokenData.accessToken = data.access_token
  tokenData.apiBaseUrl = data.api_domain || config.apiBaseUrl
  tokenData.expiresAt = Date.now() + 50 * 60 * 1000

  return tokenData.accessToken
}

const mapZohoProduct = (product) => ({
  _id: product.id,
  zohoProductId: product.id,
  name: product.Product_Name || 'Product',
  description: product.Description || product.Product_Category || '',
  image: `/api/products/${product.id}/photo`,
  price: product.Unit_Price || 0,
  category: product.Product_Category || 'General',
  stock: product.Qty_in_Stock || 0,
  sku: product.Product_Code || '',
  modelName: product.Product_Name || '',
  type: product.Product_Category || 'General',
  unit: product.Usage_Unit || 'Pcs',
  status: product.Product_Active === false ? 'Inactive' : 'Active',
  createdAt: product.Created_Time,
})

const fetchZohoProducts = async (type) => {
  const accessToken = await getZohoToken()
  const config = getZohoConfig()
  const apiBaseUrl = tokenData.apiBaseUrl || config.apiBaseUrl

  const selectQuery = 'SELECT id,Product_Name,Product_Code,Product_Active,Product_Category,Created_Time,Unit_Price,Usage_Unit,Qty_in_Stock,Description FROM Products WHERE (Product_Active = true) ORDER BY Created_Time desc'

  const response = await fetch(`${apiBaseUrl}/crm/v7/coql`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ select_query: selectQuery }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Zoho product fetch failed')
  }

  const products = (data.data || []).map(mapZohoProduct)

  if (type && type !== 'All') {
    return products.filter((product) => product.type === type)
  }

  return products
}

const fetchZohoProductById = async (productId) => {
  const accessToken = await getZohoToken()
  const config = getZohoConfig()
  const apiBaseUrl = tokenData.apiBaseUrl || config.apiBaseUrl

  const response = await fetch(`${apiBaseUrl}/crm/v6/Products/${productId}`, {
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Zoho product fetch failed')
  }

  const product = data.data?.[0]
  if (!product) {
    throw new Error('Product not found')
  }

  return mapZohoProduct(product)
}

const fetchZohoProductPhoto = async (productId) => {
  const accessToken = await getZohoToken()
  const config = getZohoConfig()
  const apiBaseUrl = tokenData.apiBaseUrl || config.apiBaseUrl

  const response = await fetch(`${apiBaseUrl}/crm/v6/Products/${productId}/photo`, {
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Product image not found')
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const buffer = Buffer.from(await response.arrayBuffer())

  return { buffer, contentType }
}

const createZohoQuote = async (quote) => {
  const accessToken = await getZohoToken()
  const config = getZohoConfig()
  const apiBaseUrl = tokenData.apiBaseUrl || config.apiBaseUrl

  const quotedItems = quote.items.map((item) => ({
    Product_Name: {
      id: item.zohoProductId,
      name: item.name,
    },
    Quantity: item.quantity,
    List_Price: item.unitPrice,
  }))

  const quoteRecord = {
    Subject: quote.subject,
    Quoted_Items: quotedItems,
  }

  if (quote.validTill) {
    quoteRecord.Valid_Till = quote.validTill
  }

  if (config.dealerId) {
    quoteRecord.Dealer = config.dealerId
  }

  const payload = {
    data: [quoteRecord],
  }

  const response = await fetch(`${apiBaseUrl}/crm/v6/Quotes`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Zoho quote create failed')
  }

  return data
}

module.exports = {
  isZohoEnabled,
  fetchZohoProducts,
  fetchZohoProductById,
  fetchZohoProductPhoto,
  createZohoQuote,
}
