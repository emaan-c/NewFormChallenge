# CSV Query Tool

A command-line tool that queries CSV data using a simplified SQL-like syntax.

## Description

This utility allows you to query CSV files using familiar SQL commands. It supports:
- SELECT statements (specific columns or all columns with *)
- WHERE conditions with comparison operators (=, !=, <, >)
- Logical operators (AND, OR) and parentheses
- ORDER BY with ASC/DESC options
- LIMIT clause

## Requirements

- Python 3.6+
- pandas library

## Installation

```bash
pip install pandas
```

## Usage

```bash
python backend_challenge.py <csv_file_path>
```

After running the command, you can enter one or more queries separated by semicolons (;). Press Ctrl+D (Unix) or Ctrl+Z followed by Enter (Windows) when you've finished entering queries.

## Query Syntax

```
SELECT <columns> FROM table [WHERE <conditions>] [ORDER BY <column> [ASC|DESC]] [LIMIT <n>]
```

Where:
- `<columns>` is either `*` or a comma-separated list of column names
- `<conditions>` are expressions using =, !=, <, >, AND, OR with parentheses for grouping
- `<column>` is the name of a column to sort by
- `<n>` is the maximum number of rows to return

## Example

For a CSV file with columns: state, region, pop, pop_male, pop_female

```bash
python backend_challenge.py example.csv
```

Then enter queries:

```
SELECT state FROM table WHERE pop > 1000000 AND state != 'California';
SELECT * FROM table WHERE pop > 1000000000 OR (pop > 1000000 AND region = 'Midwest') ORDER BY state DESC LIMIT 2;
SELECT state, pop FROM table WHERE pop_female < pop_male LIMIT 1;
```

## Output

Results are printed to standard output in CSV format.

## Error Handling

The tool provides error messages for common issues:
- Missing or invalid CSV files
- Invalid query syntax
- Non-existent column references
- Type mismatches in comparisons

## Limitations

- No support for GROUP BY, JOIN, DISTINCT, or subqueries
- String comparisons only support equality (= and !=)
- Numeric comparisons (<, >) only work on numeric columns 