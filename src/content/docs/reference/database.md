---
title: Database Setup
description: Configure database connections for Simple Likes.
---

Simple Likes supports any database that Laravel supports: **SQLite**, **MySQL**, **MariaDB**, **PostgreSQL**, and **SQL Server**.

## Using Your Default Database (Recommended)

By default, Simple Likes uses whatever database connection you've configured in your Laravel `.env` file:

```env
# Your main database settings (used by default)
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

Simple Likes will automatically create its `simple_likes` table in this database.

## Using a Different Database

If you want Simple Likes to use a **different** database than your main application (e.g., your Statamic site uses flat files but you want likes in MySQL), you can configure a separate connection.

### Step 1: Define the connection

Add to `config/database.php`:

```php
'connections' => [
    // Your existing connections...

    'simple_likes' => [
        'driver' => 'mysql',
        'host' => env('SIMPLE_LIKES_DB_HOST', '127.0.0.1'),
        'port' => env('SIMPLE_LIKES_DB_PORT', '3306'),
        'database' => env('SIMPLE_LIKES_DB_DATABASE', 'likes'),
        'username' => env('SIMPLE_LIKES_DB_USERNAME', 'root'),
        'password' => env('SIMPLE_LIKES_DB_PASSWORD', ''),
        'charset' => 'utf8mb4',
        'collation' => 'utf8mb4_unicode_ci',
        'prefix' => '',
        'strict' => true,
        'engine' => null,
    ],
],
```

### Step 2: Add credentials to `.env`

```env
# Simple Likes dedicated database
SIMPLE_LIKES_DB_CONNECTION=simple_likes
SIMPLE_LIKES_DB_HOST=127.0.0.1
SIMPLE_LIKES_DB_PORT=3306
SIMPLE_LIKES_DB_DATABASE=likes
SIMPLE_LIKES_DB_USERNAME=likes_user
SIMPLE_LIKES_DB_PASSWORD=secure_password
```

### Step 3: Run migration (if auto-migrate is disabled)

```bash
php artisan migrate
```

## SQLite Example

To use a dedicated SQLite database for likes:

```php
// config/database.php
'connections' => [
    'simple_likes' => [
        'driver' => 'sqlite',
        'database' => database_path('simple_likes.sqlite'),
        'prefix' => '',
        'foreign_key_constraints' => true,
    ],
],
```

```env
# .env
SIMPLE_LIKES_DB_CONNECTION=simple_likes
```

Create the SQLite file:

```bash
touch database/simple_likes.sqlite
```

## MariaDB Notes

MariaDB is fully compatible with the MySQL driver. Use `driver => 'mysql'` in your connection config - Laravel handles MariaDB automatically.

## Database Schema

Simple Likes creates a single table:

```sql
CREATE TABLE simple_likes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    entry_id VARCHAR(255) NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    user_type VARCHAR(20) DEFAULT 'authenticated',
    ip_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    INDEX idx_entry_id (entry_id),
    INDEX idx_user_id (user_id),
    INDEX idx_ip_hash (ip_hash),
    INDEX entry_created_index (entry_id, created_at),
    UNIQUE KEY unique_entry_user_like (entry_id, user_id)
);
```

### Column Descriptions

| Column | Description |
|--------|-------------|
| `entry_id` | Statamic entry UUID |
| `user_id` | User ID (authenticated) or `guest_` + hash (guest) |
| `user_type` | Either `authenticated` or `guest` |
| `ip_hash` | SHA256 hash of IP for abuse detection |

## Manual Migration

If you prefer to run migrations manually:

1. Disable auto-migrate:

```env
SIMPLE_LIKES_AUTO_MIGRATE=false
```

2. Publish the migration:

```bash
php artisan vendor:publish --tag=simple-likes-migrations
```

3. Run it:

```bash
php artisan migrate
```
