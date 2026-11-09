-- Ashirvad Hospital Management System - MySQL starter schema
-- Use fictional/demo data only until authentication, authorization, backups,
-- audit logging, and privacy/security review are implemented.

CREATE DATABASE IF NOT EXISTS ashirvad_hospital
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ashirvad_hospital;

CREATE TABLE IF NOT EXISTS patients (
  patient_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_code VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NULL,
  age SMALLINT UNSIGNED NULL,
  gender ENUM('FEMALE','MALE','OTHER','NOT_SPECIFIED') NOT NULL DEFAULT 'NOT_SPECIFIED',
  mobile VARCHAR(10) NULL,
  address VARCHAR(500) NULL,
  emergency_contact VARCHAR(10) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_patient_name (full_name),
  INDEX idx_patient_mobile (mobile)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS staff (
  staff_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  full_name VARCHAR(100) NOT NULL,
  role ENUM('DOCTOR','NURSE','RECEPTIONIST','ADMIN','OTHER') NOT NULL,
  mobile VARCHAR(10) NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS appointments (
  appointment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  doctor_id BIGINT NOT NULL,
  appointment_at DATETIME NOT NULL,
  status ENUM('BOOKED','COMPLETED','CANCELLED','NO_SHOW') NOT NULL DEFAULT 'BOOKED',
  notes VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id) REFERENCES staff(staff_id),
  INDEX idx_appointment_at (appointment_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS beds (
  bed_id TINYINT UNSIGNED PRIMARY KEY,
  bed_label VARCHAR(20) NOT NULL UNIQUE,
  status ENUM('AVAILABLE','OCCUPIED','RESERVED','MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admissions (
  admission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  bed_id TINYINT UNSIGNED NOT NULL,
  admitted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  discharged_at DATETIME NULL,
  admission_notes TEXT NULL,
  CONSTRAINT fk_admission_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  CONSTRAINT fk_admission_bed FOREIGN KEY (bed_id) REFERENCES beds(bed_id),
  INDEX idx_admission_dates (admitted_at, discharged_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prescriptions (
  prescription_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  doctor_id BIGINT NOT NULL,
  prescribed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  diagnosis VARCHAR(500) NULL,
  instructions TEXT NULL,
  CONSTRAINT fk_prescription_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id),
  CONSTRAINT fk_prescription_doctor FOREIGN KEY (doctor_id) REFERENCES staff(staff_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS prescription_items (
  item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  prescription_id BIGINT NOT NULL,
  medicine_name VARCHAR(150) NOT NULL,
  dosage VARCHAR(100) NULL,
  frequency VARCHAR(100) NULL,
  duration VARCHAR(100) NULL,
  CONSTRAINT fk_item_prescription FOREIGN KEY (prescription_id) REFERENCES prescriptions(prescription_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bills (
  bill_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  patient_id BIGINT NOT NULL,
  bill_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  discount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total DECIMAL(10,2) NOT NULL,
  payment_status ENUM('UNPAID','PARTIAL','PAID') NOT NULL DEFAULT 'UNPAID',
  CONSTRAINT fk_bill_patient FOREIGN KEY (patient_id) REFERENCES patients(patient_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bill_items (
  bill_item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  bill_id BIGINT NOT NULL,
  description VARCHAR(200) NOT NULL,
  quantity DECIMAL(8,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  line_total DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_bill_item_bill FOREIGN KEY (bill_id) REFERENCES bills(bill_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- Create the hospital's 5 beds as available.
INSERT IGNORE INTO beds (bed_id, bed_label, status) VALUES
(1,'Bed 1','AVAILABLE'),(2,'Bed 2','AVAILABLE'),(3,'Bed 3','AVAILABLE'),
(4,'Bed 4','AVAILABLE'),(5,'Bed 5','AVAILABLE');

-- Example read-only checks:
-- SELECT * FROM beds ORDER BY bed_id;
-- SELECT patient_id, patient_code, full_name, mobile FROM patients;
