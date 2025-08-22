"""
GenomicsPy - Python Genomics Toolkit

A comprehensive toolkit for NGS data analysis, variant calling, and genomic visualization.

Author: John Smith, Jane Doe
Version: 1.0.0
License: MIT
"""

__version__ = "1.0.0"
__author__ = "John Smith, Jane Doe"
__email__ = "support@genomicspy.org"

from .sequence import *
from .variants import *
from .quality import *
from .visualization import *
from .utils import *

# Main functions
def load_vcf(filepath):
    """Load VCF file and return parsed data structure."""
    from .variants import VCFParser
    parser = VCFParser()
    return parser.load(filepath)

def variant_stats(vcf_data):
    """Calculate basic statistics for variant data."""
    from .variants import VariantAnalyzer
    analyzer = VariantAnalyzer(vcf_data)
    return analyzer.get_statistics()

def filter_quality(vcf_data, min_qual=30):
    """Filter variants by quality score."""
    from .variants import VariantFilter
    filter_obj = VariantFilter()
    return filter_obj.filter_by_quality(vcf_data, min_qual)

def plot_variant_distribution(vcf_data):
    """Create distribution plot of variants."""
    from .visualization import VariantPlotter
    plotter = VariantPlotter()
    return plotter.distribution_plot(vcf_data)