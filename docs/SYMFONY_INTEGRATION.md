# Symfony Integration Guide

This guide demonstrates how to use `stimulus-sheet` with Symfony, including forms, controllers, and Turbo integration.

## Prerequisites

- Symfony 6.0+ or 7.0+
- Symfony UX (symfony/ux-turbo)
- AssetMapper or Webpack Encore

## Installation

### Using AssetMapper (Recommended for Symfony 6.3+)

```bash
composer require symfony/ux-turbo
php bin/console importmap:require stimulus-sheet
php bin/console importmap:require @hotwired/stimulus
```

### Using Webpack Encore

```bash
composer require symfony/webpack-encore-bundle
composer require symfony/ux-turbo
npm install stimulus-sheet @hotwired/stimulus @hotwired/turbo
```

### Using Local Package File (Alternative)

If you have a local package file (e.g., from a private build or custom version):

```bash
# First, generate the package in the main library
npm run package

# Then in your Symfony project, install from the tarball
npm install /path/to/stimulus-sheet-2.0.0.tgz @hotwired/stimulus @hotwired/turbo

# Or extract and install from ZIP
unzip /path/to/stimulus-sheet-2.0.0.zip
npm install ./stimulus-sheet-temp @hotwired/stimulus @hotwired/turbo
```

Or add it directly in your `package.json`:

```json
{
  "dependencies": {
    "@hotwired/stimulus": "^3.2.2",
    "@hotwired/turbo": "^8.0.20",
    "stimulus-sheet": "file:../path/to/stimulus-sheet-2.0.0.tgz"
  }
}
```

## Setup

### 1. Configure Stimulus

```javascript
// assets/bootstrap.js
import { startStimulusApp } from '@symfony/stimulus-bridge';
import { SheetController, SheetListController } from 'stimulus-sheet';

// Start Stimulus
export const app = startStimulusApp(require.context(
    '@symfony/stimulus-bridge/lazy-controller-loader!./controllers',
    true,
    /\.[jt]sx?$/
));

// Register sheet controllers
app.register('sheet', SheetController);
app.register('sheet-list', SheetListController);
```

### 2. Import CSS

```css
/* assets/styles/app.css */
@import 'stimulus-sheet/dist/sheet.css';

/* Or with Webpack Encore */
@import '~stimulus-sheet/dist/sheet.css';
```

### 3. Add to Base Template

```twig
{# templates/base.html.twig #}
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{% block title %}Welcome!{% endblock %}</title>
    {% block stylesheets %}
        {{ encore_entry_link_tags('app') }}
    {% endblock %}
</head>
<body>
    {% block body %}{% endblock %}
    
    {# Sheet container - add this at the end of body #}
    <div class="sheet-holder" data-controller="sheet-list">
        <div data-sheet-list-target="container"></div>
    </div>
    
    {% block javascripts %}
        {{ encore_entry_script_tags('app') }}
    {% endblock %}
</body>
</html>
```

## Example 1: Basic Form in Sheet

### Controller

```php
<?php
// src/Controller/UserController.php
namespace App\Controller;

use App\Entity\User;
use App\Form\UserType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    #[Route('/users', name: 'user_list')]
    public function index(): Response
    {
        return $this->render('user/index.html.twig');
    }
    
    #[Route('/users/create-sheet', name: 'user_create_sheet')]
    public function createSheet(Request $request, EntityManagerInterface $em): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($user);
            $em->flush();
            
            // Redirect with Turbo Stream to close sheet and update list
            return $this->render('user/_success_stream.html.twig', [
                'user' => $user,
            ]);
        }
        
        return $this->render('user/_form_sheet.html.twig', [
            'form' => $form,
        ]);
    }
    
    #[Route('/users/{id}/edit-sheet', name: 'user_edit_sheet')]
    public function editSheet(User $user, Request $request, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(UserType::class, $user);
        
        $form->handleRequest($request);
        
        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            
            return $this->render('user/_success_stream.html.twig', [
                'user' => $user,
                'action' => 'update',
            ]);
        }
        
        return $this->render('user/_form_sheet.html.twig', [
            'form' => $form,
            'user' => $user,
        ]);
    }
}
```

### Form Type

```php
<?php
// src/Form/UserType.php
namespace App\Form;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class UserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Name',
                'attr' => ['class' => 'form-control'],
            ])
            ->add('email', EmailType::class, [
                'label' => 'Email',
                'attr' => ['class' => 'form-control'],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
        ]);
    }
}
```

### Templates

