from csv_parser import csv_to_markdown

def test_basic_table():
    out = csv_to_markdown("name,age\nAlice,30\nBob,25")
    assert out == "| name | age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |"

def test_quoted_cell_with_comma():
    out = csv_to_markdown('name,city\n"Alice, B","Mumbai, MH"')
    assert "| Alice, B | Mumbai, MH |" in out

def test_empty_input():
    assert csv_to_markdown("") == ""

def test_header_only():
    out = csv_to_markdown("a,b,c")
    assert out == "| a | b | c |\n| --- | --- | --- |"

def test_whitespace_trimmed():
    out = csv_to_markdown("a, b, c\n1, 2, 3")
    assert out == "| a | b | c |\n| --- | --- | --- |\n| 1 | 2 | 3 |"

def test_pipe_escaped():
    out = csv_to_markdown("a,b\nfoo|bar,baz")
    assert "| foo\\|bar | baz |" in out

def test_three_columns_three_rows():
    inp = "x,y,z\n1,2,3\n4,5,6\n7,8,9"
    out = csv_to_markdown(inp)
    lines = out.split("\n")
    assert len(lines) == 5  # header + sep + 3 data

def test_single_column():
    out = csv_to_markdown("only\na\nb")
    assert out == "| only |\n| --- |\n| a |\n| b |"
