# 📚 Bookstore Microservices System

> **ITS 2130 – Enterprise Cloud Architecture Final Project**  
> **Higher Diploma in Software Engineering – IJSE**

---

## Final MainRepository
https://github.com/nimsimethusala/bookstore-eca-final.git

## 1. Project Overview

This project is a **cloud-native microservice-based Bookstore Management System** developed for the **ITS 2130 – Enterprise Cloud Architecture** final project.  
The system follows a **microservice architecture** with separate platform services and business services, and it is designed to be deployed on **Google Cloud Platform (GCP)** according to the module guidelines.

The main objective of this project is to demonstrate:
- microservice-based system design,
- centralized configuration,
- service discovery,
- API gateway-based routing,
- relational and non-relational database integration,
- frontend-to-backend communication,
- and cloud deployment concepts required by the module.

According to the guideline, the project must follow a microservice architecture with **2 to 5 microservices**, use **Spring Boot / Spring Cloud**, include **both relational and non-relational databases**, use **Config Server**, **Eureka**, and an **API Gateway**, and be submitted through a **main repository that links all other repositories using Git submodules**. fileciteturn0file0L53-L63 fileciteturn0file0L69-L77 fileciteturn0file0L82-L89

---

## 2. System Architecture

This project is organized into two main layers:

### Platform Services
1. **Config Server**  
   Centralizes configuration for all services.
2. **Eureka Server**  
   Handles service registration and discovery.
3. **API Gateway**  
   Provides a single entry point for client requests and routes traffic to backend microservices.

### Business Microservices
1. **Book Service**  
   Manages book-related operations using a **relational database (MySQL)**.
2. **Order Service**  
   Manages order-related operations using a **non-relational database (MongoDB)**.

### Frontend
- **React Frontend**  
  A simple frontend application used to consume backend APIs through the API Gateway and demonstrate that the microservices are functioning correctly.

This matches the guideline requirement to include **Config Server**, **Eureka Service Registry**, and **API Gateway** as mandatory platform components, and to include both **relational** and **non-relational** databases in the system. fileciteturn0file0L69-L77 fileciteturn0file0L59-L67

---

## 3. High-Level Architecture Diagram

```text
                      +-----------------------------+
                      |        React Frontend       |
                      |   (Consumes APIs via GW)    |
                      +--------------+--------------+
                                     |
                                     v
                      +-----------------------------+
                      |         API Gateway         |
                      |           Port 8080         |
                      +--------------+--------------+
                                     |
                   +-----------------+-----------------+
                   |                                   |
                   v                                   v
      +---------------------------+       +---------------------------+
      |       Book Service        |       |       Order Service       |
      |         Port 8081         |       |         Port 8082         |
      |        MySQL DB           |       |        MongoDB            |
      +---------------------------+       +---------------------------+

                                     ^
                                     |
                      +-----------------------------+
                      |        Eureka Server        |
                      |          Port 8761          |
                      +-----------------------------+

                                     ^
                                     |
                      +-----------------------------+
                      |        Config Server        |
                      |          Port 8888          |
                      +-----------------------------+
```

---

## 4. Repository Structure

The guideline requires a **polyrepo structure with Git submodules**, where each microservice and each platform component is maintained in its own repository, while one main repository is used for final submission. fileciteturn0file0L82-L89

This project is organized as follows:

```text
bookstore/
├── platform/
│   ├── api-gateway/
│   ├── config-server/
│   └── eureka-server/
├── service/
│   ├── book-service/
│   └── order-service/
├── config-repo/
├── bookstore-react-frontend/
├── Bookstore-ECA.postman_collection.json
├── README.md
└── SETUP.md
```

---

## 5. Technologies Used

### Backend
- Java
- Spring Boot
- Spring Cloud
- Spring Data JPA
- Spring Data MongoDB
- Spring Cloud Config
- Spring Cloud Netflix Eureka
- Spring Cloud Gateway
- OpenFeign (used in Order Service)
- Maven

### Frontend
- React
- Vite
- JavaScript
- CSS

### Databases
- MySQL
- MongoDB

### Cloud / Deployment
- Google Cloud Platform (GCP)
- Google Compute Engine VMs

> **Note:** The module guideline specifies **Java 25** as the required version. fileciteturn0file0L59-L63 If your submitted implementation currently uses another Java version, update the project and deployment environment before final submission.

---

## 6. Services and Ports

| Component | Port | Description |
|---|---:|---|
| Config Server | 8888 | Centralized external configuration |
| Eureka Server | 8761 | Service registry and discovery |
| API Gateway | 8080 | Single entry point to backend services |
| Book Service | 8081 | Book management service using MySQL |
| Order Service | 8082 | Order management service using MongoDB |
| Frontend | Vite default / deployed URL | User interface for consuming backend APIs |

---

## 7. API Gateway Routes

The API Gateway exposes the following main routes:

| Route | Target Service |
|---|---|
| `/api/v1/books/**` | Book Service |
| `/api/v1/orders/**` | Order Service |

This supports the guideline requirement that the frontend should interact with backend services **through the API Gateway**. fileciteturn0file0L92-L100

---

## 8. Main Functionalities

### Book Service
The Book Service provides book management operations such as:
- create a new book,
- retrieve all books,
- retrieve a book by ID,
- retrieve a book by ISBN,
- search books,
- filter books by category,
- retrieve available books,
- update book details,
- update stock,
- delete books.