```twig
{# templates/user/index.html.twig #}
{% extends 'base.html.twig' %}

{% block body %}
<div class="container">
    <h1>Users</h1>
    
    <button 
        data-controller="sheet-opener"
        data-action="click->sheet-opener#open"
        data-sheet-opener-url-value="{{ path('user_create_sheet') }}"
        class="btn btn-primary">
        Create New User
    </button>
    
    <div id="user-list">
        {# User list here #}
    </div>
</div>
{% endblock %}
```

```twig
{# templates/user/_form_sheet.html.twig #}
<div class="sheet-content">
    <div class="sheet-header">
        <h2>{{ user is defined ? 'Edit User' : 'Create User' }}</h2>
        <button data-action="click->sheet#close" class="btn-close"></button>
    </div>
    
    <div class="sheet-scrollpane">
        <div class="sheet-content">
            {{ form_start(form, {
                'attr': {
                    'data-turbo': 'true',
                    'data-turbo-frame': 'user-form-frame'
                }
            }) }}
            
            <turbo-frame id="user-form-frame">
                <div class="mb-3">
                    {{ form_row(form.name) }}
                </div>
                
                <div class="mb-3">
                    {{ form_row(form.email) }}
                </div>
                
                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                        {{ user is defined ? 'Update' : 'Create' }}
                    </button>
                    <button type="button" 
                            data-action="click->sheet#close" 
                            class="btn btn-secondary">
                        Cancel
                    </button>
                </div>
            </turbo-frame>
            
            {{ form_end(form) }}
        </div>
    </div>
</div>
```

```twig
{# templates/user/_success_stream.html.twig #}
<turbo-stream action="append" target="user-list">
    <template>
        <div class="alert alert-success">
            User {{ action|default('created') }} successfully!
        </div>
    </template>
</turbo-stream>

<turbo-stream action="remove" target="user-form-frame">
    <template></template>
</turbo-stream>

{# This will trigger the sheet to close #}
<script>
    // Find and close the active sheet
    const sheets = document.querySelectorAll('[data-controller="sheet"]');
    if (sheets.length > 0) {
        const lastSheet = sheets[sheets.length - 1];
        const event = new CustomEvent('click');
        const closeBtn = lastSheet.querySelector('[data-action*="sheet#close"]');
        if (closeBtn) {
            closeBtn.click();
        }
    }
</script>
```

### Custom Stimulus Controller for Opening Sheets

```javascript
// assets/controllers/sheet_opener_controller.js
import { Controller } from '@hotwired/stimulus';
import { application } from '../bootstrap';

export default class extends Controller {
    static values = {
        url: String
    }
    
    async open(event) {
        event.preventDefault();
        
        // Get the sheet list controller
        const sheetListElement = document.querySelector('[data-controller="sheet-list"]');
        const sheetList = application.getControllerForElementAndIdentifier(
            sheetListElement,
            'sheet-list'
        );
        
        try {
            // Load content from the URL
            await sheetList.addSheetFromUrl(this.urlValue);
        } catch (error) {
            console.error('Failed to open sheet:', error);
            alert('Failed to load form');
        }
    }
}
```

## Example 2: Advanced with Turbo Streams

### Custom Turbo Stream Action

```javascript
// assets/turbo/streams/close_sheet.js
import * as Turbo from '@hotwired/turbo';
import { application } from '../bootstrap';

Turbo.StreamActions.close_sheet = function() {
    const sheetId = this.getAttribute('target');
    const sheetElement = document.getElementById(sheetId);
    
    if (sheetElement) {
        const sheetContainer = sheetElement.closest('[data-controller*="sheet"]');
        if (sheetContainer) {
            const controller = application.getControllerForElementAndIdentifier(
                sheetContainer,
                'sheet'
            );
            if (controller) {
                controller.close();
            }
        }
    }
};
```

Import this in your main JS file:

```javascript
// assets/app.js
import './turbo/streams/close_sheet';
```

### Use in Template

```twig
{# templates/user/_success_stream.html.twig #}
<turbo-stream action="append" target="notifications">
    <template>
        <div class="alert alert-success">User saved!</div>
    </template>
</turbo-stream>

<turbo-stream action="close_sheet" target="user-form-sheet">
    <template></template>
</turbo-stream>
```

## Example 3: DataTable Integration

```twig
{# templates/user/index.html.twig #}
<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {% for user in users %}
        <tr>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>
                <button 
                    data-controller="sheet-opener"
                    data-action="click->sheet-opener#open"
                    data-sheet-opener-url-value="{{ path('user_edit_sheet', {id: user.id}) }}"
                    class="btn btn-sm btn-primary">
                    Edit
                </button>
            </td>
        </tr>
        {% endfor %}
    </tbody>
</table>
```

## Example 4: API Platform Integration

For API Platform with Symfony UX:

