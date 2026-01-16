# SQL Server Database Design for HD Print Tag System

## 📋 Overview
การออกแบบฐานข้อมูลสำหรับระบบพิมพ์ป้ายฉลากจัมโบ้ HDPE/PP/PPC โดยใช้ SQL Server

**วัตถุประสงค์:**
- จัดเก็บข้อมูลเกรดและน้ำหนักบรรจุภัณฑ์แบบยืดหยุ่น
- รองรับการเพิ่ม/ลดขนาดบรรจุภัณฑ์โดยไม่ต้องแก้ไขโค้ด
- รองรับ 3 หน่วยการผลิต: HDPE, PP, PPC

## 🏗️ Database Schema

### Database Name: `HDPrintTagDB`

---

## 📊 Tables Design

### 1. **Units** (หน่วยการผลิต)
จัดเก็บข้อมูลหน่วยการผลิตที่แตกต่างกัน

```sql
CREATE TABLE [dbo].[Units] (
    [UnitID] NVARCHAR(10) PRIMARY KEY,
    [UnitName] NVARCHAR(50) NOT NULL,
    [FullName] NVARCHAR(100) NOT NULL,
    [Description] NVARCHAR(255) NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT [CK_Units_UnitID_Format] CHECK ([UnitID] LIKE '[A-Z]%')
);
```

**Sample Data:**
```sql
INSERT INTO [Units] ([UnitID], [UnitName], [FullName], [Description]) VALUES
('HDPE', 'HDPE', 'High-Density Polyethylene', 'HDPE Pellet Production Unit'),
('PP', 'PP', 'Polypropylene', 'PP Pellet Production Unit'),
('PPC', 'PPC', 'Polypropylene Compound', 'PPC Pellet Production Unit');
```

---

### 2. **Grades** (เกรดผลิตภัณฑ์)
จัดเก็บข้อมูลเกรดของผลิตภัณฑ์แต่ละหน่วย

```sql
CREATE TABLE [dbo].[Grades] (
    [GradeID] INT IDENTITY(1,1) PRIMARY KEY,
    [UnitID] NVARCHAR(10) NOT NULL,
    [GradeCode] NVARCHAR(20) NOT NULL,
    [Description] NVARCHAR(255) NULL,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [HasSubGrade] BIT NOT NULL DEFAULT 0,
    [CreatedAt] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
    [UpdatedAt] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT [FK_Grades_Units] FOREIGN KEY ([UnitID]) 
        REFERENCES [Units]([UnitID]) ON DELETE CASCADE,
    CONSTRAINT [UQ_Grades_UnitID_GradeCode] UNIQUE ([UnitID], [GradeCode])
);

-- Index for performance
CREATE NONCLUSTERED INDEX [IX_Grades_UnitID_Active] 
ON [Grades] ([UnitID], [IsActive]) 
INCLUDE ([GradeCode], [Description]);
```

**Sample Data:**
```sql
-- HDPE Grades
INSERT INTO [Grades] ([UnitID], [GradeCode], [Description], [IsActive], [HasSubGrade]) VALUES
('HDPE', 'P901BK', 'Black Pipe Grade', 1, 0),
('HDPE', 'P921BK', 'Black Pipe Grade', 1, 0),
('HDPE', 'P921NT', 'Natural Pipe Grade', 1, 0),
('HDPE', 'AM3245PC', 'Injection Grade', 1, 1),
('HDPE', 'P900BK', 'Black Pipe Grade', 1, 1),
('HDPE', 'P900NT', 'Natural Pipe Grade', 1, 0),
('HDPE', 'I055BK', 'Injection Black', 1, 0),
('HDPE', 'I055NT', 'Injection Natural', 1, 0),
('HDPE', 'B640BK', 'Blow Molding Black', 1, 0),
('HDPE', 'B640NT', 'Blow Molding Natural', 0, 0);

-- PP Grades (Sample)
INSERT INTO [Grades] ([UnitID], [GradeCode], [Description], [IsActive], [HasSubGrade]) VALUES
('PP', '1032L', 'PP Standard Grade', 1, 0),
('PP', '1102H', 'PP Standard Grade', 1, 0),
('PP', '1105SC', 'PP Standard Grade SC', 1, 0),
('PP', '1140H', 'PP High Flow', 1, 0),
('PP', '1150H', 'PP High Stiffness', 1, 0);

-- PPC Grades (Sample)
INSERT INTO [Grades] ([UnitID], [GradeCode], [Description], [IsActive], [HasSubGrade]) VALUES
('PPC', 'B1101', 'PPC Block Copolymer', 1, 0),
('PPC', 'BC03B', 'PPC Block Copolymer', 1, 0),
('PPC', 'K4510B', 'PPC K4510 Black', 1, 0),
('PPC', 'FL203D', 'PPC Standard Grade', 1, 0);
```

