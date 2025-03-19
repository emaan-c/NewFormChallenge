import sys
import pandas as pd
import re

def load_csv(filepath: str) -> pd.DataFrame:
    """Load CSV file into a DataFrame or exit on failure."""
    try:
        return pd.read_csv(filepath)
    except Exception as e:
        print(f"Error loading CSV file: {e}")
        sys.exit(1)

def parse_query(query: str):
    """Parse a simplified SQL-like query and return its components."""
    pattern = re.compile(
        r"""
        SELECT\s+(?P<select>.*?)\s+
        FROM\s+\w+
        (?:\s+WHERE\s+(?P<where>.*?))?
        (?:\s+ORDER\s+BY\s+(?P<order_by>.*?)\s+(?P<order_dir>ASC|DESC))?
        (?:\s+LIMIT\s+(?P<limit>\d+))?$
        """,
        re.IGNORECASE | re.VERBOSE,
    )
    match = pattern.match(query)
    if not match:
        raise ValueError("Invalid query syntax.")
    return match.group('select', 'where', 'order_by', 'order_dir', 'limit')

def evaluate_query(df: pd.DataFrame, components):
    """Evaluate the query on the DataFrame and print results in CSV format."""
    select_cols, where_clause, order_by, order_dir, limit = components

    # Determine columns to select
    if select_cols.strip() == '*':
        selected_columns = list(df.columns)
    else:
        selected_columns = [col.strip() for col in select_cols.split(',')]

    # Apply WHERE clause if provided
    if where_clause:
        query_str = re.sub(
            r'(\w+)\s*([=!<>]+)\s*(\".*?\"|\'.*?\'|\d+)',
            r'`\1` \2 \3',
            where_clause,
            flags=re.IGNORECASE
        )
        query_str = re.sub(r'(?<!!)=(?!=)', '==', query_str).replace('<>', '!=')
        query_str = re.sub(r'\bAND\b', 'and', query_str, flags=re.IGNORECASE)
        query_str = re.sub(r'\bOR\b', 'or', query_str, flags=re.IGNORECASE)
        query_str = re.sub(r'\bNOT\b', 'not', query_str, flags=re.IGNORECASE)
        query_str = re.sub(r'\bIN\b', 'in', query_str, flags=re.IGNORECASE)
        try:
            df = df.query(query_str)
        except Exception as e:
            print(f"Error in WHERE clause: {e}")
            return

    # Apply ORDER BY if provided
    if order_by:
        if order_by not in df.columns:
            print("Error: ORDER BY column does not exist.")
            return
        ascending = order_dir.upper() == 'ASC'
        try:
            df = df.sort_values(by=order_by, ascending=ascending)
        except Exception as e:
            print(f"Error sorting data: {e}")
            return

    # Validate selected columns exist
    missing_cols = [col for col in selected_columns if col not in df.columns]
    if missing_cols:
        print(f"Error: Columns not found: {', '.join(missing_cols)}")
        return

    try:
        df = df[selected_columns]
    except Exception as e:
        print(f"Error selecting columns: {e}")
        return

    # Apply LIMIT if provided
    if limit:
        try:
            df = df.head(int(limit))
        except Exception as e:
            print(f"Error applying LIMIT: {e}")
            return

    # Print results only if there are rows
    if df.empty:
        return

    try:
        print(df.to_csv(index=False))
    except Exception as e:
        print(f"Error outputting CSV: {e}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python query_tool.py <filepath>")
        sys.exit(1)

    df = load_csv(sys.argv[1])

    print("Enter queries (separate with ';'). Press Ctrl+D to finish:")
    queries_input = sys.stdin.read().strip()
    if not queries_input:
        print("No queries provided.")
        return

    for query in [q.strip() for q in queries_input.split(';') if q.strip()]:
        try:
            components = parse_query(query)
        except ValueError as e:
            print(f"Error: {e}")
            continue
        evaluate_query(df, components)

if __name__ == '__main__':
    main()

