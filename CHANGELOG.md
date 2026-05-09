# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-08

### Added
- **Full-Stack Application**: Initial release of the movie recommendation platform.
- **Frontend**: React 19 application built with Vite, featuring authentication, search, and personalized recommendations.
- **Backend**: Express 5 server with JWT-based security.
- **AI Integration**: Personalized recommendations and smart search powered by Google Gemini AI.
- **Database**: MySQL integration using Sequelize ORM with models for Users, Favorites, Watchlist, and History.
- **Containerization**: Docker support for the backend server with an optimized Node 20 Alpine image.
- **Testing**: Comprehensive unit test suite with Jest for controllers (Auth, Movies, Search).
- **Automation**: Deployment script (`deploy.sh`) with built-in test validation and rollback mechanisms.

### Changed
- **Project Structure**: Reorganized test files into a centralized `tests/` directory within the server.
- **Deployment**: Relocated the `deploy.sh` script to the root directory for easier access.

### Documentation
- **README**: Added instructions for running tests and setup guides.