---

### 3. **NetWeights** (น้ำหนักบรรจุภัณฑ์)
จัดเก็บน้ำหนักบรรจุภัณฑ์แบบแยกตาราง เพื่อความยืดหยุ่น

```sql
CREATE TABLE [dbo].[NetWeights] (
    [NetWeightID] INT IDENTITY(1,1) PRIMARY KEY,
    [WeightValue] DECIMAL(10,2) NOT NULL,
    [WeightUnit] NVARCHAR(10) NOT NULL DEFAULT 'kg',
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT [CK_NetWeights_WeightValue_Positive] CHECK ([WeightValue] > 0),
    CONSTRAINT [UQ_NetWeights_WeightValue] UNIQUE ([WeightValue])
);

-- Index for performance
CREATE NONCLUSTERED INDEX [IX_NetWeights_WeightValue_Active] 
ON [NetWeights] ([WeightValue], [IsActive]);
```

**Sample Data:**
```sql
INSERT INTO [NetWeights] ([WeightValue]) VALUES
(750), (800), (900), (16500), (18000);
```

---

### 4. **GradeNetWeights** (ความสัมพันธ์ Grade-NetWeight)
Junction table สำหรับความสัมพันธ์ Many-to-Many ระหว่าง Grade และ NetWeight

```sql
CREATE TABLE [dbo].[GradeNetWeights] (
    [ID] INT IDENTITY(1,1) PRIMARY KEY,
    [GradeID] INT NOT NULL,
    [NetWeightID] INT NOT NULL,
    [SortOrder] INT NOT NULL DEFAULT 1,
    [IsActive] BIT NOT NULL DEFAULT 1,
    [CreatedAt] DATETIME2(7) NOT NULL DEFAULT GETDATE(),
    
    CONSTRAINT [FK_GradeNetWeights_Grades] FOREIGN KEY ([GradeID]) 
        REFERENCES [Grades]([GradeID]) ON DELETE CASCADE,
    CONSTRAINT [FK_GradeNetWeights_NetWeights] FOREIGN KEY ([NetWeightID]) 
        REFERENCES [NetWeights]([NetWeightID]) ON DELETE CASCADE,
    CONSTRAINT [UQ_GradeNetWeights_GradeID_NetWeightID] UNIQUE ([GradeID], [NetWeightID])
);

-- Indexes for performance
CREATE NONCLUSTERED INDEX [IX_GradeNetWeights_GradeID_SortOrder] 
ON [GradeNetWeights] ([GradeID], [SortOrder]) 
INCLUDE ([NetWeightID], [IsActive]);

CREATE NONCLUSTERED INDEX [IX_GradeNetWeights_NetWeightID] 
ON [GradeNetWeights] ([NetWeightID]);
```

---

## 🔧 Database Functions and Procedures

### 1. **Function: GetGradeDataByUnit**
ดึงข้อมูลเกรดและน้ำหนักตาม Unit (ใช้แทน API)

