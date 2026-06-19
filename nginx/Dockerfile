FROM nginx:1.25-alpine

# Remove the default configuration file that comes with Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom default.conf file into the container configuration folder
COPY default.conf /etc/nginx/conf.d/
