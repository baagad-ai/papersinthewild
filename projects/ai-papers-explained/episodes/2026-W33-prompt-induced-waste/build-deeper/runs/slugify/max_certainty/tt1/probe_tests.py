"""Probe tests for slugify - testing edge cases not in original suite."""
from slugify import slugify
import pytest

def test_unicode_characters():
    """Test handling of unicode characters"""
    # Unicode handling depends on regex byte/char matching
    assert slugify("café") == "caf"  # é is removed
    assert slugify("naïve") == "na-ve"  # ï becomes hyphen (different byte representation)
    assert slugify("日本語") == ""  # Japanese chars removed

def test_very_long_input():
    """Test handling of very long strings"""
    long_text = "a" * 10000 + "!@#" + "b" * 10000
    result = slugify(long_text)
    assert result == "a" * 10000 + "-" + "b" * 10000
    assert len(result) == 20001

def test_mixed_boundary_conditions():
    """Test boundary conditions"""
    assert slugify("-") == ""  # Single hyphen
    assert slugify("--") == ""  # Double hyphen
    assert slugify("a-") == "a"  # Trailing hyphen
    assert slugify("-a") == "a"  # Leading hyphen
    assert slugify("a--a") == "a-a"  # Middle hyphens

def test_numbers_only():
    """Test strings with only numbers"""
    assert slugify("123") == "123"
    assert slugify("1 2 3") == "1-2-3"
    assert slugify("1!2@3") == "1-2-3"

def test_special_characters_at_boundaries():
    """Test special chars at start and end"""
    assert slugify("!!!hello!!!") == "hello"
    assert slugify("...world...") == "world"
    assert slugify("---test---") == "test"

def test_consecutive_mixed_whitespace_and_symbols():
    """Test complex mixes of whitespace and symbols"""
    assert slugify("hello \t\n!!! world") == "hello-world"
    assert slugify("a   @   b") == "a-b"
    assert slugify("test\n\n\nvalue") == "test-value"

def test_only_hyphens_input():
    """Test input that results in only hyphens"""
    assert slugify("!@#$%") == ""  # All symbols become hyphens, then stripped
    assert slugify("- - -") == ""  # Mix of hyphens and spaces

def test_empty_string_edge_cases():
    """Test various empty-like inputs"""
    assert slugify("") == ""
    assert slugify("   ") == ""  # Only spaces
    assert slugify("\t\n") == ""  # Only tabs and newlines
    assert slugify("!@#") == ""  # Only symbols