```sql
CREATE FUNCTION [dbo].[GetGradeDataByUnit](@UnitID NVARCHAR(10))
RETURNS TABLE
AS
RETURN
(
    SELECT 
        g.GradeCode AS [grade],
        STRING_AGG(CAST(nw.WeightValue AS NVARCHAR(20)), ',') 
            WITHIN GROUP (ORDER BY gnw.SortOrder) AS [netweightArray],
        g.Description AS [description],
        g.IsActive AS [status],
        g.HasSubGrade AS [sub]
    FROM [Grades] g
    LEFT JOIN [GradeNetWeights] gnw ON g.GradeID = gnw.GradeID AND gnw.IsActive = 1
    LEFT JOIN [NetWeights] nw ON gnw.NetWeightID = nw.NetWeightID AND nw.IsActive = 1
    WHERE g.UnitID = @UnitID AND g.IsActive = 1
    GROUP BY g.GradeCode, g.Description, g.IsActive, g.HasSubGrade, g.GradeID
);
```

**Usage:**
```sql
SELECT * FROM [dbo].[GetGradeDataByUnit]('HDPE');
```

### 2. **Stored Procedure: AddNetWeightToGrade**
เพิ่มน้ำหนักใหม่ให้กับเกรดที่ระบุ

```sql
CREATE PROCEDURE [dbo].[AddNetWeightToGrade]
    @GradeID INT,
    @WeightValue DECIMAL(10,2),
    @SortOrder INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @NetWeightID INT;
    
    -- Get or Create NetWeight
    SELECT @NetWeightID = NetWeightID 
    FROM [NetWeights] 
    WHERE WeightValue = @WeightValue;
    
    IF @NetWeightID IS NULL
    BEGIN
        INSERT INTO [NetWeights] (WeightValue) VALUES (@WeightValue);
        SET @NetWeightID = SCOPE_IDENTITY();
    END
    
    -- Set default sort order
    IF @SortOrder IS NULL
    BEGIN
        SELECT @SortOrder = ISNULL(MAX(SortOrder), 0) + 1 
        FROM [GradeNetWeights] 
        WHERE GradeID = @GradeID;
    END
    
    -- Add to GradeNetWeights
    INSERT INTO [GradeNetWeights] (GradeID, NetWeightID, SortOrder)
    VALUES (@GradeID, @NetWeightID, @SortOrder);
    
    SELECT 'Success' AS Result;
END
```

### 3. **Stored Procedure: RemoveNetWeightFromGrade**
ลบน้ำหนักออกจากเกรดที่ระบุ

```sql
CREATE PROCEDURE [dbo].[RemoveNetWeightFromGrade]
    @GradeID INT,
    @NetWeightID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE [GradeNetWeights] 
    SET IsActive = 0 
    WHERE GradeID = @GradeID AND NetWeightID = @NetWeightID;
    
    SELECT 'Success' AS Result;
END
```

---

## 📈 Database Performance Optimization

### 1. **Indexes Strategy**
```sql
-- Additional performance indexes
CREATE NONCLUSTERED INDEX [IX_Units_IsActive] 
ON [Units] ([IsActive]) INCLUDE ([UnitID], [UnitName]);

CREATE NONCLUSTERED INDEX [IX_Grades_IsActive] 
ON [Grades] ([IsActive]) INCLUDE ([GradeID], [UnitID], [GradeCode]);

CREATE NONCLUSTERED INDEX [IX_NetWeights_IsActive] 
ON [NetWeights] ([IsActive]) INCLUDE ([NetWeightID], [WeightValue]);
```

### 2. **Statistics Maintenance**
```sql
-- Update statistics for better query performance
UPDATE STATISTICS [Units];
UPDATE STATISTICS [Grades];
UPDATE STATISTICS [NetWeights];
UPDATE STATISTICS [GradeNetWeights];
```

---

## 🔒 Security and Permissions

### 1. **Database Roles**
```sql
-- Create application roles
CREATE ROLE [HDPrintTag_ReadWrite];
CREATE ROLE [HDPrintTag_ReadOnly];

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON [Units] TO [HDPrintTag_ReadWrite];
GRANT SELECT, INSERT, UPDATE ON [Grades] TO [HDPrintTag_ReadWrite];
GRANT SELECT, INSERT, UPDATE ON [NetWeights] TO [HDPrintTag_ReadWrite];
GRANT SELECT, INSERT, UPDATE ON [GradeNetWeights] TO [HDPrintTag_ReadWrite];

GRANT SELECT ON [Units] TO [HDPrintTag_ReadOnly];
GRANT SELECT ON [Grades] TO [HDPrintTag_ReadOnly];
GRANT SELECT ON [NetWeights] TO [HDPrintTag_ReadOnly];
GRANT SELECT ON [GradeNetWeights] TO [HDPrintTag_ReadOnly];
```

