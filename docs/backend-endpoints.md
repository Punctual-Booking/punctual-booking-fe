# Backend API Endpoints

This document lists all backend endpoints required by the frontend, with details on their usage, parameters, and expected responses. Use this as a reference for backend implementation (Swagger-style).

---

## Authentication

### Endpoint: `/api/auth/login`

**Name:** Login

**Description:** Authenticates a user and returns access and refresh tokens.

**Params:**

- `email` (string, required)
- `password` (string, required, pre-hashed)

**Return responses:**

- **200 OK**: `{ accessToken: string, refreshToken: string }`
- **400/401**: `{ message: string }`

---

### Endpoint: `/api/auth/register`

**Name:** Register

**Description:** Registers a new user and returns the created user object.

**Params:**

- `firstName` (string, required)
- `lastName` (string, required)
- `email` (string, required)
- `password` (string, required, pre-hashed)
- `confirmPassword` (string, required, pre-hashed)

**Return responses:**

- **201 Created**: [User](#user-object)
- **400**: `{ message: string }`

---

### Endpoint: `/api/auth/logout`

**Name:** Logout

**Description:** Logs out the current user and invalidates the session/token.

**Params:**

- (Requires Authorization header)

**Return responses:**

- **200 OK**: `{ message: string }`

---

### Endpoint: `/api/user/me`

**Name:** Get Current User

**Description:** Returns the currently authenticated user's information.

**Params:**

- (Requires Authorization header)

**Return responses:**

- **200 OK**: [User](#user-object)
- **401**: `{ message: string }`

---

## Appointments

### Endpoint: `/api/appointments?customerId={customerId}&businessId={businessId}`

**Name:** Get User Appointments

**Description:** Fetches all appointments for a specific user and business.

**Params:**

- `customerId` (string, required, query)
- `businessId` (string, required, query)

**Return responses:**

- **200 OK**: Array<[AppointmentResponseDto](#appointmentresponsedto)>

---

### Endpoint: `/api/appointments/{id}?businessId={businessId}`

**Name:** Get Appointment by ID

**Description:** Fetches a single appointment by its ID and business.

**Params:**

- `id` (string, required, path)
- `businessId` (string, required, query)

**Return responses:**

- **200 OK**: [AppointmentResponseDto](#appointmentresponsedto)
- **404**: `{ message: string }`

---

### Endpoint: `/api/appointments`

**Name:** Create Appointment

**Description:** Creates a new appointment.

**Params:**

- `staffId` (string, required)
- `serviceId` (string, required)
- `appointmentTime` (string, required, ISO8601)
- `customerNotes` (string, optional)
- `businessId` (string, required)

**Return responses:**

- **201 Created**: [AppointmentResponseDto](#appointmentresponsedto)
- **400**: `{ message: string }`

---

### Endpoint: `/api/appointments/{id}?businessId={businessId}`

**Name:** Update Appointment

**Description:** Updates an appointment's status, time, or notes.

**Params:**

- `id` (string, required, path)
- `appointmentTime` (string, optional, ISO8601)
- `status` (string, optional, enum: scheduled, rescheduled, completed, cancelled, noShow)
- `customerNotes` (string, optional)
- `businessId` (string, optional)

**Return responses:**

- **200 OK**: [AppointmentResponseDto](#appointmentresponsedto)
- **400/404**: `{ message: string }`

---

## Services

### Endpoint: `/api/services?businessId={businessId}`

**Name:** Get All Services

**Description:** Fetches all services for a business.

**Params:**

- `businessId` (string, required, query)

**Return responses:**

- **200 OK**: Array<[Service](#service-object)>

---

### Endpoint: `/api/services/{id}?businessId={businessId}`

**Name:** Get Service by ID

**Description:** Fetches a single service by its ID and business.

**Params:**

- `id` (string, required, path)
- `businessId` (string, required, query)

**Return responses:**

- **200 OK**: [Service](#service-object)
- **404**: `{ message: string }`

---

### Endpoint: `/api/services/staff/{staffId}?businessId={businessId}`

**Name:** Get Services by Staff

**Description:** Fetches all services that can be provided by a specific staff member.

**Params:**

- `staffId` (string, required, path)
- `businessId` (string, required, query)

**Return responses:**

- **200 OK**: Array<[Service](#service-object)>

---

## Staff

### Endpoint: `/api/staff?businessId={businessId}`

**Name:** Get All Staff

**Description:** Fetches all staff members for a business.

**Params:**

- `businessId` (string, required, query)

**Return responses:**

- **200 OK**: Array<[StaffMember](#staffmember-object)>

---

### Endpoint: `/api/staff/{id}?businessId={businessId}`

**Name:** Get Staff by ID

**Description:** Fetches a single staff member by their ID and business.

**Params:**

- `id` (string, required, path)
- `businessId` (string, required, query)

**Return responses:**

- **200 OK**: [StaffMember](#staffmember-object)
- **404**: `{ message: string }`

---

### Endpoint: `/api/staff/service/{serviceId}?businessId={businessId}`

**Name:** Get Staff by Service

**Description:** Fetches all staff members that can perform a specific service.

**Params:**

- `serviceId` (string, required, path)
- `businessId` (string, required, query)

**Return responses:**

- **200 OK**: Array<[StaffMember](#staffmember-object)>

---

## Data Models

These are the minimum data requirements, database tables will probably have much more data.

### User Object

```
{
  id: string,
  name: string,
  email: string,
  role: 'admin' | 'staff' | 'customer'
}
```

### AppointmentResponseDto

```
{
  id: string,
  staffId: string,
  staff: StaffMember,
  serviceId: string,
  service: Service,
  customerId: string,
  customerName: string,
  appointmentTime: string,
  endTime: string,
  status: 'scheduled' | 'rescheduled' | 'completed' | 'cancelled' | 'noShow',
  customerNotes?: string,
  createdAt: string,
  updatedAt: string,
  businessId: string
}
```

### Service Object

```
{
  id: string,
  name: string,
  description: string,
  price: number,
  duration: number,
  image?: string,
  businessId: string
}
```

### StaffMember Object

```
{
  id: string,
  name: string,
  email: string,
  phone: string,
  image?: string,
  specialties: string[],
  services: string[],
  yearsOfExperience: number,
  isActive: boolean,
  businessId: string
}
```
