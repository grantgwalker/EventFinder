# Web Scraping Module

## What I've Created

I've added a `scrape_gigs_comedy_events()` function that scrapes Gigs & Comedy events from Daily Info (category "1").

## Setup

1. **Install dependencies:**

```bash
pip install beautifulsoup4 lxml
```

Or:

```bash
pip install -r requirements.txt
```

2. **Test the scraper:**

```bash
python test_scraper.py
```

## How It Works

The function:

- Fetches the Daily Info listings page for Gigs & Comedy (category "1")
- Parses the HTML using BeautifulSoup
- Extracts event details: name, date, location, description, URL
- Returns a list of event dictionaries

## API Usage

**Get Gigs & Comedy events:**

```
GET http://localhost:8000/api/events?category=gigs-comedy
```

**Get events for a specific date:**

```
GET http://localhost:8000/api/events?category=gigs-comedy&date=2026-02-25
```

## Response Format

```json
{
  "events": [
    {
      "id": 1,
      "name": "Event Name",
      "date": "2026-02-19",
      "location": "Venue Name, Oxford",
      "description": "Event description...",
      "category": "Gigs & Comedy",
      "url": "https://www.dailyinfo.co.uk/..."
    }
  ],
  "count": 10,
  "category": "gigs-comedy",
  "date": "2026-02-19"
}
```

## Important Notes

⚠️ **HTML Selectors May Need Adjustment**

The CSS selectors in the scraping function are generic and may not match Daily Info's actual HTML structure. You'll likely need to:

1. Visit the website: https://www.dailyinfo.co.uk/whats-on/listings?selectedCategory=1
2. Right-click on an event → Inspect Element
3. Look at the HTML structure
4. Update the selectors in `scrape_gigs_comedy_events()` in [app.py](app.py)

Look for patterns like:

- Event container: `<div class="event-card">` or `<article class="listing">`
- Title: `<h2 class="event-title">` or `<h3 class="title">`
- Date: `<time>` or `<span class="date">`
- Venue: `<div class="venue">` or `<span class="location">`

## Next Steps

1. Test the scraper with `python test_scraper.py`
2. If it returns empty results, inspect the HTML and update selectors
3. Once working, you can add more category functions:
   - `scrape_cinema_events()` (category "3")
   - `scrape_concerts_events()` (category "6")
   - `scrape_theatre_events()` (category "2")
   - etc.

## Troubleshooting

**No events returned:**

- Check if the website structure has changed
- Update CSS selectors in the function
- Make sure the website is accessible

**Connection errors:**

- Check your internet connection
- The website may have rate limiting
- Try adding delays between requests

**Parsing errors:**

- The HTML structure may not match the selectors
- Use the test script to debug
- Print `soup.prettify()` to see the HTML structure