### Order Service
The Order Service provides order management operations such as:
- create a new order,
- retrieve all orders,
- retrieve an order by ID,
- retrieve customer orders,
- retrieve orders by status,
- update order status,
- cancel orders,
- delete orders.

### Frontend
The frontend is used to:
- access the system through a browser,
- call the backend through the API Gateway,
- demonstrate that the services are running correctly.

This satisfies the requirement that the frontend should demonstrate correct backend access and service functionality, rather than focusing on visual design. fileciteturn0file0L92-L100

---

## 9. Database Usage

The guideline makes it mandatory to use **both a relational database and a non-relational database**. fileciteturn0file0L59-L67

This project uses:
- **MySQL** for the **Book Service**
- **MongoDB** for the **Order Service**

Therefore, the project demonstrates both database categories required by the module.

---

## 10. Configuration Management

All service configurations are externalized through the **Config Server** using a dedicated configuration repository.

Configuration files include:
- `api-gateway.yml`
- `book-service.yml`
- `order-service.yml`

This allows services to load centralized configuration at startup and keeps configuration separate from service code.

---

## 11. Service Discovery

The system uses **Eureka Server** for service registration and discovery.

All backend services register with Eureka, and the API Gateway uses logical service names to route requests dynamically.

### Public Eureka Dashboard URL
**Replace this with your deployed public URL before submission:**

```text
http://34.126.150.171:8761
```

> The guideline explicitly states that the **GitHub README.md must include the public URL of the Eureka Dashboard**. fileciteturn0file0L126-L130

---

## 12. Running the Project Locally

### Prerequisites
- Java JDK
- Maven
- MySQL
- MongoDB
- Node.js and npm
- Git

### Local Startup Order
To run the system locally, start the services in the following order:

1. **Config Server**
2. **Eureka Server**
3. **API Gateway**
4. **Book Service**
5. **Order Service**
6. **React Frontend**

### Build Commands
Run these commands inside each Spring Boot project:

```bash
mvn clean package
```

### Run Backend Services
Run each generated JAR file:

```bash
java -jar target/<jar-file-name>.jar
```

### Run Frontend
```bash
cd bookstore-react-frontend
npm install
npm run dev
```

---

## 13. Sample Local URLs

| Component | URL |
|---|---|
| Eureka Dashboard | `http://localhost:8761` |
| Config Server | `http://localhost:8888` |
| API Gateway | `http://localhost:8080` |
| Book Service Health | `http://localhost:8080/api/v1/books/health` |
| Order Service Health | `http://localhost:8080/api/v1/orders/health` |
| Frontend | `http://localhost:5173` |

---

## 14. GCP Deployment Notes

According to the guideline, the final deployed system should demonstrate GCP resources such as:
- VM Instance Groups,
- Virtual Machines,
- VM Instance Templates,
- Disk Images,
- Health Checks,
- Cloud DNS,
- Load Balancing,
- Cloud NAT Gateway,
- Cloud SQL,
- Firestore,
- Cloud Storage Buckets,
- Cloud Router,
- VPC Network,
- Firewall Rules. fileciteturn0file0L103-L114

The deployment should also demonstrate:
- auto scaling for backend services,
- high availability for platform services,
- PM2-based process management,
- automatic restart on failure. fileciteturn0file0L118-L124

### PM2 Requirement
The guideline requires applications to be managed by **PM2** and automatically restart on failure and on VM reboot. fileciteturn0file0L118-L124

Example commands:

```bash
pm2 start "java -jar target/config-server-1.0.0.jar" --name config-server
pm2 start "java -jar target/eureka-server-1.0.0.jar" --name eureka-server
pm2 start "java -jar target/api-gateway-1.0.0.jar" --name api-gateway
pm2 start "java -jar target/book-service-1.0.0.jar" --name book-service
pm2 start "java -jar target/order-service-1.0.0.jar" --name order-service
pm2 save
pm2 startup
```

---

## 15. Postman Collection

A Postman collection is included in this repository:

```text
Bookstore-ECA.postman_collection.json
```

This collection can be imported into Postman to test the API endpoints through the API Gateway.

---

## 16. Screen Recording Checklist

The guideline requires a short screen recording showing the deployed cloud infrastructure and VM verification. fileciteturn0file0L132-L141

Your recording should include:
1. Navigation through the required GCP resources.
2. Public IPs / deployed URLs.
3. SSH into each VM.
4. Execution of:

```bash
pm2 monit
```

5. Proof that services are running under PM2.

---

## 17. Important Submission Notes

Before final submission, make sure to:
- replace the Eureka Dashboard placeholder URL with the real public URL,
- ensure the main repository correctly links all repositories,
- confirm that all required deployment resources are visible in GCP,
- confirm that both MySQL and MongoDB are used,
- confirm that the frontend communicates through the API Gateway,
- verify that PM2 is used for deployment,
- include the required screen recording.

---

## 18. Author

**Name:** Nimsi Methusala 
**Student ID:** 2301691055  
**Module:** ITS 2130 – Enterprise Cloud Architecture  
**Institute:** IJSE

---

## 19. Final Note

This project was developed as a final submission for the **Enterprise Cloud Architecture** module by applying the architectural patterns, cloud concepts, and deployment practices covered during the module.

The system demonstrates a practical microservice architecture with centralized configuration, service discovery, API gateway routing, and multi-database integration for a bookstore domain.
