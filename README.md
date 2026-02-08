# Campus Calories v2.0 - Nutrition Tracker

Campus Calories is a Progressive Web App (PWA) designed to help students track their nutrition accurately. It simplifies logging meals from the campus mess, ANC food court, and packaged foods, providing a comprehensive overview of daily calorie and protein intake.

## Key Features

*   **Smart Onboarding:** Personalized profile setup to calculate TDEE (Total Daily Energy Expenditure) and protein goals based on user metrics.
*   **Dashboard:** Visual progress rings for calories and protein, daily stats, and meal logs.
*   **Mess Menu Integration:** Log meals directly from the mess menu with accurate nutritional data. Includes a "Build Your Plate" feature for custom portions.
*   **ANC Food Court:** Browse and log items from the ANC food court menu.
*   **Packaged Foods:** Database of common packaged foods with search functionality.
*   **AI Calorie Estimator:** Describe your meal in natural language to get an estimated nutritional breakdown (Demo feature).
*   **Custom Logging:** Manually add food items with specific macro details.
*   **PWA Support:** Installable on mobile devices for a native app-like experience. Offline support included.
*   **Admin Panel:** Manage mess menus, operating hours, nutrition database, and export user data.

## Technology Stack

*   **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
*   **Styling:** Custom CSS variables and component-based architecture
*   **Icons:** Google Fonts (Inter), SVG Icons
*   **PWA:** Service Worker for offline capabilities and installation

## Setup & Installation

1.  **Clone or Download** the repository.
2.  **Serve Locally:** Since this is a static web application, you can serve it using any static file server.
    *   Using Python: `python -m http.server 8000`
    *   Using VS Code: Install "Live Server" extension and click "Go Live".
    *   Using Node.js: `npx serve .`
3.  **Open in Browser:** Navigate to `http://localhost:8000` (or the port provided by your server).

## Admin Access

To access the Admin Panel for managing menus and data:

1.  Open the side menu from the Dashboard.
2.  Click on "Admin Panel".
3.  **Default Password:** `campus2024`

## Project Structure

*   `index.html`: Main application entry point.
*   `admin.html`: Admin panel interface.
*   `css/`: Stylesheets for various components and screens.
*   `js/`: Application logic, including database management, menu data, and UI controllers.
*   `images/`: Icons and assets.
*   `sw.js`: Service Worker for PWA functionality.
*   `manifest.json`: Web App Manifest for installation configuration.

## License

This project is for educational and personal use.
