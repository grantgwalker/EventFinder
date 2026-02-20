from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urlencode
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

app = Flask(__name__)
CORS(app)

def scrape_gigs_comedy_events(date_str=None, num_listings=120):
    """
    Scrape Gigs & Comedy events from Daily Info.
    
    Args:
        date_str: Date in format 'YYYY-MM-DD'. Defaults to today.
        num_listings: Number of listings to load (default: 120)
    
    Returns:
        List of event dictionaries
    """
    if date_str is None:
        date_str = datetime.now().strftime('%Y-%m-%d')
    
    # Category "1" is for Gigs & Comedy
    params = {
        'selectedDate': date_str,
        'sortBy': 'name',
        'numListingsLoaded': num_listings,
        'selectedCategory': '1',  # Gigs & Comedy
        'selectedTagIds': '',
        'tagMatchingStyle': ''
    }
    
    base_url = 'https://www.dailyinfo.co.uk/whats-on/listings'
    url = f"{base_url}?{urlencode(params)}"
    
    # Set up Chrome options for headless browsing
    chrome_options = Options()
    chrome_options.add_argument('--headless=new')  # Use new headless mode
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--disable-blink-features=AutomationControlled')
    chrome_options.add_argument('user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    chrome_options.add_experimental_option('excludeSwitches', ['enable-logging'])
    
    driver = None
    
    try:
     
        try:
            # Try with webdriver-manager
            service = Service(ChromeDriverManager().install())
            driver = webdriver.Chrome(service=service, options=chrome_options)
        except Exception as wdm_error:
            # Try without service (uses Chrome's built-in driver if available)
            driver = webdriver.Chrome(options=chrome_options)
        
        driver.get(url)
        
        # Wait for React to render the event listings
        # Wait up to 10 seconds for at least one eventListing section to appear
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.CLASS_NAME, 'eventListing')))
                
        # Get the page source after JavaScript has rendered
        page_source = driver.page_source
        soup = BeautifulSoup(page_source, 'html.parser')
        events = []
        
        # Find all event listings - actual class name is "eventListing" with capital L
        event_items = soup.find_all('section', class_='eventListing')        
        
        for idx, item in enumerate(event_items, start=1):
            try:
                # Extract title - it's in <h5 class="title"><a>...
                title_elem = item.find('h5', class_='title')
                title_text = title_elem.find('a').get_text(strip=True) if title_elem and title_elem.find('a') else 'Unknown Event'
                
                # Extract event URL
                link_elem = title_elem.find('a', href=True) if title_elem else None
                event_url = f"https://www.dailyinfo.co.uk{link_elem['href']}" if link_elem and link_elem.get('href') else ''
                
                # Extract description from <div class="description">
                desc_elem = item.find('div', class_='description')
                description = desc_elem.get_text(strip=True) if desc_elem else ''
                
                # Extract venue from <span class="venue"><a>...
                venue_elem = item.find('span', class_='venue')
                if venue_elem and venue_elem.find('a'):
                    venue_name = venue_elem.find('a').get_text(strip=True)
                else:
                    venue_name = 'Oxford'
                
                # Extract address - it's in the span after venue
                venue_container = item.find('div', class_='event-listing__date-times-prices-venue--venue')
                address = ''
                if venue_container:
                    address_elem = venue_container.find('span', class_='aml')
                    if address_elem:
                        address = address_elem.get_text(strip=True)
                
                location = f"{venue_name}, {address}" if address else venue_name
                
                # Extract time, price, and date from price spans
                # Format: {time} / {price} / {date}
                # All are in <span class="price"> elements
                price_spans = item.find_all('span', class_='price')
                
                time_text = ''
                price_text = ''
                date_text = date_str  # default to input date
                
                for span in price_spans:
                    text = span.get_text(strip=True)
                    
                    # Check if it's a date (contains month name)
                    if any(month in text for month in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                                                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']):
                        date_text = text
                    # Check if it's a time (contains 'am' or 'pm' or <b> tag for time)
                    elif 'am' in text.lower() or 'pm' in text.lower() or span.find('b'):
                        # Time is usually in a <b> tag
                        b_tag = span.find('b')
                        time_text = b_tag.get_text(strip=True) if b_tag else text
                    # Otherwise it's likely a price
                    elif text and text not in ['/', '']:
                        price_text = text
                
                # If no price found, set as "Free" or "N/A"
                if not price_text:
                    price_text = 'N/A'
                
                event = {
                    'id': idx,
                    'name': title_text,
                    'date': date_text,
                    'time': time_text,
                    'location': location,
                    'description': description[:200],
                    'price': price_text,
                    'category': 'Gigs & Comedy',
                    'url': event_url
                }
                
                events.append(event)
                print(f"Parsed event {idx}: {title_text}")
                
            except Exception as e:
                print(f"Error parsing event item {idx}: {e}")
                continue
        
        print(f"Successfully parsed {len(events)} events")
        return events
        
    except Exception as e:
        print(f"Error during scraping: {e}")
        return []
    
    finally:
        # Always close the browser
        if driver:
            driver.quit()
            print("Browser closed")


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'message': 'Python backend is running'
    })

@app.route('/api/events', methods=['GET'])
def get_events():
    """
    Get events from Daily Info.
    Query params:
    - date: Date in format YYYY-MM-DD (defaults to today)
    - category: Category ID (defaults to gigs-comedy)
    """
    date_param = request.args.get('date', None)
    category = request.args.get('category', 'gigs-comedy')
    
    if category == 'gigs-comedy':
        print(f"Fetching Gigs & Comedy events for date: {date_param or 'today'}")
        events = scrape_gigs_comedy_events(date_param)
    else:
        # For now, only Gigs & Comedy is implemented
        events = []
    
    return jsonify({
        'events': events,
        'count': len(events),
        'category': category,
        'date': date_param or datetime.now().strftime('%Y-%m-%d')
    })

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    # TODO: Implement event detail fetching
    return jsonify({
        'id': event_id,
        'name': f'Event {event_id}',
        'date': '2026-03-15',
        'location': 'Sample Location'
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
