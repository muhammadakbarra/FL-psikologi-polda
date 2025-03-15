#!/bin/bash

# Cek apakah ada proses yang menggunakan port 3000
PID=$(lsof -t -i:3000)

if [ -n "$PID" ]; then
  echo "Port 3000 sedang digunakan oleh proses $PID. Membunuh proses..."
  kill -9 $PID
fi

# Jalankan aplikasi di port 3000
echo "Menjalankan aplikasi di port 3000..."
npm run dev
