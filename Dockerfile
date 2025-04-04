FROM geoffreybooth/meteor-base:3.0.2 as builder

# Increase Node memory limit
ENV NODE_OPTIONS="--max-old-space-size=4096"
ENV METEOR_ALLOW_SUPERUSER=true

# Copy meteor app
COPY . /app
WORKDIR /app

# Clean cache and install dependencies
RUN rm -rf node_modules .meteor/local && \
	meteor npm cache clean --force && \
	meteor npm install --omit=dev

# Build the app outside the source tree
RUN cp package.json package.json.orig && \
	cp package.build.json package.json && \
	mkdir /build && \
	METEOR_DISABLE_AUTOMIGRATION=1 \
	meteor build --directory /build --server-only --allow-superuser \
	--architecture os.linux.x86_64 && \
	mv package.json.orig package.json

# Start new image
FROM node:20-slim

# Copy the built app
COPY --from=builder /build/bundle /app

WORKDIR /app/programs/server

# Install app dependencies
RUN npm install --omit=dev

WORKDIR /app

# Set environment variables
ENV PORT=3000

EXPOSE 3000

# Start the app without a settings file (use environment variables in production)
CMD ["node", "main.js"]