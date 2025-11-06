# Symfony Demo with stimulus-sheet, Docker and MariaDB

This is a complete working example demonstrating how to use the `stimulus-sheet` component in a Symfony application with Docker and MariaDB.

## Features

- **Symfony 7.1** - Latest Symfony framework
- **Webpack Encore** - Modern asset management and bundling
- **stimulus-sheet** - Slide-in panel component
- **Turbo** - For seamless form submissions
- **Docker** - Containerized development environment
- **MariaDB** - Database backend
- **User CRUD** - Complete Create, Read, Update, Delete functionality
- **Form validation** - Server-side validation with Symfony forms
- **Panther Tests** - Browser-based tests for AJAX functionality

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- Git

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/gilles-g/sheet.git
cd sheet/examples/symfony
```

### 2. Start Docker containers

```bash
docker compose up -d
```

This will start three services:
- **nginx** - Web server (http://localhost:8000)
- **php** - PHP-FPM with Symfony
- **database** - MariaDB 11.4
- **mailer** - Mailpit for email testing (optional)

### 3. Install dependencies (if needed)

If dependencies weren't installed during build:

```bash
docker compose exec php composer install
```

### 4. Create the database and run migrations

```bash
# Create database
docker compose exec php php bin/console doctrine:database:create

# Run migrations
docker compose exec php php bin/console doctrine:migrations:migrate --no-interaction
```

### 5. Open your browser

Visit: http://localhost:8000

You should see the User Management interface!

## Usage

### Creating a User

1. Click the "Create New User" button
2. A sheet slides in from the right
3. Fill in the Name and Email fields
4. Click "Create User"
5. The sheet closes and the user list refreshes

### Editing a User

1. Click the "Edit" button next to any user
2. The sheet slides in with the form pre-filled
3. Modify the fields
4. Click "Update User"

### Deleting a User

1. Click the "Delete" button next to any user
2. Confirm the deletion
3. The user is removed from the list

## Project Structure

```
symfony/
├── assets/                          # Frontend assets
│   ├── controllers/                 # Stimulus controllers
│   │   └── sheet_opener_controller.js
│   ├── bootstrap.js                 # Stimulus app initialization
│   └── styles/
│       └── app.css                  # Application styles
├── config/                          # Symfony configuration
├── docker/                          # Docker configuration
│   └── nginx/
│       └── default.conf             # Nginx configuration
├── migrations/                      # Database migrations
├── public/                          # Web root
├── src/
│   ├── Controller/
│   │   └── UserController.php       # User CRUD controller
│   ├── Entity/
│   │   └── User.php                 # User entity
│   └── Form/
│       └── UserType.php             # User form
├── templates/
│   ├── base.html.twig               # Base template with sheet container
│   └── user/
│       ├── index.html.twig          # User list page
│       ├── _form_sheet.html.twig    # User form in sheet
│       └── _success_stream.html.twig # Turbo stream response
├── Dockerfile                       # PHP container definition
├── compose.yaml                     # Docker Compose configuration
└── compose.override.yaml            # Development overrides
```

## How It Works

### 1. Sheet Controller Registration

In `assets/bootstrap.js`, the sheet controllers are registered:

```javascript
import { SheetController, SheetListController } from 'stimulus-sheet';

app.register('sheet', SheetController);
app.register('sheet-list', SheetListController);
```

### 2. Sheet Container

In `templates/base.html.twig`, a sheet container is added:

```html
<div class="sheet-holder" data-controller="sheet-list">
    <div data-sheet-list-target="container"></div>
</div>
```

### 3. Opening Sheets

Buttons use the `sheet-opener` controller to load content:

```html
<button 
    data-controller="sheet-opener"
    data-action="click->sheet-opener#open"
    data-sheet-opener-url-value="{{ path('user_create_sheet') }}">
    Create New User
</button>
```

### 4. Form Handling

The controller renders forms for the sheet:

```php
#[Route('/users/create-sheet', name: 'user_create_sheet')]
public function createSheet(Request $request, EntityManagerInterface $em): Response
{
    $user = new User();
    $form = $this->createForm(UserType::class, $user);
    
    $form->handleRequest($request);
    
    if ($form->isSubmitted() && $form->isValid()) {
        $em->persist($user);
        $em->flush();
        
        return $this->render('user/_success_stream.html.twig', [
            'user' => $user,
            'action' => 'created',
        ]);
    }
    
    return $this->render('user/_form_sheet.html.twig', [
        'form' => $form,
    ]);
}
```

### 5. Closing Sheets

After successful submission, a Turbo Stream response closes the sheet:

```twig
<script>
    const sheets = document.querySelectorAll('[data-controller*="sheet"]');
    if (sheets.length > 0) {
        const lastSheet = sheets[sheets.length - 1];
        const closeBtn = lastSheet.querySelector('[data-action*="sheet#close"]');
        if (closeBtn) {
            closeBtn.click();
        }
    }
    window.location.reload();