```php
<?php
// src/Controller/Api/UserApiController.php
namespace App\Controller\Api;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/sheet')]
class UserApiController extends AbstractController
{
    #[Route('/users/{id}/edit', name: 'api_user_edit_sheet')]
    public function editSheet(User $user): Response
    {
        $form = $this->createForm(UserType::class, $user);
        
        return $this->render('api/user/_edit_sheet.html.twig', [
            'form' => $form,
            'user' => $user,
        ]);
    }
}
```

## Tips & Best Practices

### 1. Security

Always validate forms server-side:

```php
$form->handleRequest($request);

if ($form->isSubmitted() && $form->isValid()) {
    // Process form
}
```

### 2. Loading States

Add loading indicators:

```javascript
async open(event) {
    event.preventDefault();
    
    const button = event.currentTarget;
    button.disabled = true;
    button.textContent = 'Loading...';
    
    try {
        await sheetList.addSheetFromUrl(this.urlValue);
    } finally {
        button.disabled = false;
        button.textContent = 'Open';
    }
}
```

### 3. Error Handling

Handle errors gracefully:

```php
if ($form->isSubmitted() && $form->isValid()) {
    try {
        $em->persist($user);
        $em->flush();
        
        $this->addFlash('success', 'User saved!');
    } catch (\Exception $e) {
        $this->addFlash('error', 'Failed to save user.');
        
        return $this->render('user/_form_sheet.html.twig', [
            'form' => $form,
        ]);
    }
}
```

### 4. CSRF Protection

Symfony forms include CSRF protection by default. Ensure it's enabled:

```php
// config/packages/framework.yaml
framework:
    csrf_protection: true
```

## Troubleshooting

### Forms not submitting

- Check that Turbo is properly configured
- Verify CSRF tokens are present
- Check browser console for errors

### Sheet not closing after submit

- Ensure Turbo Stream response is correct
- Check JavaScript for close logic
- Verify form submission is successful

### Styles not applied

- Import CSS in correct order
- Check Webpack Encore configuration
- Clear cache: `php bin/console cache:clear`

## Advanced: Nested Sheets

The stimulus-sheet component supports stacking multiple sheets on top of each other, enabling complex workflows like creating related entities within a form.

### Use Case: Creating a Recipe with Ingredients

Imagine a recipe form where users can add ingredients. If the ingredient doesn't exist, they should be able to create it without leaving the current form.

**Implementation:**

1. **Parent Sheet**: Recipe ingredient form with ingredient selector and quantity field
2. **Nested Sheet**: Ingredient creation form opened from within the parent sheet

```twig
{# templates/recipe/_ingredient_form_sheet.html.twig #}
<div class="sheet-wrapper">
    <div class="sheet-header">
        <h2>Add Ingredient to Recipe</h2>
        <button data-action="click->sheet#close" class="btn-close"></button>
    </div>
    
    <div class="sheet-scrollpane">
        <div class="sheet-content">
            {{ form_start(form) }}
            
            <div class="mb-3">
                {{ form_row(form.ingredient) }}
            </div>
            
            <div class="mb-3">
                {{ form_row(form.quantity) }}
            </div>
            
            <button type="submit" class="btn btn-primary">
                Add Ingredient
            </button>
            
            {{ form_end(form) }}
            
            {# Button to open nested sheet for creating new ingredient #}
            <hr class="my-4">
            <div class="text-center">
                <p class="text-muted mb-2">Don't see the ingredient you need?</p>
                <button 
                    data-controller="sheet-opener"
                    data-action="click->sheet-opener#open"
                    data-sheet-opener-url-value="{{ path('ingredient_create_sheet') }}"
                    class="btn btn-outline-primary">
                    Create New Ingredient
                </button>
            </div>
        </div>
    </div>
</div>
```

**How it works:**

1. User clicks "Add Ingredient" → First sheet opens
2. User sees the ingredient selector but the desired ingredient isn't in the list
3. User clicks "Create New Ingredient" → Second sheet opens on top
4. User fills in the ingredient form and submits
5. Nested sheet closes, page reloads, and the new ingredient is now available in the selector

The stimulus-sheet component automatically handles the z-index stacking and overlay management for nested sheets.

## Complete Working Example

See the example Symfony project in the `examples/symfony` directory for a complete working implementation with Docker and MariaDB.

**[📖 View the Symfony Docker Demo](../examples/symfony/README.md)**

The demo includes:
- Complete Symfony 7.1 application
- Docker Compose setup with PHP, Nginx, and MariaDB
- User CRUD with stimulus-sheet integration
- **Nested sheets** for recipe and ingredient management
- Form validation and Turbo Streams
- One-command setup with `docker compose up`
