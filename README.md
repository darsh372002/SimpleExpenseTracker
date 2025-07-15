# 💸 Expense Splitter Web App

A simple and intuitive web application for **splitting group expenses** fairly and transparently.

## 📌 Overview

**Expense Splitter** allows users to:
- Add shared expenses (item, amount, payer, participants)
- View a clear breakdown of who owes what
- Track individual balances
- See history of expenses per person
- Export the results via CSV, PDF, or WhatsApp format

Ideal for trips, group events, roommates, or office teams managing shared costs.
---

## 🛠 Features

### ✅ Add Expenses
- Record expense item, amount, payer, participants
- Automatically tags people with colors
- Tracks date of each expense

### 📃 View Expense List
- Displays all added entries with item, payer, amount, participants, and date

### ➗ Calculate Balances
- Computes who owes whom using a fair-share algorithm
- Includes a settlement summary: `Alice pays Bob ₹200`

### 🧾 Expense History by Person
- For each individual:
  - Shows what they paid and shared in
  - Useful for transparency and reviews

### 🎨 UI Enhancements
- Color-coded tags for each person
- Smooth animations with GSAP
- Clean, responsive layout

### 📤 Export Options
- **CSV**: Download as spreadsheet
- **PDF**: Print-friendly version
- **WhatsApp**: Copy text summary ready for pasting

---

## 🧠 How It Works

1. **Input Handling**:
   - Collects form inputs and validates them
   - Stores them in an `expenses` array

2. **Calculation Logic**:
   - Distributes cost fairly among payer and participants
   - Tracks net balances in a dictionary
   - Uses a greedy algorithm to determine settlement payments

3. **DOM Manipulation**:
   - Dynamically updates UI with expense items, balances, and summaries

4. **Export Handling**:
   - Generates downloadable CSV using Blob API
   - Uses `window.print()` for PDF
   - Generates WhatsApp-formatted message and copies to clipboard
---
