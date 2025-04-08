FROM geoffreybooth/meteor-base:3.0.2 as builder

# Increase Node memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV METEOR_ALLOW_SUPERUSER=true

# Ensure Node.js is available in the PATH
ENV PATH="/usr/local/bin:$PATH"

# Install Node.js explicitly to ensure the binary is available
RUN apt-get update && apt-get install -y nodejs

# Copy meteor app
COPY . /app
WORKDIR /app

# Fix permissions for .meteor/local
RUN chown -R root:root .meteor/local || true

# Install project dependencies, including Tailwind CSS and PostCSS
RUN meteor npm install

# Run Tailwind CSS using the locally installed binary
RUN ./node_modules/.bin/tailwindcss -i ./client/css/main.css -o ./client/css/output.css

# Build the app
RUN meteor build --directory /build --server-only --allow-superuser \
	--architecture os.linux.x86_64

# Start new image
FROM node:20-slim

# Copy the built app
COPY --from=builder /build/bundle /app

WORKDIR /app/programs/server

# Install production dependencies
RUN npm install --omit=dev

WORKDIR /app

# Set environment variables
ENV PORT=3000

EXPOSE 3000

# Start the app
CMD ["node", "main.js"]