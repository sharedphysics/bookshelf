#!/bin/bash
# Simple local web server for testing the bookshelf widget

echo "🚀 Starting local web server..."
echo ""
echo "📚 Open your browser to:"
echo "   http://localhost:8000/bookshelf-widget.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start Python's built-in web server
python3 -m http.server 8000
