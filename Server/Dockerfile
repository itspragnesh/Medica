# Use official python slim image
FROM python:3.13-slim

# Install Tesseract OCR and dependencies
RUN apt-get update && apt-get install -y tesseract-ocr

# Set working directory inside container
WORKDIR /app

# Copy all your project files into container
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Node.js and npm (needed for your Node part)
RUN apt-get install -y curl \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Install Node.js packages
RUN npm install

# Expose port your Flask app will use (change if needed)
EXPOSE 5002

# Command to run your app (change if you start differently)
CMD ["npm", "start"]
