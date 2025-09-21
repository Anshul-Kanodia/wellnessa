# Wellnessa - Healthcare Platform

A React/Node.js frontend application that replicates the Wellnessa healthcare platform design.

## Features

- **Home Page**: Landing page with hero section, accreditations, product overview, how it works, and testimonials
- **About Page**: Company information, values, team, and why choose Wellnessa
- **Dashboard**: Multiple dashboard views including:
  - Hospital Homepage with patient management
  - Patient Dashboard (Admin View)
  - Patient Dashboard (Patient View)
  - Add Patient functionality

## Tech Stack

- **Frontend**: React 18, React Router DOM, CSS3
- **Backend**: Node.js, Express.js
- **Styling**: Custom CSS with CSS Variables
- **Fonts**: Inter (Google Fonts)

## Project Structure

```
figma-replica/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   └── index.js
├── package.json           # Root package.json
└── README.md
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install-all
   ```

## Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- React development server on http://localhost:3000
- Node.js API server on http://localhost:5000

## Individual Commands

- Start backend only: `npm run server`
- Start frontend only: `npm run client`
- Build for production: `npm run build`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/patients` - Get all patients
- `POST /api/patients` - Add new patient
- `GET /api/patient/:id` - Get patient details

## Design Features

- Modern healthcare UI with teal/green color scheme
- Responsive design for mobile and desktop
- Curved section dividers
- Professional card-based layouts
- Interactive dashboard components
- Modal dialogs for patient management

## Color Scheme

- Primary: #4A9B8E (Teal)
- Secondary: #F8F9FA (Light Gray)
- Text Dark: #2C3E50
- Text Light: #6C757D
- White: #FFFFFF

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License
