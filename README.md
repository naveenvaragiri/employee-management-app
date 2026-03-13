# employee-management-app
An enterprise employee management system with CRUD operations via a RESTful API.

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express 5
- **Testing**: Jest + Supertest

## Getting Started

### Install dependencies
```bash
npm install
```

### Run the server
```bash
npm start
```
The API will be available at `http://localhost:3000`.  
Set the `PORT` environment variable to use a different port.

### Run tests
```bash
npm test
```

---

## Employee Fields

| Field         | Type   | Description                          |
|---------------|--------|--------------------------------------|
| `id`          | string | UUID, auto-generated                 |
| `name`        | string | Full name of the employee            |
| `phoneNumber` | string | Contact phone number                 |
| `emailId`     | string | Email address                        |
| `role`        | string | Job role / title                     |
| `hireDate`    | string | Date of hire (`YYYY-MM-DD`)          |
| `department`  | string | Department the employee belongs to   |

---

## API Endpoints

### Health Check
| Method | URL       | Description        |
|--------|-----------|--------------------|
| GET    | `/health` | Returns API status |

---

### Employees

#### Get all employees
```
GET /api/employees
```
**Response** `200 OK` — array of employee objects.

---

#### Get employee by ID
```
GET /api/employees/:id
```
**Response** `200 OK` — single employee object.  
**Response** `404 Not Found` — `{ "error": "Employee not found" }`

---

#### Create employee
```
POST /api/employees
Content-Type: application/json
```
**Request body:**
```json
{
  "name": "Alice Johnson",
  "phoneNumber": "+1-555-123-4567",
  "emailId": "alice.johnson@example.com",
  "role": "Software Engineer",
  "hireDate": "2023-06-15",
  "department": "Engineering"
}
```
**Response** `201 Created` — created employee object (includes `id`).  
**Response** `400 Bad Request` — validation errors.

---

#### Update employee
```
PUT /api/employees/:id
Content-Type: application/json
```
**Request body:** same structure as POST.  
**Response** `200 OK` — updated employee object.  
**Response** `404 Not Found` — employee not found.  
**Response** `400 Bad Request` — validation errors.

---

#### Delete employee
```
DELETE /api/employees/:id
```
**Response** `204 No Content` — employee deleted.  
**Response** `404 Not Found` — employee not found.
