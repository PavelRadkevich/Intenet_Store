CREATE DATABASE AJI

CREATE TABLE Category (
Id INT IDENTITY(1, 1) PRIMARY KEY,
Name NVARCHAR(255) NOT NULL
);

CREATE TABLE Product (
ID INT IDENTITY(1, 1) PRIMARY KEY,
Name NVARCHAR(255) NOT NULL,
Description NVARCHAR(MAX) NOT NULL,
UnitPrice DECIMAL(10, 2) NOT NULL,
UnitWeight Decimal(10, 2) NOT NULL,
CategoryId INT FOREIGN KEY REFERENCES Category(id)
);

CREATE TABLE OrderStatus (
Id INT IDENTITY(1, 1) PRIMARY KEY,
Name NVARCHAR(255) NOT NULL
);

CREATE TABLE Order_ (
Id INT IDENTITY(1, 1) PRIMARY KEY,
ApprovalDate DATETIME,
OrderStatusId INT FOREIGN KEY REFERENCES OrderStatus(Id) NOT NULL,
UserName NVARCHAR(255) NOT NULL,
Email NVARCHAR(255) NOT NULL,
PhoneNumber NVARCHAR(20) NOT NULL,
);

CREATE TABLE OrderItem (
    Id INT IDENTITY(1, 1) PRIMARY KEY,
    OrderId INT FOREIGN KEY REFERENCES Order_(Id) NOT NULL,
    ProductId INT FOREIGN KEY REFERENCES Product(Id) NOT NULL,
    Quantity INT NOT NULL
);

INSERT INTO OrderStatus(Name)
VALUES ('NOT APPROVED')
INSERT INTO OrderStatus(Name)
VALUES ('APPROVED')
INSERT INTO OrderStatus(Name)
VALUES ('CANCELED')
INSERT INTO OrderStatus(Name)
VALUES ('COMPLETED')
