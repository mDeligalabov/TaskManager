# Task Management System

A simple PHP admin panel for managing tasks and users, designed to work with a RESTful API backend.

## Prerequisites

- **XAMPP** (or any local PHP server)
- **Composer** (for PHP dependency management)

## Quick Start

1. Install XAMPP and ensure Apache is running.
2. Install Composer from [https://getcomposer.org/](https://getcomposer.org/).
3. Clone or copy this project into your XAMPP `htdocs` directory. 
4. Run `composer install` in the project root if you need to install dependencies.
5. Create a `.env` file using the `.example.env`
6. Access the app at `http://localhost/{folder-name}/public/` (Replace `folder-name` with the folder name that was coppied in `htdocs` dir)


## Docker

To build a local image, supply the env variables as build arguments:
```
docker build --build-arg API_BASE=api-base-url -t image-name . 
```