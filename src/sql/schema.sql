CREATE TABLE
    users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(120) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM ('ADMIN', 'STUDENT', 'COMPANY') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        batch VARCHAR(10),
        branch VARCHAR(50),
        cgpa DECIMAL(3, 2),
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );

CREATE TABLE
    companies (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNIQUE,
        name VARCHAR(120),
        domain VARCHAR(80),
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (user_id) REFERENCES users (id)
    );

CREATE TABLE
    drives (
        id INT AUTO_INCREMENT PRIMARY KEY,
        company_id INT,
        title VARCHAR(150),
        min_cgpa DECIMAL(3, 2),
        deadline DATE,
        status ENUM ('DRAFT', 'OPEN', 'CLOSED', 'COMPLETED'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES companies (id)
    );

CREATE TABLE
    applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        drive_id INT,
        status ENUM ('APPLIED', 'SHORTLISTED', 'REJECTED', 'SELECTED'),
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (student_id, drive_id),
        FOREIGN KEY (student_id) REFERENCES students (id),
        FOREIGN KEY (drive_id) REFERENCES drives (id)
    );

CREATE TABLE
    rounds (
        id INT AUTO_INCREMENT PRIMARY KEY,
        drive_id INT,
        name VARCHAR(50),
        seq_no INT,
        FOREIGN KEY (drive_id) REFERENCES drives (id)
    );

CREATE TABLE
    round_results (
        student_id INT,
        round_id INT,
        status ENUM ('PASS', 'FAIL'),
        PRIMARY KEY (student_id, round_id),
        FOREIGN KEY (student_id) REFERENCES students (id),
        FOREIGN KEY (round_id) REFERENCES rounds (id)
    );

CREATE TABLE
    offers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT,
        drive_id INT,
        package DECIMAL(10, 2),
        status ENUM ('PENDING', 'ACCEPTED', 'REJECTED'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students (id),
        FOREIGN KEY (drive_id) REFERENCES drives (id)
    );

CREATE TABLE
    announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200),
        message TEXT,
        drive_id INT NULL,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expiry_date DATE,
        FOREIGN KEY (drive_id) REFERENCES drives (id),
        FOREIGN KEY (created_by) REFERENCES users (id)
    );

CREATE TABLE
    student_announcements (
        student_id INT,
        announcement_id INT,
        is_read BOOLEAN DEFAULT FALSE,
        read_at TIMESTAMP,
        PRIMARY KEY (student_id, announcement_id),
        FOREIGN KEY (student_id) REFERENCES students (id),
        FOREIGN KEY (announcement_id) REFERENCES announcements (id)
    );