### 2. **Application User**
```sql
-- Create application login and user
CREATE LOGIN [HDPrintTagApp] WITH PASSWORD = 'YourSecurePassword123!';
USE [HDPrintTagDB];
CREATE USER [HDPrintTagApp] FOR LOGIN [HDPrintTagApp];
ALTER ROLE [HDPrintTag_ReadWrite] ADD MEMBER [HDPrintTagApp];
```

---

## 📊 Sample Queries

### 1. **Get All Units with Grade Count**
```sql
SELECT 
    u.UnitID,
    u.UnitName,
    u.FullName,
    COUNT(g.GradeID) AS GradeCount
FROM [Units] u
LEFT JOIN [Grades] g ON u.UnitID = g.UnitID AND g.IsActive = 1
WHERE u.IsActive = 1
GROUP BY u.UnitID, u.UnitName, u.FullName
ORDER BY u.UnitID;
```

### 2. **Get Grade with NetWeights (JSON Format)**
```sql
SELECT 
    g.UnitID,
    g.GradeCode,
    g.Description,
    (
        SELECT nw.WeightValue
        FROM [GradeNetWeights] gnw
        JOIN [NetWeights] nw ON gnw.NetWeightID = nw.NetWeightID
        WHERE gnw.GradeID = g.GradeID AND gnw.IsActive = 1 AND nw.IsActive = 1
        ORDER BY gnw.SortOrder
        FOR JSON PATH
    ) AS NetWeights
FROM [Grades] g
WHERE g.UnitID = 'HDPE' AND g.IsActive = 1;
```

### 3. **Get Popular NetWeights**
```sql
SELECT 
    nw.WeightValue,
    COUNT(gnw.GradeID) AS UsageCount
FROM [NetWeights] nw
JOIN [GradeNetWeights] gnw ON nw.NetWeightID = gnw.NetWeightID
WHERE nw.IsActive = 1 AND gnw.IsActive = 1
GROUP BY nw.WeightValue
ORDER BY UsageCount DESC;
```

---

## 🚀 Deployment Script

### Complete Database Setup Script
```sql
-- Create Database
CREATE DATABASE [HDPrintTagDB]
COLLATE SQL_Latin1_General_CP1_CI_AS;
GO

USE [HDPrintTagDB];
GO

-- Enable JSON support (SQL Server 2016+)
-- JSON functions are built-in, no additional setup needed

-- Create all tables (run all CREATE TABLE scripts above)
-- Insert sample data (run all INSERT scripts above)
-- Create indexes (run all CREATE INDEX scripts above)
-- Create functions and procedures (run all CREATE FUNCTION/PROCEDURE scripts above)

PRINT 'HDPrintTagDB setup completed successfully!';
```

---

## 📝 Migration Notes

### From Google Sheets to SQL Server
1. **Data Types Mapping:**
   - Google Sheets `string` → SQL Server `NVARCHAR`
   - Google Sheets `number` → SQL Server `INT` or `DECIMAL`
   - Google Sheets `boolean` → SQL Server `BIT`
   - Google Sheets `Date` → SQL Server `DATETIME2`

2. **API Integration:**
   - Replace Google Apps Script with SQL Server stored procedures
   - Use Entity Framework or direct ADO.NET for .NET applications
   - Create REST API using ASP.NET Core Web API

3. **Performance Benefits:**
   - Faster query execution with proper indexing
   - Better concurrency handling
   - ACID compliance for data integrity
   - Advanced query capabilities with T-SQL

---

## 🔄 Maintenance Schedule

### Daily
- Monitor query performance
- Check error logs

### Weekly  
- Update statistics
- Review index usage

### Monthly
- Review data growth
- Archive old inactive records
- Performance tuning review

---

**Created:** 2025-12-11  
**Author:** HD Print Tag System  
**Version:** 1.0.0  
**SQL Server Version:** 2019+