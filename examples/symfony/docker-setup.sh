#!/bin/bash

echo "🚀 Starting Symfony demo with Docker..."

# Stop any existing containers
echo "📦 Stopping existing containers..."
docker compose down

# Build and start containers
echo "🏗️  Building and starting containers..."
docker compose up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is ready (with timeout)
MAX_RETRIES=30
RETRY_COUNT=0
until docker compose exec -T database healthcheck.sh --connect --innodb_initialized &> /dev/null
do
    RETRY_COUNT=$((RETRY_COUNT+1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Database failed to start after $MAX_RETRIES attempts"
        echo "   Please check logs with: docker compose logs database"
        exit 1
    fi
    echo "   Database not ready yet, waiting... (attempt $RETRY_COUNT/$MAX_RETRIES)"
    sleep 5
done

echo "✅ Database is ready!"

# Create database
echo "🗄️  Creating database..."
docker compose exec -T php php bin/console doctrine:database:create --if-not-exists --no-interaction

# Run migrations
echo "🔄 Running migrations..."
docker compose exec -T php php bin/console doctrine:migrations:migrate --no-interaction

# Clear cache
echo "🧹 Clearing cache..."
docker compose exec -T php php bin/console cache:clear

echo ""
echo "✅ Setup complete!"
echo ""
echo "🌐 Access the application at: http://localhost:8000"
echo ""
echo "📊 Useful commands:"
echo "   - View logs:          docker compose logs -f"
echo "   - Stop containers:    docker compose down"
echo "   - Access PHP shell:   docker compose exec php bash"
echo "   - Access database:    docker compose exec database mysql -u app -p"
echo ""
