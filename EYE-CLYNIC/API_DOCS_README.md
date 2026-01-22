# EYE-CLYNIC API Documentation

Welcome! This folder contains complete API documentation for the EYE-CLYNIC frontend development.

## 📚 Documentation Files

### 1. **API_DOCUMENTATION.md** (Start Here!)
Complete API reference with:
- All endpoints with detailed request/response examples
- Data models and schemas
- Error handling guide
- Authentication flow
- Role-based access control
- Field options and validations

**👉 Read this first for complete API understanding**

### 2. **API_QUICK_REFERENCE.md**
Quick lookup guide with:
- Endpoint summary table
- Common request/response patterns
- Error codes
- Data type options
- Frontend checklist

**👉 Use this for quick lookups while coding**

### 3. **frontend/src/services/apiClient.js**
Ready-to-use API client with:
- Automatic token injection
- Error handling
- Token expiration handling
- All API methods pre-configured

**👉 Copy this file to your project and start using it**

### 4. **frontend/API_USAGE_EXAMPLES.md**
Practical React component examples:
- Login component
- Patient CRUD operations
- Visit creation
- Search functionality
- Error handling patterns
- React Query integration (optional)

**👉 Use these as templates for your components**

## 🚀 Quick Start

### Step 1: Copy the API Client
```bash
# The apiClient.js is already in frontend/src/services/
# Just import and use it!
```

### Step 2: Import in Your Components
```javascript
import {
  login,
  getAllPatients,
  createPatient,
  // ... other functions
} from './services/apiClient';
```

### Step 3: Start Building!
Check `API_USAGE_EXAMPLES.md` for component templates.

## 🔑 Key Information

### Base URL
```
http://localhost:5000/api
```

### Authentication
- JWT token-based
- Token expires in 15 minutes
- Include in header: `Authorization: Bearer <token>`
- Token automatically stored on login

### Roles
- **admin** - Full access
- **assistant** - Limited access (cannot delete, cannot register users)

## 📋 Common Tasks

### Login
```javascript
const { token, user } = await login(email, password);
// Token automatically stored in localStorage
```

### Get All Patients
```javascript
const patients = await getAllPatients();
```

### Create Patient
```javascript
const patient = await createPatient({
  name: 'John Doe',
  phone: '1234567890',
  age: 45,
  gender: 'male'
});
```

### Create Visit
```javascript
const visit = await createVisit({
  patientId: '507f1f77bcf86cd799439021',
  eyeExam: {
    visualAcuity: { OD: '0.1-1', OS: '0.1-1' },
    // ... other fields
  },
  recommendations: 'Follow up in 3 months'
});
```

## ⚠️ Important Notes

1. **Token Expiration**: Tokens expire in 15 minutes. Handle 401 errors by redirecting to login.

2. **Phone Uniqueness**: Patient phone numbers must be unique. Check for 409 conflict errors.

3. **Patient Code**: Auto-generated (P000001, P000002, etc.). Cannot be manually set.

4. **Doctor Assignment**: `doctorId` in visits is automatically set from the authenticated user.

5. **No Pagination**: All list endpoints return all records. Consider implementing pagination on frontend for large datasets.

6. **Hard Deletes**: Deletion is permanent. Consider confirmation dialogs.

## 🐛 Error Handling

All API functions throw errors with:
- `message` - User-friendly error message
- `status` - HTTP status code
- `data` - Full error response

Example:
```javascript
try {
  await createPatient(data);
} catch (error) {
  if (error.status === 409) {
    // Handle duplicate phone
  } else if (error.status === 401) {
    // Token expired - redirect to login
  } else {
    // Show error.message to user
  }
}
```

## 📞 Support

For questions or issues:
1. Check `API_DOCUMENTATION.md` for detailed endpoint info
2. Check `API_QUICK_REFERENCE.md` for quick answers
3. Review `API_USAGE_EXAMPLES.md` for code examples
4. Contact backend team for API issues

## 📝 Documentation Structure

```
.
├── API_DOCUMENTATION.md          # Complete API reference (READ FIRST)
├── API_QUICK_REFERENCE.md        # Quick lookup guide
├── API_DOCS_README.md            # This file
└── frontend/
    ├── src/
    │   └── services/
    │       └── apiClient.js      # Ready-to-use API client
    └── API_USAGE_EXAMPLES.md     # React component examples
```

## ✅ Frontend Development Checklist

- [ ] Read `API_DOCUMENTATION.md`
- [ ] Copy/use `apiClient.js` in your project
- [ ] Implement login flow
- [ ] Set up error handling (401, 403, etc.)
- [ ] Implement patient CRUD
- [ ] Implement visit CRUD
- [ ] Add search functionality
- [ ] Handle token expiration
- [ ] Add loading states
- [ ] Add error messages
- [ ] Test all endpoints

---

**Happy Coding! 🎉**

For detailed endpoint documentation, see `API_DOCUMENTATION.md`
