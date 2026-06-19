FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# --- UPDATE THIS LINE TO SECURE THE CORRECT BINDINGS ---
RUN npm install --platform=linuxmusl --arch=x64

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
