<h1 align="center">Insight Dash - Fullstack Sales Analysis System</h1>

<p align="center">A full-stack sales dashboard system built with React, Spring Boot, and Spring Security (JWT), focused on data analysis, management, and visualization of business metrics.</p>

<p align="center">
  <a href="#✨-Main-features">Features</a>
  <a href="#💻-Technologies-Used">Technologies</a>
  <a href="#🚀-How-to-use">How to use</a>
</p>

<br>

<p align="center">
  <img width="1355" height="763" alt="Image" src="https://github.com/user-attachments/assets/ead9caad-55b9-4af3-9d50-e6a6265adb60" />
</p>

<p align="center">
  <img width="1902" height="977" alt="image" src="https://github.com/user-attachments/assets/6c7aba42-9fba-4c09-8b66-f801becdddcb" />
</p>
<p align="center">
  <img width="1581" height="767" alt="Image" src="https://github.com/user-attachments/assets/df97c0df-5940-48df-adde-48e40e9960c5" />
</p>
<p align="center">
  <img width="1581" height="764" alt="Image" src="https://github.com/user-attachments/assets/89a7acc3-6b79-4014-be9c-d7ded28abfaa" />
</p>
<p align="center">
  <img width="1705" height="845" alt="Image" src="https://github.com/user-attachments/assets/2d284cca-3317-4c1e-8254-d77e2c7f88b5" />
</p>
<p align="center">
  <img width="1706" height="843" alt="Image" src="https://github.com/user-attachments/assets/c12bcbd5-d297-4701-9962-b1b2516ff782" />
</p>
<p align="center">
 <img width="1708" height="849" alt="Image" src="https://github.com/user-attachments/assets/c826d8ad-1c28-4a6f-a1da-c0dc7c0b6b39" />
</p>
<p align="center">
 <img width="1910" height="1071" alt="Image" src="https://github.com/user-attachments/assets/e5653cb5-d7da-4350-9ed4-61fcf781a720" />
</p>
<p align="center">
 <img width="1374" height="790" alt="Image" src="https://github.com/user-attachments/assets/bd63cf61-d326-4c8c-b822-ee833d5230f7" />
</p>

## ✨ Main features

This project implements a complete CRUD system with the following features:

-   **Secure Authentication:**
    -   User login with credential validation via API.
    -   **JWT** token generation and validation to protect routes.
    -   **Role-based** access control system.

-   **Analytics Dashboard (`/analyses`):**
    -   Interactive charts to view **sales per representative** and **top-selling products.**.
    -   **KPIs** calculated on the back end, such as average ticket, new clients, and low-stock product count.
    -   Display of **Top Clients** ranked by purchase value.

-   **Management (Full CRUD):**
    -   **Team:** Add, edit, and delete team members with profile photo upload.
    -   **Clients:** Full CRUD for the client base, also with image upload.
    -   **Products:** Product catalog management, including image, price, and stock control.
    -   **Search, pagination, and sorting** available across all tables.

-   **Sales System:**
    -   Dedicated page to **Register new sales**.
    -   Searchable product and client catalog for building orders.
    -   **Automatic stock deduction** when completing a sale (transactional logic on the back end).
    -   Generation of **PDF receipts** on the client side, including product photos and order details.

-   **Activity Log (`/logs`):**
    -   A feed that records all important actions in the system (client creation, new sales, etc.).
    -   FSearch and delete functionalities for logs.

-   **Modern and Responsive UI:**
    -   Glassmorphism-inspired design built with **Tailwind CSS**.
    -   Reusable, accessible components using **shadcn/ui**.
    -   Fully responsive layout for desktop, tablet, and mobile.

---

## 💻 Technologies Used

The project is divided into two independent applications:

### **🚀 Front-end (React)**
-   **React 18** with **Vite**
-   **TypeScript**
-   **Tailwind CSS** for ultility styling
-   **shadcn/ui** for UI components
-   **React Router** for routing
-   **Recharts** for charts
-   **jsPDF** & **jspdf-autotable** for PDF generation
-   **Sonner** for notification (toasts)

### **⚙️ Back-end (Spring Boot)**
-   **Java 17+**
-   **Spring Boot 3**
-   **Spring Security 6** with **JWT authentication**
-   **Spring Data JPA** (Hibernate)
-   **Lombok**
-   **MySQL** as the database
-   **Maven** for dependency management

---

## 🚀 How to use

Follow these steps to run the application locally.

### **Necessary**
-   Node.js (v18+)
-   Java JDK (v17+)
-   Maven
-   a running **MySQL** database.

### **1. Back-end setup**
```bash
# Clone o repositório do back-end
git clone https://github.com/Alesson-porfiro/fullstack-sales-dashboard-react-spring
cd src/main/java/springSecurityAlesson/mySpringSec

# In your MySQL client, create the database:
# CREATE DATABASE spring_security_db;

# Configure the file 'src/main/resources/application.properties'
# with your MySQL username and password.

# Run the application
./mvnw spring-boot:run
```
A API estará rodando em `http://localhost:8080`.

### **2. Front-end setup**
```bash
# Clone the frontend repository
git clone https://github.com/Alesson-porfiro/fullstack-sales-dashboard-react-spring
cd original-tailwind-dashbord

# Install dependencies
npm install

# Create a .env.local file at the project root with the API URL
echo "VITE_API_URL=http://localhost:8080" > .env.local

# Run the application
npm run dev
```
The application will be available at `http://localhost:5173`.

Login: admin
Password: admin123




