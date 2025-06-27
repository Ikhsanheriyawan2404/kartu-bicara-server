# Stage 1: Build dependencies
FROM node:18-alpine AS deps

# Set working directory
WORKDIR /app

# Copy only package files
COPY package*.json ./

# Install dependencies (faster & cleaner)
RUN npm ci

# Stage 2: Copy source and run
FROM node:18-alpine AS runner

ENV PORT=2567
WORKDIR /app

# Copy only needed files from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
COPY . .

EXPOSE 2567

CMD ["npm", "start"]
