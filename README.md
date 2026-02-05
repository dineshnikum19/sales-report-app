# Sales Report Dashboard

A React frontend-only application for analyzing store sales data across multiple weeks. Upload Excel files and visualize sales performance by store, day, and hour.

## Features

- **Excel Upload**: Drag-and-drop or click to upload `.xlsx`, `.xls`, or `.csv` files
- **Data Validation**: Automatic validation and cleaning of uploaded data
- **4-Week Averaging**: Calculates average sales for each Store + Day + Hour combination
- **Lowest-First Sorting**: Results sorted by lowest average amount to identify underperforming time slots
- **Interactive Dashboard**: 
  - Filter by store and day
  - View data in paginated table
  - Visualize with bar or line charts
- **Data Persistence**: Data saved to localStorage for persistence across sessions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Expected Excel Format

Your Excel file must have these exact column headers:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| StoreName | Text | Name of the store | Downtown Store |
| StoreCode | Text | Unique store identifier | STORE001 |
| Amount | Number | Sales amount (≥ 0) | 1250.50 |
| Hour | Integer | Hour of day (0-23) | 14 |
| Day | Text | Day of week | Monday |
| Date | Date | Transaction date | 2024-01-15 |

### Sample Data Structure

```
StoreName    | StoreCode | Amount  | Hour | Day      | Date
-------------|-----------|---------|------|----------|------------
Downtown     | STORE001  | 1250.50 | 9    | Monday   | 2024-01-01
Downtown     | STORE001  | 890.25  | 10   | Monday   | 2024-01-01
Mall Store   | STORE002  | 2100.00 | 9    | Monday   | 2024-01-01
...
```

## How It Works

### Data Processing Pipeline

1. **Parse Excel**: Uses `xlsx` library to read Excel files in the browser
2. **Validate & Clean**: 
   - Checks Amount is a valid number ≥ 0
   - Validates Hour is 0-23
   - Ensures Day is not empty
   - Validates Date format
   - Confirms StoreCode is not empty
3. **Group Data**: Groups records by `StoreCode + Day + Hour`
4. **Calculate Averages**: For each group, calculates the average Amount (4-week average)
5. **Sort Results**: Sorts by lowest AvgAmount first

### Why Lowest First?

The dashboard prioritizes showing the lowest-earning time slots first because:
- Identifies underperforming store/day/hour combinations
- Helps managers make staffing decisions
- Reveals opportunities for promotions or operational improvements

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **xlsx** - Excel file parsing
- **Chart.js + react-chartjs-2** - Data visualization

## Project Structure

```
sales-report-app/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── UploadData.jsx    # File upload component
│   │   └── Dashboard.jsx     # Data table and charts
│   ├── utils/
│   │   └── dataProcessing.js # Data processing logic
│   ├── App.jsx               # Main app component
│   ├── main.jsx              # Entry point
│   └── index.css             # Tailwind imports
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## License

MIT
