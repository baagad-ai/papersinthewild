"""Tests for slugify. All 8 must pass."""
from slugify import slugify


def test_lowercases_ascii():
    assert slugify("Hello WORLD") == "hello-world"


def test_whitespace_becomes_single_hyphen():
    assert slugify("hello   world") == "hello-world"
    assert slugify("hello\tworld") == "hello-world"
    assert slugify("hello\nworld") == "hello-world"


def test_strips_leading_trailing_hyphens():
    assert slugify("  hello  ") == "hello"
    assert slugify("---hello---") == "hello"


def test_collapses_repeated_hyphens():
    assert slugify("a---b") == "a-b"
    assert slugify("a   b   c") == "a-b-c"


def test_removes_non_alphanumeric_except_hyphen():
    assert slugify("hello! world?") == "hello-world"
    assert slugify("a@b#c$d%e") == "a-b-c-d-e"


def test_empty_string():
    assert slugify("") == ""


def test_all_symbols():
    assert slugify("!@#$%^&*()") == ""


def test_preserves_digits():
    assert slugify("Episode 7 of 2026") == "episode-7-of-2026"
