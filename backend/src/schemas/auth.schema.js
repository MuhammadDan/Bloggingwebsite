// src/schemas/auth.schema.js

const authSchemas = {
  register: {
    description: 'Register user (OTP will be sent to email)',
    tags: ['Auth'],
    body: {
      type: 'object',
      required: ['name', 'email', 'password'],
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 100 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        imageUrl: { type: 'string' }          // optional
      },
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          tempToken: { type: 'string' },
          email: { type: 'string' }
        },
        required: ['message', 'tempToken', 'email']
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },

  verifyOtp: {
    description: 'Verify OTP and activate account',
    tags: ['Auth'],
    body: {
      type: 'object',
      required: ['email', 'otp', 'tempToken'],
      properties: {
        email: { type: 'string', format: 'email' },
        otp: { type: 'string', minLength: 6, maxLength: 6 },
        tempToken: { type: 'string' }
      },
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              imageUrl: { type: ['string', 'null'] }
            }
          }
        }
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    },
  login: {
    description: 'User login with email and password',
    tags: ['Auth'],
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 }
      },
      additionalProperties: false
    },
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          token: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              imageUrl: { type: ['string', 'null'] }
            }
          }
        }
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    },
  }
  }
};

module.exports = authSchemas;