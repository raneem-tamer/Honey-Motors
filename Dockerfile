FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Install additional libraries
RUN apt-get update && apt-get install -y \
    build-essential \
    libmysqlclient-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the app
CMD ["flask", "run", "--host=0.0.0.0"]
