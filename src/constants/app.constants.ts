/**
 * Application-wide constants
 */

export const APP = {
  DEFAULTS: {
    CURRENCY: 'US$',
    PRODUCT_TYPE: 'Unknown',
    BREADCRUMB: {
      HOME_LABEL: 'Inicio',
      HOME_URL: '/',
      PRODUCT_DETAILS_LABEL: 'Product Details'
    },
    PAYMENT_METHODS: {
      INSTALLMENTS: {
        STANDARD: 12,
        LIMITED: 6,
        SINGLE: 1
      },
      ICONS: {
        CARD: '💳',
        CASH: '💵'
      }
    },
    MOCK_PRODUCT: {
      TITLE: 'Product Not Available',
      DESCRIPTION: 'This product is currently not available.',
      SELLER_ID: '0',
      SELLER_NAME: 'Unknown Seller',
      PRODUCT_TYPE: 'Unknown',
      PAYMENT_METHOD_ID: 'default',
      PAYMENT_METHOD_NAME: 'Default Payment Method'
    }
  },
  ROUTES: {
    PRODUCT: '/product'
  },
  TEXT_PROCESSING: {
    PARAGRAPH_SEPARATOR: '\n\n'
  }
};