</script>
```

## Docker Commands

### View logs

```bash
docker compose logs -f
```

### Stop containers

```bash
docker compose down
```

### Rebuild containers

```bash
docker compose up -d --build
```

### Access PHP container shell

```bash
docker compose exec php bash
```

### Access database

```bash
docker compose exec database mysql -u app -p
# Password: !ChangeMe!
```

### Clear Symfony cache

```bash
docker compose exec php php bin/console cache:clear
```

### Build frontend assets

```bash
docker compose exec php npm run build
```

Or for development with watch mode:

```bash
docker compose exec php npm run watch
```

## Testing

This demo includes browser-based tests using Symfony Panther to test AJAX functionality.

### Running Tests

```bash
# Run all tests
docker compose exec php php bin/phpunit

# Run specific test
docker compose exec php php bin/phpunit tests/SheetTest.php

# Run with verbose output
docker compose exec php php bin/phpunit --testdox
```

### What's Tested

The test suite (`tests/SheetTest.php`) includes:

- **Page Loading**: Verifies the user list page loads correctly
- **AJAX Sheet Opening**: Tests that clicking the create button opens a sheet via AJAX
- **Form Validation**: Ensures client-side and server-side validation works
- **User Creation**: Tests creating a user via AJAX and sheet closure
- **Close Button**: Verifies the close button properly closes the sheet
- **Edit Functionality**: Tests opening edit forms with pre-filled data via AJAX

### Test Requirements

Panther tests use a real browser (Chrome/Firefox) in headless mode. The tests will:

1. Download ChromeDriver automatically (first run only)
2. Launch a headless browser
3. Interact with the application like a real user
4. Verify AJAX requests and DOM updates

## Environment Variables

You can customize the application by setting environment variables in a `.env.local` file:

```env
# Database
MYSQL_DATABASE=app
MYSQL_USER=app
MYSQL_PASSWORD=!ChangeMe!
MYSQL_ROOT_PASSWORD=!ChangeMe!
MARIADB_VERSION=11.4

# Application
APP_ENV=dev
APP_SECRET=your-secret-key

# Web server
WEB_PORT=8000
```

## Troubleshooting

### Port already in use

If port 8000 is already in use, change it in `.env.local`:

```env
WEB_PORT=8080
```

Then restart: `docker compose up -d`

### Database connection refused

Wait for the database to be ready:

```bash
docker compose exec database healthcheck.sh --connect
```

### Permission issues

Fix permissions:

```bash
docker compose exec php chown -R www-data:www-data /var/www/html/var
```

### Assets not loading

Rebuild assets:

```bash
docker compose exec php php bin/console asset-map:compile
```

## Development

### Adding new fields to User

1. Update `src/Entity/User.php`
2. Create migration: `docker compose exec php php bin/console make:migration`
3. Run migration: `docker compose exec php php bin/console doctrine:migrations:migrate`
4. Update `src/Form/UserType.php`

### Creating new entities

```bash
docker compose exec php php bin/console make:entity
```

### Running tests

```bash
docker compose exec php php bin/phpunit
```

## Production Deployment

For production deployment:

1. Update environment variables in `.env.local`
2. Set `APP_ENV=prod`
3. Use proper secrets for passwords
4. Enable HTTPS
5. Configure proper database backups
6. Use Docker secrets for sensitive data

## Additional Resources

- [stimulus-sheet Documentation](https://github.com/gilles-g/sheet)
- [Symfony Documentation](https://symfony.com/doc/current/index.html)
- [Symfony UX Turbo](https://symfony.com/bundles/ux-turbo/current/index.html)
- [Docker Documentation](https://docs.docker.com/)
- [MariaDB Documentation](https://mariadb.org/documentation/)

## License

MIT

## Support

For issues specific to this demo, please open an issue on the [stimulus-sheet repository](https://github.com/gilles-g/sheet/issues).
