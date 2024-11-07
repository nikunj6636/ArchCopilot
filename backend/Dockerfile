FROM python:3.10-slim

# Create a new user
RUN useradd -m -r flaskuser

# Set working directory
WORKDIR /home/backend

# Copy requirements.txt
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Set ownership of the application files
RUN chown -R flaskuser:flaskuser /home/backend

# Switch to the new user
USER flaskuser

# Expose the port the app runs on
EXPOSE 5000

# Run the application
CMD ["python3", "config.py"]