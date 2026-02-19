from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from urllib.parse import urlencode

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
    
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        events = []
        
        # Find all event listings - adjust selectors based on actual HTML structure
        event_items = soup.find_all('div', class_='event-item') or \
                     soup.find_all('article', class_='event') or \
                     soup.find_all('div', class_='listing-item')
        
        for idx, item in enumerate(event_items, start=1):
            try:
                # Extract event details - these selectors may need adjustment
                title_elem = item.find(['h2', 'h3', 'h4'], class_=['title', 'event-title', 'name'])
                date_elem = item.find(['time', 'span', 'div'], class_=['date', 'event-date'])
                location_elem = item.find(['span', 'div', 'p'], class_=['venue', 'location', 'place'])
                desc_elem = item.find(['p', 'div'], class_=['description', 'excerpt', 'summary'])
                link_elem = item.find('a', href=True)
                
                event = {
                    'id': idx,
                    'name': title_elem.get_text(strip=True) if title_elem else 'Unknown Event',
                    'date': date_elem.get_text(strip=True) if date_elem else date_str,
                    'location': location_elem.get_text(strip=True) if location_elem else 'Oxford',
                    'description': desc_elem.get_text(strip=True)[:200] if desc_elem else '',
                    'category': 'Gigs & Comedy',
                    'url': f"https://www.dailyinfo.co.uk{link_elem['href']}" if link_elem and link_elem.get('href') else ''
                }
                
                events.append(event)
            except Exception as e:
                print(f"Error parsing event item: {e}")
                continue
        
        return events
        
    except requests.RequestException as e:
        print(f"Error fetching events: {e}")
        return []
    except Exception as e:
        print(f"Unexpected error: {e}")
        return []


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
