"""
Test script to verify the web scraping function works.
Run this to see what data is being scraped.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from app import scrape_gigs_comedy_events
import json

if __name__ == '__main__':
    print("Testing Gigs & Comedy event scraping...")
    print("=" * 60)
    
    # Test with today's date
    events = scrape_gigs_comedy_events()
    
    print(f"\nFound {len(events)} events\n")
    
    if events:
        # Print first 3 events in detail
        for i, event in enumerate(events[:3], 1):
            print(f"Event {i}:")
            print(json.dumps(event, indent=2))
            print("-" * 60)
        
        if len(events) > 3:
            print(f"\n... and {len(events) - 3} more events")
    else:
        print("No events found. The HTML structure may have changed.")
        print("You may need to inspect the page and adjust the CSS selectors.")
        print("\nTo debug:")
        print("1. Visit: https://www.dailyinfo.co.uk/whats-on/listings?selectedCategory=1")
        print("2. Right-click on an event and 'Inspect Element'")
        print("3. Update the selectors in scrape_gigs_comedy_events() function")
