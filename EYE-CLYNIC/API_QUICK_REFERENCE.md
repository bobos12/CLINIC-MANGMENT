# API Quick Reference Guide

## Base URL
```
http://localhost:5000/api
```

## Authentication Header
```
Authorization: Bearer <your-token>
```

---

## Endpoints Summary

### 🔐 Authentication
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/login` | ❌ | - | Login user |
| GET | `/auth/me` | ✅ | - | Get current user |
| POST | `/auth/register` | ✅ | admin | Register new user |

### 👥 Users
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/users` | ✅ | admin | Get all users |
| GET | `/users/:id` | ✅ | - | Get user by ID |
| PUT | `/users/:id` | ✅ | admin/own | Update user |
| DELETE | `/users/:id` | ✅ | admin | Delete user |

### 🏥 Patients
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/patients` | ✅ | - | Get all patients |
| GET | `/patients/:id` | ✅ | - | Get patient by ID |
| GET | `/patients/search/:name` | ✅ | - | Search by name |
| GET | `/patients/:id/visits` | ✅ | - | Get patient with visits |
| POST | `/patients` | ✅ | admin/assistant | Create patient |
| PUT | `/patients/:id` | ✅ | admin/assistant | Update patient |
| DELETE | `/patients/:id` | ✅ | admin | Delete patient |

### 📋 Visits
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/visits` | ✅ | - | Get all visits |
| GET | `/visits/:id` | ✅ | - | Get visit by ID |
| POST | `/visits` | ✅ | admin/assistant | Create visit |
| PUT | `/visits/:id` | ✅ | admin/assistant | Update visit |
| DELETE | `/visits/:id` | ✅ | admin | Delete visit |

### ❤️ Health
| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/health` | ❌ | - | Health check |

---

## Common Request/Response Patterns

### Login Request
```json
POST /api/auth/login
{
  "email": "doctor@clinic.com",
  "password": "password123"
}
```

### Login Response
```json
{
  "_id": "...",
  "name": "Dr. John",
  "email": "doctor@clinic.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Patient Request
```json
POST /api/patients
{
  "name": "John Doe",
  "phone": "1234567890",
  "age": 45,
  "gender": "male"
}
```

### Create Visit Request
```json
POST /api/visits
{
  "patientId": "507f1f77bcf86cd799439021",
  "eyeExam": {
    "visualAcuity": { "OD": "0.1-1", "OS": "0.1-1" },
    "oldGlasses": {
      "OD": { "sphere": "-2.00", "cylinder": "-0.50", "axis": "180" },
      "OS": { "sphere": "-2.00", "cylinder": "-0.50", "axis": "180" }
    }
  },
  "recommendations": "Follow up in 3 months"
}
```

---

## Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Continue |
| 201 | Created | Resource created |
| 400 | Bad Request | Check request body |
| 401 | Unauthorized | Re-login required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 500 | Server Error | Contact backend team |

---

## Data Types

### Gender
- `"male"`
- `"female"`
- `"other"` (default)

### Role
- `"admin"`
- `"assistant"`

### Visual Acuity Options
- `"0.1 to 1"`, `"2"`, `"3"`, `"4"`, `"5m"`, `"CF"`, `"HM"`, `"PL"`, `"NPL"`

### Ocular Motility
- `"Normal"`, `"Limited up"`, `"Limited down"`, `"Limited lateral"`, `"Limited temporal"`

### Eyelid
- `"Normal"`, `"Ptosis"`, `"Retraction"`, `"Mass"`

### Conjunctiva
- `"Red"`, `"Pterygium"`, `"Others"`

### Cornea
- `"Clear"`, `"Opacified"`, `"Sensitive"`, `"Abnormal sensation"`, `"Others"`

### Pupil
- `"RRR"`, `"RAPD"`, `"Others"`

### Lens
- `"Clear"`, `"Cataract"`

---

## Important Notes

⚠️ **Token expires in 15 minutes** - Implement refresh or re-login

⚠️ **Patient code is auto-generated** - Format: P000001, P000002, etc.

⚠️ **Phone numbers must be unique** - Check for 409 conflict on create

⚠️ **Doctor ID is auto-set** - From authenticated user token

⚠️ **No pagination** - All endpoints return all records

⚠️ **Hard deletes** - Deletion is permanent

---

## Frontend Checklist

- [ ] Store JWT token securely
- [ ] Handle 401 errors (token expired)
- [ ] Handle 403 errors (insufficient permissions)
- [ ] Validate phone uniqueness before submit
- [ ] Format dates as ISO 8601
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Implement search functionality
- [ ] Show patient code in UI
- [ ] Display doctor name from populated data

---

For detailed documentation, see `API_DOCUMENTATION.md`
