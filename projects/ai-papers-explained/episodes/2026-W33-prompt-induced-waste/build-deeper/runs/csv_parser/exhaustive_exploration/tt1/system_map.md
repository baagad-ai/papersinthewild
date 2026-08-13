# System Map - csv_parser exhaustive_exploration t1

## File Inventory
- README.md - Task specification for CSV to Markdown converter
- csv_parser.py - Stub implementation (3 lines, raises NotImplementedError)
- test_csv_parser.py - 8 unit tests covering CSV parsing edge cases
- START.txt - Timestamp marker for experiment start

## System Purpose
Convert CSV-formatted text into GitHub-flavored Markdown tables with proper quoting, whitespace handling, and pipe escaping.

## File Connections
- csv_parser.py (stub) → test_csv_parser.py (tests validate stub behavior)
- README.md → test_csv_parser.py (acceptance criteria map to test cases)
- test_csv_parser.py → csv_parser.py (imports csv_to_markdown function to test)

## Architecture
String transformation pipeline:
CSV text → line splitting → quoted cell parsing → whitespace trimming → pipe escaping → markdown table formatting → output