"""Probe tests — edge cases beyond the original suite. Max-certainty verification."""
from slugify import slugify


def test_mixed_case_with_symbols():
    assert slugify("Hello, World!") == "hello-world"


def test_single_char():
    assert slugify("a") == "a"


def test_already_slug():
    assert slugify("hello-world") == "hello-world"


def test_numbers_only():
    assert slugify("12345") == "12345"


def test_whitespace_only():
    assert slugify("   ") == ""


def test_tab_newline_mix():
    assert slugify("a\t\nb") == "a-b"


def test_leading_digit():
    assert slugify("3 blind mice") == "3-blind-mice"


def test_long_input():
    inp = "a " * 100
    out = slugify(inp)
    assert out.count("-") == 99
    assert out.startswith("a-") and out.endswith("-a")


def test_type_error_on_non_str():
    import pytest
    with pytest.raises(TypeError):
        slugify(123)
