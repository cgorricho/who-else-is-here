# Production Nginx proxy
FROM nginx:alpine

# Copy configuration files
COPY conf.d/ /etc/nginx/conf.d/

# Create SSL directory
RUN mkdir -p /etc/nginx/ssl

# Copy custom nginx.conf if needed
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]