# EYE-CLYNIC API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:5000/api`  
**Content-Type:** `application/json`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Error Handling](#error-handling)
3. [Data Models](#data-models)
4. [Endpoints](#endpoints)
   - [Authentication](#authentication-endpoints)
   - [Users](#user-endpoints)
   - [Patients](#patient-endpoints)
   - [Visits](#visit-endpoints)
5. [Role-Based Access Control](#role-based-access-control)

---

## Authentication

All protected endpoints require JWT authentication via Bearer token in the Authorization header.

### Header Format
```
Authorization: Bearer <token>
```

### Token Expiration
- Default: 15 minutes
- Token is returned on successful login
- Store token in localStorage or secure storage
- Include token in all authenticated requests

### Getting a Token
See [Login Endpoint](#login) below.

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message description"
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource (e.g., email/phone already exists) |
| 500 | Internal Server Error |

### Common Error Scenarios

**401 Unauthorized:**
```json
{
  "message": "No token provided"
}
```
or
```json
{
  "message": "Invalid token"
}
```

**403 Forbidden:**
```json
{
  "message": "Role 'assistant' is not authorized for this operation",
  "requiredRoles": ["admin"],
  "userRole": "assistant"
}
```

**400 Bad Request:**
```json
{
  "message": "Missing required fields: name, phone, age",
  "received": {
    "name": "John",
    "phone": null,
    "age": null
  }
}
```

**409 Conflict:**
```json
{
  "message": "A patient with this phone number already exists",
  "existingPatient": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "phone": "1234567890",
    "code": "P000001"
  }
}
```

---

## Data Models

### User Model
```typescript
{
  _id: string;              // MongoDB ObjectId
  name: string;             // Required, trimmed
  email: string;           // Required, unique, lowercase, validated
  password: string;        // Required, min 6 chars, hashed (never returned)
  role: "admin" | "assistant";  // Default: "assistant"
  isActive: boolean;       // Default: true
  createdAt: Date;         // Auto-generated
  updatedAt: Date;         // Auto-generated
}
```

### Patient Model
```typescript
{
  _id: string;              // MongoDB ObjectId
  code: string;            // Auto-generated (P000001, P000002, etc.), unique
  name: string;            // Required, trimmed
  phone: string;           // Required, unique, trimmed
  age: number;             // Required
  gender: "male" | "female" | "other";  // Default: "other"
  createdAt: Date;         // Auto-generated
  updatedAt: Date;         // Auto-generated
}
```

### Visit Model
```typescript
{
  _id: string;              // MongoDB ObjectId
  patientId: ObjectId;      // Reference to Patient, required
  doctorId: ObjectId;      // Reference to User, auto-set from auth token
  visitDate: Date;         // Default: current date/time
  complaint: Map<string, number>;  // Optional, e.g., {"Decreased vision": 0}
  medicalHistory: Map<string, number>;  // Optional, e.g., {"DM": 5} (years)
  surgicalHistory: Map<string, number>;  // Optional, e.g., {"Cataract": 2} (years)
  eyeExam: {
    visualAcuity: { OD: string, OS: string };
    oldGlasses: {
      OD: { sphere: string, cylinder: string, axis: string };
      OS: { sphere: string, cylinder: string, axis: string };
    };
    refraction: {
      OD: { sphere: string, cylinder: string, axis: string };
      OS: { sphere: string, cylinder: string, axis: string };
    };
    externalAppearance: { OD: string, OS: string };
    ocularMotility: { OD: string, OS: string };
    eyelid: { OD: string, OS: string };
    conjunctiva: { OD: string, OS: string };
    cornea: { OD: string, OS: string };
    sclera: { OD: string, OS: string };
    anteriorChamber: { OD: string, OS: string };
    iris: { OD: string, OS: string };
    pupil: { OD: string, OS: string };
    lens: { OD: string, OS: string };
    posteriorSegment: { OD: string, OS: string };
  };
  recommendations: string;  // Optional
  followUpDate: Date;      // Optional
  createdAt: Date;         // Auto-generated
  updatedAt: Date;         // Auto-generated
}
```

### Eye Exam Field Options

**visualAcuity:** `"0.1-1"`, `"2"`, `"3"`, `"4"`, `"5m"`, `"CF"`, `"HM"`, `"PL"`, `"NPL"`

**ocularMotility:** `"Normal"`, `"Limited up"`, `"Limited down"`, `"Limited lateral"`, `"Limited temporal"`

**eyelid:** `"Normal"`, `"Ptosis"`, `"Retraction"`, `"Mass"`

**conjunctiva:** `"Red"`, `"Pterygium"`, `"Others"`

**cornea:** `"Clear"`, `"Opacified"`, `"Sensitive"`, `"Abnormal sensation"`, `"Others"`

**anteriorChamber:** `"Depth"`, `"Content"`

**pupil:** `"RRR"`, `"RAPD"`, `"Others"`

**lens:** `"Clear"`, `"Cataract"`

**OD = Right Eye, OS = Left Eye**

---

## Endpoints

### Authentication Endpoints

#### Login
**POST** `/api/auth/login`

**Public Endpoint** - No authentication required

**Request Body:**
```json
{
  "email": "doctor@clinic.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Dr. John Smith",
  "email": "doctor@clinic.com",
  "role": "admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401` - Invalid credentials or inactive user
```json
{
  "message": "Invalid credentials"
}
```

**Example:**
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'doctor@clinic.com',
    password: 'password123'
  })
});

const data = await response.json();
// Store data.token and data in localStorage
```

---

#### Get Current User
**GET** `/api/auth/me`

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Dr. John Smith",
  "email": "doctor@clinic.com",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### Register User
**POST** `/api/auth/register`

**Protected** - Requires authentication + Admin role

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Assistant Name",
  "email": "assistant@clinic.com",
  "password": "password123",
  "role": "assistant"
}
```

**Success Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "name": "Assistant Name",
  "email": "assistant@clinic.com",
  "role": "assistant",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - User already exists
- `403` - Not admin

---

### User Endpoints

#### Get All Users
**GET** `/api/users`

**Protected** - Requires authentication + Admin role

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dr. John Smith",
    "email": "doctor@clinic.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Assistant Name",
    "email": "assistant@clinic.com",
    "role": "assistant",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### Get User by ID
**GET** `/api/users/:id`

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - User MongoDB ObjectId

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Dr. John Smith",
  "email": "doctor@clinic.com",
  "role": "admin",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404` - User not found

---

#### Update User
**PUT** `/api/users/:id`

**Protected** - Requires authentication (Admin or own user)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - User MongoDB ObjectId

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "1234567890",
  "role": "assistant"
}
```

**Note:** All fields are optional. Only include fields you want to update.

**Success Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Updated Name",
    "email": "doctor@clinic.com",
    "role": "assistant",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

---

#### Delete User
**DELETE** `/api/users/:id`

**Protected** - Requires authentication + Admin role

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - User MongoDB ObjectId

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `404` - User not found
- `403` - Not admin

---

### Patient Endpoints

#### Get All Patients
**GET** `/api/patients`

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439021",
    "code": "P000001",
    "name": "John Doe",
    "phone": "1234567890",
    "age": 45,
    "gender": "male",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "_id": "507f1f77bcf86cd799439022",
    "code": "P000002",
    "name": "Jane Smith",
    "phone": "0987654321",
    "age": 32,
    "gender": "female",
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

---

#### Get Patient by ID
**GET** `/api/patients/:id`

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Patient MongoDB ObjectId

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439021",
  "code": "P000001",
  "name": "John Doe",
  "phone": "1234567890",
  "age": 45,
  "gender": "male",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Responses:**
- `404` - Patient not found

---

#### Search Patient by Name
**GET** `/api/patients/search/:name`

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `name` - Patient name (partial match, case-insensitive)

**Example:** `/api/patients/search/john`

**Success Response (200):**
```json
{
  "count": 2,
  "patients": [
    {
      "_id": "507f1f77bcf86cd799439021",
      "code": "P000001",
      "name": "John Doe",
      "phone": "1234567890",
      "age": 45,
      "gender": "male"
    },
    {
      "_id": "507f1f77bcf86cd799439023",
      "code": "P000003",
      "name": "Johnny Smith",
      "phone": "1112223333",
      "age": 28,
      "gender": "male"
    }
  ]
}
```

**Error Responses:**
- `400` - Empty search query
- `404` - No patients found

---

#### Get Patient with Visits
**GET** `/api/patients/:id/visits`

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Patient MongoDB ObjectId

**Success Response (200):**
```json
{
  "patient": {
    "_id": "507f1f77bcf86cd799439021",
    "code": "P000001",
    "name": "John Doe",
    "phone": "1234567890",
    "age": 45,
    "gender": "male",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "visits": [
    {
      "_id": "507f1f77bcf86cd799439031",
      "patientId": {
        "_id": "507f1f77bcf86cd799439021",
        "name": "John Doe",
        "phone": "1234567890",
        "code": "P000001"
      },
      "doctorId": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Dr. John Smith",
        "email": "doctor@clinic.com",
        "role": "admin"
      },
      "visitDate": "2024-01-20T10:00:00.000Z",
      "eyeExam": { ... },
      "createdAt": "2024-01-20T10:00:00.000Z",
      "updatedAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "visitCount": 1
}
```

**Note:** Visits are sorted by `visitDate` descending (newest first).

---

#### Create Patient
**POST** `/api/patients`

**Protected** - Requires authentication + Admin or Assistant role

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "1234567890",
  "age": 45,
  "gender": "male"
}
```

**Required Fields:**
- `name` (string) - Patient name
- `phone` (string) - Phone number (must be unique)
- `age` (number) - Patient age

**Optional Fields:**
- `gender` (string) - "male", "female", or "other" (default: "other")

**Note:** `code` is auto-generated (P000001, P000002, etc.)

**Success Response (201):**
```json
{
  "message": "Patient created successfully",
  "patient": {
    "_id": "507f1f77bcf86cd799439021",
    "code": "P000001",
    "name": "John Doe",
    "phone": "1234567890",
    "age": 45,
    "gender": "male",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Patient with phone number already exists
- `403` - Insufficient permissions

**Example:**
```javascript
const response = await fetch('http://localhost:5000/api/patients', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'John Doe',
    phone: '1234567890',
    age: 45,
    gender: 'male'
  })
});
```

---

#### Update Patient
**PUT** `/api/patients/:id`

**Protected** - Requires authentication + Admin or Assistant role

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Patient MongoDB ObjectId

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "1234567890",
  "age": 46,
  "gender": "male"
}
```

**Note:** All fields are optional. Only include fields you want to update. `code` cannot be updated (it's auto-generated).

**Success Response (200):**
```json
{
  "message": "Patient updated successfully",
  "patient": {
    "_id": "507f1f77bcf86cd799439021",
    "code": "P000001",
    "name": "John Updated",
    "phone": "1234567890",
    "age": 46,
    "gender": "male",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400` - No fields to update or validation error
- `404` - Patient not found
- `403` - Insufficient permissions

---

#### Delete Patient
**DELETE** `/api/patients/:id`

**Protected** - Requires authentication + Admin role

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Patient MongoDB ObjectId

**Success Response (200):**
```json
{
  "message": "Patient deleted successfully"
}
```

**Error Responses:**
- `404` - Patient not found
- `403` - Not admin

**Warning:** This is a hard delete. All associated visits will have orphaned references.

---

### Visit Endpoints

#### Get All Visits
**GET** `/api/visits`

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439031",
    "patientId": {
      "_id": "507f1f77bcf86cd799439021",
      "name": "John Doe",
      "phone": "1234567890",
      "code": "P000001"
    },
    "doctorId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dr. John Smith",
      "email": "doctor@clinic.com",
      "role": "admin"
    },
    "visitDate": "2024-01-20T10:00:00.000Z",
    "complaint": {},
    "medicalHistory": {},
    "surgicalHistory": {},
    "eyeExam": {
      "visualAcuity": { "OD": "", "OS": "" },
      "oldGlasses": {
        "OD": { "sphere": "", "cylinder": "", "axis": "" },
        "OS": { "sphere": "", "cylinder": "", "axis": "" }
      },
      "refraction": {
        "OD": { "sphere": "", "cylinder": "", "axis": "" },
        "OS": { "sphere": "", "cylinder": "", "axis": "" }
      },
      "externalAppearance": { "OD": "", "OS": "" },
      "ocularMotility": { "OD": "", "OS": "" },
      "eyelid": { "OD": "", "OS": "" },
      "conjunctiva": { "OD": "", "OS": "" },
      "cornea": { "OD": "", "OS": "" },
      "sclera": { "OD": "", "OS": "" },
      "anteriorChamber": { "OD": "", "OS": "" },
      "iris": { "OD": "", "OS": "" },
      "pupil": { "OD": "", "OS": "" },
      "lens": { "OD": "", "OS": "" },
      "posteriorSegment": { "OD": "", "OS": "" }
    },
    "recommendations": "",
    "followUpDate": null,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
]
```

---

#### Get Visit by ID
**GET** `/api/visits/:id`

**Protected** - Requires authentication

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Visit MongoDB ObjectId

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439031",
  "patientId": {
    "_id": "507f1f77bcf86cd799439021",
    "name": "John Doe",
    "phone": "1234567890",
    "code": "P000001"
  },
  "doctorId": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Dr. John Smith",
    "email": "doctor@clinic.com",
    "role": "admin"
  },
  "visitDate": "2024-01-20T10:00:00.000Z",
  "complaint": {
    "Decreased vision far or near": 0,
    "Seeking glasses": 0
  },
  "medicalHistory": {
    "DM": 5,
    "HTN": 3
  },
  "surgicalHistory": {
    "Cataract": 2
  },
  "eyeExam": {
    "visualAcuity": { "OD": "0.1-1", "OS": "0.1-1" },
    "oldGlasses": {
      "OD": { "sphere": "-2.00", "cylinder": "-0.50", "axis": "180" },
      "OS": { "sphere": "-2.00", "cylinder": "-0.50", "axis": "180" }
    },
    "refraction": {
      "OD": { "sphere": "-2.25", "cylinder": "-0.75", "axis": "180" },
      "OS": { "sphere": "-2.25", "cylinder": "-0.75", "axis": "180" }
    },
    "externalAppearance": { "OD": "Normal", "OS": "Normal" },
    "ocularMotility": { "OD": "Normal", "OS": "Normal" },
    "eyelid": { "OD": "Normal", "OS": "Normal" },
    "conjunctiva": { "OD": "Red", "OS": "Red" },
    "cornea": { "OD": "Clear", "OS": "Clear" },
    "sclera": { "OD": "", "OS": "" },
    "anteriorChamber": { "OD": "Depth", "OS": "Depth" },
    "iris": { "OD": "", "OS": "" },
    "pupil": { "OD": "RRR", "OS": "RRR" },
    "lens": { "OD": "Clear", "OS": "Clear" },
    "posteriorSegment": { "OD": "", "OS": "" }
  },
  "recommendations": "Follow up in 3 months",
  "followUpDate": "2024-04-20T10:00:00.000Z",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

**Error Responses:**
- `404` - Visit not found

---

#### Create Visit
**POST** `/api/visits`

**Protected** - Requires authentication + Admin or Assistant role

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "patientId": "507f1f77bcf86cd799439021",
  "visitDate": "2024-01-20T10:00:00.000Z",
  "complaint": {
    "Decreased vision far or near": 0,
    "Seeking glasses": 0
  },
  "medicalHistory": {
    "DM": 5,
    "HTN": 3
  },
  "surgicalHistory": {
    "Cataract": 2
  },
  "eyeExam": {
    "visualAcuity": { "OD": "0.1-1", "OS": "0.1-1" },
    "oldGlasses": {
      "OD": { "sphere": "-2.00", "cylinder": "-0.50", "axis": "180" },
      "OS": { "sphere": "-2.00", "cylinder": "-0.50", "axis": "180" }
    },
    "refraction": {
      "OD": { "sphere": "-2.25", "cylinder": "-0.75", "axis": "180" },
      "OS": { "sphere": "-2.25", "cylinder": "-0.75", "axis": "180" }
    },
    "externalAppearance": { "OD": "Normal", "OS": "Normal" },
    "ocularMotility": { "OD": "Normal", "OS": "Normal" },
    "eyelid": { "OD": "Normal", "OS": "Normal" },
    "conjunctiva": { "OD": "Red", "OS": "Red" },
    "cornea": { "OD": "Clear", "OS": "Clear" },
    "sclera": { "OD": "", "OS": "" },
    "anteriorChamber": { "OD": "Depth", "OS": "Depth" },
    "iris": { "OD": "", "OS": "" },
    "pupil": { "OD": "RRR", "OS": "RRR" },
    "lens": { "OD": "Clear", "OS": "Clear" },
    "posteriorSegment": { "OD": "", "OS": "" }
  },
  "recommendations": "Follow up in 3 months",
  "followUpDate": "2024-04-20T10:00:00.000Z"
}
```

**Required Fields:**
- `patientId` (string) - Patient MongoDB ObjectId

**Optional Fields:**
- `visitDate` (Date/ISO string) - Defaults to current date/time
- `complaint` (Map/Object) - Key-value pairs where value is number
- `medicalHistory` (Map/Object) - Key-value pairs where value is years (number)
- `surgicalHistory` (Map/Object) - Key-value pairs where value is years (number)
- `eyeExam` (Object) - Complete eye examination data (see Eye Exam structure above)
- `recommendations` (string) - Doctor recommendations
- `followUpDate` (Date/ISO string) - Next follow-up appointment date

**Note:** `doctorId` is automatically set from the authenticated user's token. You cannot set it manually.

**Success Response (201):**
```json
{
  "message": "Visit created successfully",
  "visit": {
    "_id": "507f1f77bcf86cd799439031",
    "patientId": {
      "_id": "507f1f77bcf86cd799439021",
      "name": "John Doe",
      "phone": "1234567890",
      "code": "P000001"
    },
    "doctorId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Dr. John Smith",
      "email": "doctor@clinic.com",
      "role": "admin"
    },
    "visitDate": "2024-01-20T10:00:00.000Z",
    "complaint": { ... },
    "medicalHistory": { ... },
    "surgicalHistory": { ... },
    "eyeExam": { ... },
    "recommendations": "Follow up in 3 months",
    "followUpDate": "2024-04-20T10:00:00.000Z",
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing patientId or validation error
- `403` - Insufficient permissions

**Example:**
```javascript
const response = await fetch('http://localhost:5000/api/visits', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    patientId: '507f1f77bcf86cd799439021',
    eyeExam: {
      visualAcuity: { OD: '0.1-1', OS: '0.1-1' },
      // ... other eye exam fields
    },
    recommendations: 'Follow up in 3 months'
  })
});
```

---

#### Update Visit
**PUT** `/api/visits/:id`

**Protected** - Requires authentication + Admin or Assistant role

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Visit MongoDB ObjectId

**Request Body:**
```json
{
  "eyeExam": {
    "visualAcuity": { "OD": "0.2-1", "OS": "0.2-1" }
  },
  "recommendations": "Updated recommendations"
}
```

**Note:** All fields are optional. Only include fields you want to update. You can update any field except `doctorId` (it's set from auth token on creation).

**Success Response (200):**
```json
{
  "message": "Visit updated successfully",
  "visit": {
    "_id": "507f1f77bcf86cd799439031",
    "patientId": { ... },
    "doctorId": { ... },
    "visitDate": "2024-01-20T10:00:00.000Z",
    "eyeExam": {
      "visualAcuity": { "OD": "0.2-1", "OS": "0.2-1" },
      // ... other fields
    },
    "recommendations": "Updated recommendations",
    "updatedAt": "2024-01-21T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `404` - Visit not found
- `403` - Insufficient permissions

---

#### Delete Visit
**DELETE** `/api/visits/:id`

**Protected** - Requires authentication + Admin role

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Visit MongoDB ObjectId

**Success Response (200):**
```json
{
  "message": "Visit deleted successfully"
}
```

**Error Responses:**
- `400` - Missing visit ID
- `404` - Visit not found
- `403` - Not admin

---

## Role-Based Access Control

### Roles

1. **admin** - Full access to all endpoints
2. **assistant** - Limited access (cannot delete patients/users, cannot register users)

### Permission Matrix

| Endpoint | Method | Admin | Assistant |
|----------|--------|-------|-----------|
| `/api/auth/login` | POST | ✅ | ✅ |
| `/api/auth/me` | GET | ✅ | ✅ |
| `/api/auth/register` | POST | ✅ | ❌ |
| `/api/users` | GET | ✅ | ❌ |
| `/api/users/:id` | GET | ✅ | ✅ |
| `/api/users/:id` | PUT | ✅ | ✅ (own profile) |
| `/api/users/:id` | DELETE | ✅ | ❌ |
| `/api/patients` | GET | ✅ | ✅ |
| `/api/patients/:id` | GET | ✅ | ✅ |
| `/api/patients/search/:name` | GET | ✅ | ✅ |
| `/api/patients/:id/visits` | GET | ✅ | ✅ |
| `/api/patients` | POST | ✅ | ✅ |
| `/api/patients/:id` | PUT | ✅ | ✅ |
| `/api/patients/:id` | DELETE | ✅ | ❌ |
| `/api/visits` | GET | ✅ | ✅ |
| `/api/visits/:id` | GET | ✅ | ✅ |
| `/api/visits` | POST | ✅ | ✅ |
| `/api/visits/:id` | PUT | ✅ | ✅ |
| `/api/visits/:id` | DELETE | ✅ | ❌ |

---

## Health Check

#### Health Check
**GET** `/api/health`

**Public Endpoint** - No authentication required

**Success Response (200):**
```json
{
  "success": true,
  "status": "OK",
  "message": "Eye Clinic API is running",
  "mongodb": "connected",
  "timestamp": "2024-01-20T10:00:00.000Z"
}
```

---

## Frontend Integration Examples

### Axios Setup
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Login Example
```javascript
const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { token, user: userData };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
```

### Create Patient Example
```javascript
const createPatient = async (patientData) => {
  try {
    const response = await api.post('/patients', patientData);
    return response.data.patient;
  } catch (error) {
    if (error.response?.status === 409) {
      throw new Error('Patient with this phone number already exists');
    }
    throw new Error(error.response?.data?.message || 'Failed to create patient');
  }
};
```

### Create Visit Example
```javascript
const createVisit = async (visitData) => {
  try {
    const response = await api.post('/visits', visitData);
    return response.data.visit;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create visit');
  }
};

// Usage
const visit = await createVisit({
  patientId: '507f1f77bcf86cd799439021',
  eyeExam: {
    visualAcuity: { OD: '0.1-1', OS: '0.1-1' },
    oldGlasses: {
      OD: { sphere: '-2.00', cylinder: '-0.50', axis: '180' },
      OS: { sphere: '-2.00', cylinder: '-0.50', axis: '180' }
    },
    // ... other fields
  },
  recommendations: 'Follow up in 3 months',
  followUpDate: '2024-04-20T10:00:00.000Z'
});
```

---

## Notes

1. **Token Storage:** Store JWT token securely (localStorage for web, secure storage for mobile)
2. **Token Expiration:** Token expires in 15 minutes. Implement token refresh or re-login flow
3. **Date Formats:** Use ISO 8601 format for dates (e.g., `"2024-01-20T10:00:00.000Z"`)
4. **ObjectId Format:** MongoDB ObjectIds are 24-character hex strings
5. **Patient Code:** Auto-generated, cannot be manually set or updated
6. **Doctor Assignment:** `doctorId` in visits is automatically set from the authenticated user
7. **Pagination:** Currently not implemented. All endpoints return all records
8. **Search:** Patient search is case-insensitive partial match
9. **Phone Uniqueness:** Phone numbers must be unique across all patients
10. **Hard Deletes:** Deleting patients/users is permanent (no soft delete)

---

## Support

For issues or questions, contact the backend development team.

**Last Updated:** 2024-01-20
